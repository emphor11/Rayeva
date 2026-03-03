import { BasePrompt } from './index';
import { CategoryTagSchema } from '../../entities/category-tag.schema';

export const CATEGORIZE_PRODUCT_PROMPT: BasePrompt = {
    metadata: {
        id: "categorize-product",
        version: "1.0.0",
        module: "Module 1",
        description: "Generates primary category, sub-category, SEO tags, and sustainability filters for a product."
    },
    systemPrompt: `You are an AI Catalog Specialist for Rayeva, a sustainable commerce platform.
Your task is to analyze product information and provide structured categorization.
Strictly adhere to the provided JSON schema.
Ensure that the sustainability filters are relevant to the product's description and contribute to eco-friendly commerce.`,
    userPromptTemplate: (context: { title: string, description: string }) =>
        `Categorize the following product:
    Title: ${context.title}
    Description: ${context.description}`,
    jsonSchema: CategoryTagSchema
};
