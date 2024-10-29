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

    console.log(username);
    console.log(password);

    if (!username || !password) {
        res.status(400).json({message: 'Username and password are required'});
    }

    try {
        const result = await pool.query<User>(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];

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
