import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/form.route';
import { authMiddleware } from './middlewares/auth.middleware';


dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Routes
app.use('/api/form', formRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API is running ✅');
});

export default app;
