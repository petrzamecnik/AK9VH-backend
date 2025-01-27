import { Request, Response } from 'express';
import { pool } from '@config/database';
import { Purchase } from '@models/PurchaseModel';
import { Game } from '@models/GameModel';

// Create a new purchase
export const createPurchase = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, game_id } = req.body;

        // Check if the user has already purchased the game
        const existingPurchase = await pool.query<Purchase>(
            'SELECT * FROM purchases WHERE user_id = $1 AND game_id = $2',
            [user_id, game_id]
        );

        if (existingPurchase.rows.length > 0) {
            res.status(409).json({ message: 'User has already purchased this game' });
            return;
        }

        // Insert the new purchase
        const result = await pool.query<Purchase>(
            'INSERT INTO purchases (user_id, game_id) VALUES ($1, $2) RETURNING *',
            [user_id, game_id]
        );

        const newPurchase: Purchase = result.rows[0];
        res.status(201).json({ message: 'Purchase successful', purchase: newPurchase });
    } catch (error) {
        console.error('Error creating purchase:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's purchased games
export const getPurchasedGames = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const result = await pool.query<Game>(
            `SELECT g.* 
             FROM games g
             INNER JOIN purchases p ON g.id = p.game_id
             WHERE p.user_id = $1`,
            [userId]
        );

        const purchasedGames: Game[] = result.rows;
        res.status(200).json(purchasedGames);
    } catch (error) {
        console.error('Error fetching purchased games:', error);
        res.status(500).json({ message: 'Server error' });
    }
};