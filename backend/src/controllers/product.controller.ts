import { Request, Response } from 'express';
import { categorizeProductUseCase } from '../use-cases/categorize-product.use-case';

export class ProductController {
    async categorize(req: Request, res: Response) {
        try {
            const { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }

            const result = await categorizeProductUseCase.execute({ title, description });
            return res.json(result);
        } catch (error: any) {
            console.error('Error in ProductController.categorize:', error);
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
}

export const productController = new ProductController();
