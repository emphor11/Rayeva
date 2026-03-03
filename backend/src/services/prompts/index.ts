export interface PromptMetadata {
    id: string;
    version: string;
    module: string;
    description: string;
}

export interface BasePrompt {
    metadata: PromptMetadata;
    systemPrompt: string;
    userPromptTemplate: (context: any) => string;
    jsonSchema: any;
}

/**
 * Registry to manage all prompts in the system.
 */
export class PromptRegistry {
    private static prompts: Map<string, BasePrompt> = new Map();

    static register(prompt: BasePrompt) {
        this.prompts.set(prompt.metadata.id, prompt);
    }

    static get(id: string): BasePrompt | undefined {
        return this.prompts.get(id);
    }

    static getAll(): BasePrompt[] {
        return Array.from(this.prompts.values());
    }
}
