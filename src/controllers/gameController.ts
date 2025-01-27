import { Request, Response } from 'express';
import { pool } from '@config/database';
import { Game } from '@models/GameModel';

export const getAllGames = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query<Game>('SELECT * FROM games');
        const games: Game[] = result.rows;
        res.status(200).json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Server error' });
    }
};