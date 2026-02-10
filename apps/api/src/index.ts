import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { streamText, convertToCoreMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { getOrderDetails, checkInvoiceStatus, getReturnPolicy } from './agents/tools'
import { config } from 'dotenv'

// Load environment variables
config();

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

// Initialize OpenAI client
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (c) => {
    try {
        const { messages } = await c.req.json();

        const result = await streamText({
            model: openai('gpt-4-turbo') as any,
            system: `You are AgentDesk, an intelligent customer support AI.
      
      You have access to specialized tools to help customers with their queries:
      - Order Lookup: For questions about order status, details, or tracking.
      - Invoice Status: For billing questions, payments, or refunds.
      - Return Policy: For questions about returns and refunds policy.

      ROUTING LOGIC:
      - Analyze the user's request.
      - If it's about an order, call 'getOrderDetails'.
      - If it's about billing/invoice, call 'checkInvoiceStatus'.
      - If it's about returns, call 'getReturnPolicy'.
      - If it's general or greetings, respond politely and helpfuly.

      Always be professional, concise, and helpful.`,
            messages: convertToCoreMessages(messages),
            tools: {
                getOrderDetails,
                checkInvoiceStatus,
                getReturnPolicy,
            } as any,
            maxSteps: 5, // Allow multi-step tool calls
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

app.get('/health', (c) => {
    return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

export default app
