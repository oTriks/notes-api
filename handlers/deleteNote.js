import AWS from 'aws-sdk';
import middy from '@middy/core';
import authMiddleware from '../authMiddleware.js';
import { deleteNoteSchema } from '../validators/noteValidator.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const deleteNote = async (event) => {
    const userId = event.auth.userId;
    const { noteId } = JSON.parse(event.body);

    const { error } = deleteNoteSchema.validate({ noteId });
    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.details[0].message }),
        };
    }

    const params = {
        TableName: 'NotesTable',
        Key: {
            userId,
            noteId,
        },
        UpdateExpression: 'SET deleted = :deleted',
        ExpressionAttributeValues: {
            ':deleted': true,
        },
        ConditionExpression: 'attribute_exists(noteId)', // Ensure the note exists before marking as deleted
    };

    try {
        await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note marked as deleted.' }),
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
            body: JSON.stringify({ message: 'Could not delete note. Please try again later.' }),
        };
    }
};

export const handler = middy(deleteNote).use(authMiddleware());
