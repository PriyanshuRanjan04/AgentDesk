import { Context } from 'hono';
import { convertToCoreMessages, Message } from 'ai';
import { AgentService } from '../services/agent.service';

export class ChatController {
    static async handleChat(c: Context) {
        try {
            const { messages, conversationId } = await c.req.json();

            // Sanitize messages to remove tool invocations without results
            // This prevents crashes if the frontend sends a pending/incomplete tool state
            const sanitizedMessages = messages.map((m: any) => {
                if (m.toolInvocations && Array.isArray(m.toolInvocations)) {
                    // Filter to keep only tool invocations with results
                    const validToolInvocations = m.toolInvocations.filter((ti: any) =>
                        ti.result !== undefined && ti.result !== null
                    );

                    // If no valid tool invocations remain, remove the property entirely
                    if (validToolInvocations.length === 0) {
                        const { toolInvocations, ...rest } = m;
                        return rest;
                    }

                    return {
                        ...m,
                        toolInvocations: validToolInvocations
                    };
                }
                return m;
            });

            // Delegate to AgentService
            const result = await AgentService.processChat({
                messages: convertToCoreMessages(sanitizedMessages),
                conversationId,
            });

            return result.toDataStreamResponse();
        } catch (error: any) {
            console.error('Error in chat controller:', error);
            return c.json({ error: error.message || 'Internal Server Error' }, 500);
        }
    }
}
