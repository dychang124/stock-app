import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import stockRoutes from './routes/stocks';
import listRoutes from './routes/list';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/stocks', stockRoutes);
app.use('/list', listRoutes);

app.listen(process.env.PORT, () => console.log("Server running on port "+process.env.PORT));