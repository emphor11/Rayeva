import { aiService } from '../services/ai.service';
import { GENERATE_PROPOSAL_PROMPT } from '../services/prompts/generate-proposal.prompt';
import { ProposalOutput } from '../entities/proposal.schema';
import { productRepository } from '../repositories/product.repository';
import prisma from '../repositories/prisma';

export class GenerateProposalUseCase {
    async execute(input: {
        customerName: string;
        budgetLimit: number;
        sustainabilityPreferences: string[];
    }): Promise<ProposalOutput> {

        // 1. Deterministic Filtering (Business Logic)
        // Filter products that contain AT LEAST ONE of the preferred sustainability filters
        const availableProducts = await productRepository.findProposableProducts({
            maxPrice: input.budgetLimit,
            requiredSustainabilities: input.sustainabilityPreferences
        });

        if (availableProducts.length === 0) {
            throw new Error("No products found matching the sustainability preferences within this budget.");
        }

        // 2. AI-Assisted Reasoning & Mixing
        const aiResponse = await aiService.execute<ProposalOutput>({
            systemPrompt: GENERATE_PROPOSAL_PROMPT.systemPrompt,
            userPrompt: GENERATE_PROPOSAL_PROMPT.userPromptTemplate({
                customerName: input.customerName,
                budgetLimit: input.budgetLimit,
                availableProducts,
                sustainabilityPreferences: input.sustainabilityPreferences
            }),
            jsonSchema: GENERATE_PROPOSAL_PROMPT.jsonSchema,
            metadata: GENERATE_PROPOSAL_PROMPT.metadata,
        });

        const proposal = aiResponse.data;

        // 3. Persist Proposal to Database (Step 5.4)
        await prisma.proposal.create({
            data: {
                customerName: input.customerName,
                budgetLimit: input.budgetLimit,
                estimatedCost: proposal.budgetUtilization,
                productMix: proposal.productMix as any,
                costBreakdown: proposal.costBreakdown as any,
                impactSummary: proposal.impactSummary,
            }
        });

        return proposal;
    }
}

export const generateProposalUseCase = new GenerateProposalUseCase();
