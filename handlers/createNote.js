import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import middy from '@middy/core';
import authMiddleware from '../authMiddleware.js';
import { createNoteSchema } from '../validators/noteValidator.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createNote = async (event) => {
    const userId = event.auth.userId;
    const { title, text } = JSON.parse(event.body);

    const { error } = createNoteSchema.validate({ title, text });

    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.details[0].message }),
        };
    }

    const noteId = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
        TableName: 'NotesTable',
        Item: {
            userId,
            noteId,
            title,
            text,
            createdAt: timestamp,
            modifiedAt: timestamp,
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Note created successfully.', noteId }),
        };
    } catch (error) {
        console.error('DynamoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not create note. Please try again later.' }),
        };
    }
};

export const handler = middy(createNote).use(authMiddleware());
