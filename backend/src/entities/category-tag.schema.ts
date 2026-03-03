/**
 * Output schema for the AI Auto-Category & Tag Generator.
 * Used for validation and structured output enforcement.
 */
export const CategoryTagSchema = {
    name: "category_tag_generator",
    strict: true,
    schema: {
        type: "object",
        properties: {
            primaryCategory: {
                type: "string",
                description: "The main category the product belongs to (e.g., Electronics, Home & Garden, Apparel)."
            },
            subCategory: {
                type: "string",
                description: "A more specific classification within the primary category."
            },
            seoTags: {
                type: "array",
                items: { type: "string" },
                description: "A list of 5 to 10 SEO-friendly keywords for the product."
            },
            sustainabilityFilters: {
                type: "array",
                items: { type: "string" },
                description: "Suggested sustainability attributes (e.g., plastic-free, biodegradable, vegan)."
            }
        },
        required: ["primaryCategory", "subCategory", "seoTags", "sustainabilityFilters"],
        additionalProperties: false
    }
};

export interface CategoryTagOutput {
    primaryCategory: string;
    subCategory: string;
    seoTags: string[];
    sustainabilityFilters: string[];
}
