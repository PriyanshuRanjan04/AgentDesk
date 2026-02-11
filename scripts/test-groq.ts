import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from root .env
config({ path: path.resolve(__dirname, '../.env') });

async function testGroq() {
    console.log('Testing Groq API...');

    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY is missing in .env');
        return;
    }

    console.log('API Key present:', process.env.GROQ_API_KEY.slice(0, 5) + '...');

    const groq = createGroq({
        apiKey: process.env.GROQ_API_KEY,
    });

    try {
        console.log('Testing direct fetch to Groq API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        const data = await response.json();
        console.log('\n✅ Response Status:', response.status);
        console.log('Full Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('\n❌ Fetch Error:', error);
    }
}

testGroq();
