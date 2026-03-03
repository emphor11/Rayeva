/**
 * Output schema for the AI B2B Proposal Generator.
 */
export const ProposalSchema = {
    name: "proposal_generator",
    strict: true,
    schema: {
        type: "object",
        properties: {
            budgetUtilization: {
                type: "number",
                description: "Total estimated cost for the proposed products."
            },
            productMix: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        productId: { type: "string" },
                        productName: { type: "string" },
                        quantity: { type: "number" },
                        reasoning: { type: "string", description: "Why this product fits the client's sustainability and budget goals." }
                    },
                    required: ["productId", "productName", "quantity", "reasoning"],
                    additionalProperties: false
                }
            },
            impactSummary: {
                type: "string",
                description: "A summary of the overall environmental and social impact of this proposal."
            },
            costBreakdown: {
                type: "object",
                properties: {
                    subtotal: { type: "number" },
                    savings: { type: "number", description: "Optional: Eco-credits or efficiency-driven savings." }
                },
                required: ["subtotal", "savings"],
                additionalProperties: false
            }
        },
        required: ["budgetUtilization", "productMix", "impactSummary", "costBreakdown"],
        additionalProperties: false
    }
};

export interface ProposalOutput {
    budgetUtilization: number;
    productMix: {
        productId: string;
        productName: string;
        quantity: number;
        reasoning: string;
    }[];
    impactSummary: string;
    costBreakdown: {
        subtotal: number;
        savings: number;
    };
}
