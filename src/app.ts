import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from '@config/database';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
