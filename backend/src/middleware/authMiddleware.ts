import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

interface AuthorizedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

// JWT Authentication Middleware
const authorizeJWT = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.header('Authorization');

  if (!accessToken || !process.env.JWT_ACCESS_TOKEN_SECRET) {
    return res.status(401).json({ success: 0, error: 'Access Denied - Missing Token or Missing Token Secret' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ success: 0, error: 'Access Denied - Invalid Token' });
  }
};

export { authorizeJWT };
