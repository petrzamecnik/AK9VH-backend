import { Router } from 'express';
import { createPurchase, getPurchasedGames } from '@controllers/purchaseController';
import { checkBlacklistedToken } from '@controllers/userController';

const router = Router();

router.post('/', checkBlacklistedToken, createPurchase);
router.get('/:userId', checkBlacklistedToken, getPurchasedGames);

export default router;