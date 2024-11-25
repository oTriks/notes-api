import AWS from 'aws-sdk';
import middy from '@middy/core';
import authMiddleware from '../authMiddleware.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const restoreNote = async (event) => {
    const userId = event.auth.userId;
    const { noteId } = JSON.parse(event.body);

    if (!noteId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Note ID is required.' }),
        };
    }

    const params = {
        TableName: 'NotesTable',
        Key: {
            userId,
            noteId,
        },
        UpdateExpression: 'REMOVE deleted',
        ConditionExpression: 'attribute_exists(noteId) AND deleted = :deleted',
        ExpressionAttributeValues: {
            ':deleted': true,
        },
    };

    try {
        await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Note restored successfully.' }),
        };
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Note not found or not deleted.' }),
            };
        }
        console.error('DynamoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not restore note. Please try again later.' }),
        };
    }
};

export const handler = middy(restoreNote).use(authMiddleware());
