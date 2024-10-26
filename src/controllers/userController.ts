import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/database';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered', userId: result.rows[0].id });
    } catch (error) {
        console.error('Registration error:', error);  // Log error details
        res.status(500).json({ message: 'Server error' });
    }
};
