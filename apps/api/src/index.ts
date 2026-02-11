import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from 'dotenv'
import { ChatController } from './controllers/chat.controller'

// Load environment variables
config();

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
