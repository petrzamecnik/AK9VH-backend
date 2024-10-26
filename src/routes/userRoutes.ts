import {Request, Response, NextFunction, Router} from 'express';
import { registerUser } from '../controllers/userController';

const router = Router();

router.post('/register', (req: Request, res: Response) => registerUser(req, res));

export default router;
