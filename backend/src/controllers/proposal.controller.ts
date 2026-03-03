import { Request, Response } from 'express';
import { generateProposalUseCase } from '../use-cases/generate-proposal.use-case';

export class ProposalController {
    async generate(req: Request, res: Response) {
        try {
            const { customerName, budgetLimit, sustainabilityPreferences } = req.body;

            if (!budgetLimit || !sustainabilityPreferences) {
                return res.status(400).json({ error: 'budgetLimit and sustainabilityPreferences are required' });
            }

            const result = await generateProposalUseCase.execute({
                customerName: customerName || 'Valued Partner',
                budgetLimit: parseFloat(budgetLimit),
                sustainabilityPreferences
            });

            return res.json(result);
        } catch (error: any) {
            console.error('Error in ProposalController.generate:', error);
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
}

export const proposalController = new ProposalController();
