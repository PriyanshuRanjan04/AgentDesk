import { streamText, CoreMessage, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import prisma from '@agentdesk/db';
import { z } from 'zod';
import { OrderAgent } from '../agents/order.agent';
import { BillingAgent } from '../agents/billing.agent';
import { SupportAgent } from '../agents/support.agent';

const getGroq = () => createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    compatibility: 'strict',
});

export class AgentService {
    static async processChat({ messages, conversationId }: { messages: CoreMessage[], conversationId?: string }) {
        // 1. Router Agent Logic (Simplified: Using a single model call with routing capabilities)
        // In a more complex setup, we might have a dedicated Router step. 
        // Here, we'll give the model access to all tools but instruct it to act as a router/orchestrator.

        // We will persist the conversation if a conversationId is provided or create a new one.
        let currentConversationId = conversationId;

        if (currentConversationId) {
            // Verify if conversation exists
            const conversation = await prisma.conversation.findUnique({
                where: { id: currentConversationId }
            });

            if (!conversation) {
                // If ID provided but not found, create it (syncing with frontend ID)
                await prisma.conversation.create({
                    data: {
                        id: currentConversationId,
                        title: 'New Conversation'
                    }
                });
            }
        } else {
            // Create new conversation
            const convo = await prisma.conversation.create({
                data: { title: 'New Conversation' }
            });
            currentConversationId = convo.id;
        }

        // Save User Message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user' && typeof lastMessage.content === 'string') {
            await prisma.message.create({
                data: {
                    conversationId: currentConversationId!,
                    role: 'user',
                    content: lastMessage.content,
                }
            });
        }

        // Define Tools from Sub-Agents
        const tools = {
            ...OrderAgent.getTools(),
            ...BillingAgent.getTools(),
            ...SupportAgent.getTools(),
        };

        const result = await streamText({
            model: getGroq()('llama-3.3-70b-versatile') as any,
            system: `You are AgentDesk, an intelligent customer support system.
            
            You have access to specialized agents and tools:
            - **Order Agent**: For order tracking, details, and status.
            - **Billing Agent**: For invoices, payments, and refunds.
            - **Support Agent**: For general inquiries, returns, and FAQs.

            Analyze the user's request and use the appropriate tool. 
            If the user asks "Where is my order?", use the Order Agent's tool.
            If the user asks about an invoice, use the Billing Agent's tool.

            Always maintain a helpful and professional tone.
            `,
            messages,
            tools: tools as any,
            maxSteps: 5,
            onFinish: async (event) => {
                // Save Assistant Message
                // Note: handling streaming text persistence can be tricky. 
                // We save the final text.
                if (event.text) {
                    await prisma.message.create({
                        data: {
                            conversationId: currentConversationId!,
                            role: 'assistant',
                            content: event.text,
                            // agentId: In a real router, we'd infer this. 
                            agentId: 'Router'
                        }
                    });
                }
            }
        });

        return result;
    }
}
