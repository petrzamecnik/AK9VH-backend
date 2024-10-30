import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {pool} from '@config/database';
import {User} from '@models/UserModel';
import {hashPassword, isPasswordValid} from "@utils/passwordUtils";
import * as process from "node:process";
import * as console from "node:console";


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert user into the database
        const result = await pool.query<User>(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [username, email, hashedPassword]
        );

        const newUser: User = result.rows[0];
        res.status(201).json({ message: 'User registered', userId: newUser.id });

    } catch (error) {
        console.error('Registration error:', error);

        if ((error as any).code === '23505') {  // '23505' is the PostgreSQL unique violation error code
            res.status(409).json({ message: 'User with this username already exists' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).json({message: 'Username and password are required'});
    }

    try {
        const result = await pool.query<User>(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );


        const user = result.rows[0];
        console.log('user: ', user);

        if (!user) {
            res.status(404).json({ message: 'Wrong username or password!' });
        }


        // check password
        const passwordCheck = await isPasswordValid(password, user.password);
        if (!passwordCheck) {
            res.status(400).json({message: 'Invalid email or password'});
        }

        // generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            {expiresIn: '8h'}
        );

        // respond with token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                userId: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({message: 'Server error'});
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix

        // Optional: Store the token in a blacklist table
        await pool.query(
            `INSERT INTO blacklisted_tokens (token, expiry) 
             VALUES ($1, NOW() + INTERVAL '8 hours')`,
            [token]
        );

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkBlacklistedToken = async (req: Request, res: Response, next: Function) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Check if token is blacklisted
        const result = await pool.query(
            'SELECT * FROM blacklisted_tokens WHERE token = $1',
            [token]
        );

        if (result.rows.length > 0) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }

        next();
    } catch (error) {
        console.error('Token check error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const cleanupBlacklistedTokens = async (): Promise<void> => {
    try {
        await pool.query(
            'DELETE FROM blacklisted_tokens WHERE expiry < NOW()'
        );
    } catch (error) {
        console.error('Cleanup error:', error);
    }
};
