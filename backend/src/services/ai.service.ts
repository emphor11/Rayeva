import { GoogleGenAI } from '@google/genai';
import { config } from '../config';
import { PromptMetadata } from './prompts';
import prisma from '../repositories/prisma';

export interface AIResponse<T> {
    data: T;
    usage: any;
    metadata: PromptMetadata;
}

export class AIService {
    private client: GoogleGenAI;

    constructor() {
        if (!config.geminiApiKey) {
            throw new Error("GEMINI_API_KEY is missing in configuration");
        }
        this.client = new GoogleGenAI({
            apiKey: config.geminiApiKey,
        });
    }

    /**
     * Executes a prompt with structured output enforcement using Gemini's responseMimeType and responseSchema.
     */
    async execute<T>(params: {
        systemPrompt: string;
        userPrompt: string;
        jsonSchema: any;
        metadata: PromptMetadata;
        model?: string;
        maxRetries?: number;
    }): Promise<AIResponse<T>> {
        const { systemPrompt, userPrompt, jsonSchema, metadata, model = 'gemini-2.0-flash', maxRetries = 3 } = params;
        const startTime = Date.now();
        let attempts = 0;

        const executeAttempt = async (): Promise<AIResponse<T>> => {
            attempts++;
            try {
                const response = await this.client.models.generateContent({
                    model: model,
                    contents: userPrompt,
                    config: {
                        systemInstruction: systemPrompt,
                        responseMimeType: 'application/json',
                        responseSchema: jsonSchema.schema,
                    },
                });

                const text = response.text;

                if (!text) {
                    throw new Error('AI returned an empty response');
                }

                const data = JSON.parse(text) as T;
                const latencyMs = Date.now() - startTime;

                // Log success
                await prisma.aIInteractionLog.create({
                    data: {
                        promptId: metadata.id,
                        promptVersion: metadata.version,
                        module: metadata.module,
                        requestPayload: { systemPrompt, userPrompt },
                        responsePayload: data as any,
                        status: 'SUCCESS',
                        latencyMs,
                    },
                });

                return {
                    data,
                    usage: response.usageMetadata,
                    metadata,
                };
            } catch (error: any) {
                if (attempts < maxRetries) {
                    const delay = Math.pow(2, attempts) * 1000;
                    console.warn(`AI Execution attempt ${attempts} failed. Retrying in ${delay}ms...`, error.message);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return executeAttempt();
                }

                const latencyMs = Date.now() - startTime;

                // Log failure after all retries
                await prisma.aIInteractionLog.create({
                    data: {
                        promptId: metadata.id,
                        promptVersion: metadata.version,
                        module: metadata.module,
                        requestPayload: { systemPrompt, userPrompt },
                        responsePayload: {},
                        status: 'FAILED',
                        errorMessage: error.message,
                        latencyMs,
                    },
                });

                throw error;
            }
        };

        return executeAttempt();
    }
}

export const aiService = new AIService();