import express from 'express';
import cors from 'cors';
import { productController } from './controllers/product.controller';
import { proposalController } from './controllers/proposal.controller';

const app = express();

app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
}));

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Module 1 Routes
app.post('/api/products/categorize', (req, res) => productController.categorize(req, res));

// Module 2 Routes
app.post('/api/proposals/generate', (req, res) => proposalController.generate(req, res));

// Stats Routes
import { statsController } from './controllers/stats.controller';
app.get('/api/stats/summary', (req, res) => statsController.getSummary(req, res));
app.get('/api/stats/usage', (req, res) => statsController.getUsage(req, res));
app.get('/api/stats/logs', (req, res) => statsController.getLogs(req, res));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
