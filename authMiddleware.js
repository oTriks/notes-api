import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = () => ({
    before: async (handler) => {
        const token = handler.event.headers?.Authorization;

        console.log('Authorization Header:', token);

        if (!token || !token.startsWith('Bearer ')) {
            console.error('Unauthorized: Missing or malformed token');
            throw new Error('Unauthorized');
        }

        try {
            const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
            console.log('Decoded Token:', decoded);
            handler.event.auth = decoded;
        } catch (error) {
            console.error('Token verification failed:', error.message);
            throw new Error('Unauthorized');
        }
    },
});

export default authMiddleware;
