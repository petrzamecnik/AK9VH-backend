import {Request, Response} from 'express';
import {pool} from '@config/database';
import {User} from '@models/UserModel';
import {hashPassword} from "@utils/hashPassword";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        res.status(400).json({message: 'All fields are required'});
        return;
    }

    try {
        // Hash the password
        const hashedPassword = await hashPassword(password)

        // Insert user into the database
        const result = await pool.query<User>(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [username, email, hashedPassword]
        );

        const newUser: User = result.rows[0];

        res.status(201).json({message: 'User registered', userId: newUser.id});
    } catch (error) {
        console.error('Registration error:', error);  // Log error details
        res.status(500).json({message: 'Server error'});
    }
};
