import prisma from './prisma';
import { Product } from '@prisma/client';

export class ProductRepository {
    /**
     * Finds products that match sustainability preferences and are within a broad budget context.
     * This is part of the "Deterministic Logic" for Phase 5.1.
     */
    async findProposableProducts(params: {
        maxPrice?: number;
        requiredSustainabilities?: string[];
    }): Promise<Product[]> {
        const { maxPrice, requiredSustainabilities } = params;

        return prisma.product.findMany({
            where: {
                AND: [
                    maxPrice ? { price: { lte: maxPrice } } : {},
                    requiredSustainabilities && requiredSustainabilities.length > 0
                        ? {
                            sustainabilityFilters: {
                                hasSome: requiredSustainabilities,
                            },
                        }
                        : {},
                ],
            },
        });
    }

    async getAll(): Promise<Product[]> {
        return prisma.product.findMany();
    }
}

export const productRepository = new ProductRepository();
