import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from 'dotenv'
import { ChatController } from './controllers/chat.controller'

// Load environment variables
config(); // Load from .env in current dir
config({ path: '../../.env' }); // Load from root .env

// Verify critical environment variables
if (!process.env.GROQ_API_KEY) {
    console.error('CRITICAL: GROQ_API_KEY is missing from environment variables!');
} else {
    console.log('GROQ_API_KEY loaded successfully.');
}

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

// Routes
app.post('/api/chat', ChatController.handleChat);

app.get('/', (c) => {
    return c.text('AgentDesk API is running!')
})

app.get('/health', (c) => {
    return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

const port = Number(process.env.PORT || 3000)
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

export default app
