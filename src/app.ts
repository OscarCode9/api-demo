import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});