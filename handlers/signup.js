import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import userSchema from '../validators/userValidator.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    const { email, password } = JSON.parse(event.body);

    const { error } = userSchema.validate({ email, password });
    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.details[0].message }),
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const params = {
        TableName: 'UsersTable',
        Item: {
            email,
            password: hashedPassword,
        },
        ConditionExpression: 'attribute_not_exists(email)',
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully.' }),
        };
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User already exists.' }),
            };
        }
        console.error('DynamoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not create user. Please try again later.' }),
        };
    }
};
