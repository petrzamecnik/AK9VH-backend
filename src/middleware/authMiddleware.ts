import { Request, Response, NextFunction } from 'express';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // not needed for now
    next();
};
