import AWS from 'aws-sdk';
import middy from '@middy/core';
import authMiddleware from '../authMiddleware.js';
import { updateNoteSchema } from '../validators/noteValidator.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateNote = async (event) => {
    const userId = event.auth.userId;
    const { noteId, title, text } = JSON.parse(event.body);

    const { error } = updateNoteSchema.validate({ noteId, title, text });
    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.details[0].message }),
        };
    }

    const timestamp = new Date().toISOString();

    const params = {
        TableName: 'NotesTable',
        Key: {
            userId,
            noteId,
        },
        UpdateExpression: 'SET #title = :title, #text = :text, modifiedAt = :modifiedAt',
        ExpressionAttributeNames: {
            '#title': 'title',
            '#text': 'text',
        },
        ExpressionAttributeValues: {
            ':title': title,
            ':text': text,
            ':modifiedAt': timestamp,
        },
        ConditionExpression: 'attribute_exists(noteId)',
    };

    try {
        await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note updated successfully.' }),
        };
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Note not found.' }),
            };
        }
        console.error('DynamoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not update note. Please try again later.' }),
        };
    }
};

export const handler = middy(updateNote).use(authMiddleware());
