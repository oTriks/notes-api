import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userSchema from '../validators/userValidator.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const handler = async (event) => {
    const { email, password } = JSON.parse(event.body);

    const { error } = userSchema.validate({ email, password });
    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.details[0].message }),
        };
    }

    const params = {
        TableName: 'UsersTable',
        Key: { email },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        const user = result.Item;

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials.' }),
            };
        }

        const token = jwt.sign({ userId: email }, JWT_SECRET, { expiresIn: '1h' });

        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } catch (error) {
        console.error('DynamoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not log in. Please try again later.' }),
        };
    }
};
