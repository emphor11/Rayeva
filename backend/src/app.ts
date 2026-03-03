import express from 'express';
import { productController } from './controllers/product.controller';
import { proposalController } from './controllers/proposal.controller';

const app = express();

app.use(express.json());

// Module 1 Routes
app.post('/api/products/categorize', (req, res) => productController.categorize(req, res));

// Module 2 Routes
app.post('/api/proposals/generate', (req, res) => proposalController.generate(req, res));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
