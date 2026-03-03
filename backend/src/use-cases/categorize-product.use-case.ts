import { aiService } from '../services/ai.service';
import { CATEGORIZE_PRODUCT_PROMPT } from '../services/prompts/categorize-product.prompt';
import { CategoryTagOutput } from '../entities/category-tag.schema';
import prisma from '../repositories/prisma';

export class CategorizeProductUseCase {
    async execute(input: { title: string; description: string }): Promise<CategoryTagOutput> {
        const response = await aiService.execute<CategoryTagOutput>({
            systemPrompt: CATEGORIZE_PRODUCT_PROMPT.systemPrompt,
            userPrompt: CATEGORIZE_PRODUCT_PROMPT.userPromptTemplate(input),
            jsonSchema: CATEGORIZE_PRODUCT_PROMPT.jsonSchema,
            metadata: CATEGORIZE_PRODUCT_PROMPT.metadata,
        });

        const result = response.data;

        // Persist to database
        await prisma.product.create({
            data: {
                name: input.title,
                description: input.description,
                primaryCategory: result.primaryCategory,
                subCategory: result.subCategory,
                tags: result.seoTags,
                sustainabilityFilters: result.sustainabilityFilters,
            },
        });

        return result;
    }
}

export const categorizeProductUseCase = new CategorizeProductUseCase();
