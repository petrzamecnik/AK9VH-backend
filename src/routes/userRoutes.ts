import {Request, Response, NextFunction, Router} from 'express';
import {registerUser, loginUser, logoutUser, checkBlacklistedToken} from '@controllers/userController';

const router = Router();

router.post('/register', (req: Request, res: Response) => registerUser(req, res));
router.post('/login', (req: Request, res: Response) => loginUser(req, res));
router.post('/logout', checkBlacklistedToken, logoutUser);


export default router;
