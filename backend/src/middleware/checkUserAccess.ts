import { AuthorizedRequest } from '../routes/userRoutes/userRoutes';
import { NextFunction, Response } from 'express';

export const checkUserAccess = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  if (!req.user || typeof req.user === 'string' || req.user.userId !== req.params.userId) {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to access this resource.',
      errorCode: 'FORBIDDEN_ACCESS',
    });
  }
  next();
};
