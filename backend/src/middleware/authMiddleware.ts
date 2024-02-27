import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

// JWT Authentication Middleware
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('accessToken');

  if (!token) {
    return res.status(401).json({ success: 0, error: 'Access Denied - Missing Token' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_ecom');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ success: 0, error: 'Access Denied - Invalid Token' });
  }
};

export { authenticateJWT };
