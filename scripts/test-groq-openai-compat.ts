import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(__dirname, '../.env') });

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

async function testGroqCompat() {
    console.log('Testing Groq via OpenAI Compat Layer...');

    try {
        const result = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: 'Hello, are you working?',
        });

        console.log('\n✅ Success! Response:');
        console.log(result.text);
    } catch (error) {
        console.error('\n❌ Error:', error);
    }
}

testGroqCompat();
