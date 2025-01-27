import { Router } from 'express';
import { getAllGames } from '@controllers/gameController';
import {checkBlacklistedToken} from "@controllers/userController";

const router = Router();

router.get('/', checkBlacklistedToken, getAllGames);

export default router;