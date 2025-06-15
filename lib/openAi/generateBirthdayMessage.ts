import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

export async function generateBirthdayMessage(message: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: message },
        ],
    });
    
    return response.choices[0].message.content;
}