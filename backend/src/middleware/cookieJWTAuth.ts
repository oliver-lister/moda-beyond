import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import 'dotenv/config';
import { AuthorizedRequest } from '../routes/userRoutes/userRoutes';

// JWT Authentication Middleware
const cookieJWTAuth = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!accessToken || !tokenSecret) {
    return res.status(401).json({ success: false, error: 'Access denied, missing token or missing token secret', errorCode: 'MISSING_TOKEN' });
  }

  try {
    const decoded = jwt.verify(accessToken, tokenSecret);
    // if expired attempt to refresh
    req.user = decoded;
    next();
  } catch (err: any) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(403).json({ success: false, error: `Access denied, invalid token: ${err.message}`, errorCode: 'INVALID_TOKEN' });
  }
};

export { cookieJWTAuth };
