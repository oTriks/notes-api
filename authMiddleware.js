import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = () => ({
    before: async (handler) => {
        const token = handler.event.headers?.Authorization;

        if (!token || !token.startsWith('Bearer ')) {
            throw new createError.Unauthorized('Unauthorized: Missing or malformed token');
        }

        try {
            const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
            handler.event.auth = decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.error('Token verification failed: Token expired');
                throw new createError.Unauthorized('Token expired');
            }
            console.error('Token verification failed:', error.message);
            throw new createError.Unauthorized('Unauthorized');
        }
    },
});

export default authMiddleware;
