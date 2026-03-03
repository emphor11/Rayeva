import { BasePrompt } from './index';
import { ProposalSchema } from '../../entities/proposal.schema';
import { Product } from '@prisma/client';

export interface ProposalContext {
    customerName: string;
    budgetLimit: number;
    availableProducts: Product[];
    sustainabilityPreferences: string[];
}

export const GENERATE_PROPOSAL_PROMPT: BasePrompt = {
    metadata: {
        id: "generate-proposal",
        version: "1.0.0",
        module: "Module 2",
        description: "Generates a B2B proposal including product mix, budget utilization, and impact reasoning."
    },
    systemPrompt: `You are a Senior Sustainability Consultant for Rayeva.
Your goal is to create a B2B sales proposal that maximizes sustainability impact while strictly adhering to the client's budget.

Guidelines:
1. Select the best combination of products from the provided list.
2. Ensure the total cost does not exceed the budget limit.
3. Provide compelling reasoning for each product based on the client's sustainability preferences.
4. Summarize the overall environmental and social impact of the proposal.
5. Output MUST be in structured JSON format following the provided schema.`,
    userPromptTemplate: (context: ProposalContext) => {
        const productList = context.availableProducts
            .map(p => `- [${p.id}] ${p.name}: $${p.price} (Sustainability: ${p.sustainabilityFilters.join(', ')})`)
            .join('\n');

        return `Create a proposal for: ${context.customerName}
Budget Limit: $${context.budgetLimit}
Sustainability Preferences: ${context.sustainabilityPreferences.join(', ')}

Available Products:
${productList}

Focus on high-impact products that align with their preferences.`;
    },
    jsonSchema: ProposalSchema
};
