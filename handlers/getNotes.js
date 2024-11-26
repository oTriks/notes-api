import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import authMiddleware from '../authMiddleware.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getNotes = async (event) => {
    const userId = event.auth.userId;

    const params = {
        TableName: 'NotesTable',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':deleted': true,
        },
        FilterExpression: 'attribute_not_exists(deleted) OR deleted <> :deleted',
    };

    try {
        const data = await dynamoDb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('DynamoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not retrieve notes. Please try again later.' }),
        };
    }
};

export const handler = middy(getNotes)
    .use(authMiddleware())
    .use(httpErrorHandler());