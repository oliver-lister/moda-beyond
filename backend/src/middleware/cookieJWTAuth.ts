import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import 'dotenv/config';
import { AuthorizedRequest } from '../routes/userRoutes/userRoutes';
import { Session } from '../models/models';
import { generateAccessToken, generateRefreshToken } from '../routes/authRoutes/authRoutes';

// JWT Authentication Middleware
const cookieJWTAuth = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!accessToken || !tokenSecret) {
    return res.status(401).json({ success: false, error: 'Access denied, missing token or missing token secret', errorCode: 'MISSING_TOKEN' });
  }

  try {
    // Decode the accessToken without verifying to check expiry
    const decodedToken = jwt.decode(accessToken) as JwtPayload;

    // If accessToken is expired, attempt to refresh it
    if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      console.log('Attempting to refresh accessToken using refreshToken...');

      // Find the auth session with the refreshToken
      // If found, the session is deleted
      const session = await Session.findOneAndDelete({ refreshToken: refreshToken });

      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token: missing session information',
          errorCode: 'MISSING_SESSION_INFORMATION',
        });
      }

      const userId = session.userId.toString();

      // Generate new accessToken & refresh token
      const newAccessToken = generateAccessToken(userId, '5m');
      const newRefreshToken = generateRefreshToken();

      // Create new DB Auth Session
      const newSession = new Session({ userId: userId, refreshToken: newRefreshToken });
      await newSession.save();

      // Set new tokens in cookies
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'none' });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

      // Attach new accessToken payload to req.user
      req.user = jwt.verify(newAccessToken, tokenSecret);

      console.log('accessToken successfully refreshed!');
      return next();
    }
    // If accessToken is valid and not expired, verify it and attach the payload to req.user
    const verifyPayload = jwt.verify(accessToken, tokenSecret);
    req.user = verifyPayload;
    next();
  } catch (err: any) {
    console.log('Session could not be retrieved...');
    // Clear cookies if tokens are invalid or expired
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    return res.status(403).json({ success: false, error: `Access denied, invalid token: ${err.message}`, errorCode: 'INVALID_TOKEN' });
  }
};

export { cookieJWTAuth };
