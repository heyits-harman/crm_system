import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type locally for custom properties
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authValidation = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN || '';

    jwt.verify(token!, secret, (err, decoded: any) => {
      if (err || !decoded) {
        return res.status(401).json({ error: 'User not Authorized!' });
      }

      req.userId = decoded.userId;
      next();
    });
  } else {
    res.status(401).json({ error: 'Token not provided or token format invalid!' });
  }
};

export default authValidation;