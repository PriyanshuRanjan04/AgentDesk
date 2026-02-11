import { z } from 'zod';
import { tool } from 'ai';

export class SupportAgent {
    static getTools() {
        return {
            getReturnPolicy: tool({
                description: 'Get the return policy information.',
                parameters: z.object({
                    query: z.string().optional().describe('Optional context for the return policy query'),
                }),
                execute: async () => {
                    console.log(`[SupportAgent] Fetching return policy`);
                    return {
                        policy: "Items can be returned within 30 days of delivery. They must be in original condition. Shipping fees are non-refundable unless the item is defective.",
                        process: "To initiate a return, go to the 'My Orders' section in your account or contact support.",
                    };
                },
            }),
        };
    }
}
