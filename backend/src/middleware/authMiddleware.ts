import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import 'dotenv/config';
import { AuthorizedRequest } from '../routes/userRoutes/userRoutes';

// JWT Authentication Middleware
const authorizeJWT = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.header('Authorization');
  const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!accessToken) {
    return res.status(401).json({ success: false, error: 'Access denied, missing token or missing token secret', errorCode: 'MISSING_TOKEN' });
  }

  if (!tokenSecret) {
    return res.status(400).json({ success: false, error: 'Bad request: Missing token secret', errorCode: 'MISSING_TOKEN_SECRET' });
  }

  try {
    const decoded = jwt.verify(accessToken, tokenSecret);
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(403).json({ success: false, error: `Access denied, invalid token: ${err.message}`, errorCode: 'INVALID_TOKEN' });
  }
};

export { authorizeJWT };
