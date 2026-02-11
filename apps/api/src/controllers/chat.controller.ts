import { Context } from 'hono';
import { convertToCoreMessages, Message } from 'ai';
import { AgentService } from '../services/agent.service';

export class ChatController {
    static async handleChat(c: Context) {
        try {
            const { messages, conversationId } = await c.req.json();

            // Delegate to AgentService
            const result = await AgentService.processChat({
                messages: convertToCoreMessages(messages),
                conversationId,
            });

            return result.toDataStreamResponse();
        } catch (error: any) {
            console.error('Error in chat controller:', error);
            return c.json({ error: error.message || 'Internal Server Error' }, 500);
        }
    }
}
