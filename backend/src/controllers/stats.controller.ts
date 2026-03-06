import { Request, Response } from 'express';
import prisma from '../repositories/prisma';

export class StatsController {
    async getSummary(req: Request, res: Response) {
        try {
            // Get total products categorized
            const productCount = await prisma.product.count();

            // Get total proposals generated
            const proposalCount = await prisma.proposal.count();

            // Get AI interaction stats
            const interactionStats = await prisma.aIInteractionLog.aggregate({
                _avg: {
                    latencyMs: true,
                },
                _count: {
                    id: true,
                },
            });

            // Calculate success rate
            const successCount = await prisma.aIInteractionLog.count({
                where: { status: 'success' }
            });

            const totalInteractions = interactionStats._count.id || 1;
            const successRate = (successCount / totalInteractions) * 100;

            return res.json({
                productCount,
                proposalCount,
                averageLatency: interactionStats._avg.latencyMs || 0,
                successRate: Math.round(successRate * 10) / 10,
                totalInteractions
            });
        } catch (error: any) {
            console.error('Error in StatsController.getSummary:', error);
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }

    async getUsage(req: Request, res: Response) {
        try {
            // Get daily interaction counts for the last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const dailyStats = await prisma.aIInteractionLog.groupBy({
                by: ['timestamp'],
                _count: {
                    id: true
                },
                where: {
                    timestamp: {
                        gte: sevenDaysAgo
                    }
                }
            });

            return res.json(dailyStats);
        } catch (error: any) {
            console.error('Error in StatsController.getUsage:', error);
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }

    async getLogs(req: Request, res: Response) {
        try {
            const logs = await prisma.aIInteractionLog.findMany({
                orderBy: {
                    timestamp: 'desc'
                },
                take: 20
            });

            return res.json(logs);
        } catch (error: any) {
            console.error('Error in StatsController.getLogs:', error);
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
}

export const statsController = new StatsController();
