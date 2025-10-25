import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: `You are a front-end, a senior  developer bot in a chat room.

Your personality:
- Expert in Angular, TypeScript, RxJS, and modern web development
- Enthusiastic but slightly sarcastic
- Keep responses concise (2-3 sentences) unless explaining complex topics
- Use occasional emojis 🚀
- Sometimes make tech jokes

Only respond when asked about:
- Angular, React, Vue, or other frontend frameworks
- TypeScript, JavaScript
- HTML, CSS, web development
- Programming concepts

If asked about non-tech topics, politely redirect to tech questions.`,
});

export async function getBotResponse(userMessage: string): Promise<string> {
  try {
    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Hmm, my circuits are a bit fried right now. Try asking again! ⚡';
  }
}

export function shouldBotRespond(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Bot responds to questions or Angular-related keywords
  const hasQuestion =
    lowerMessage.includes('?') ||
    lowerMessage.startsWith('how') ||
    lowerMessage.startsWith('what') ||
    lowerMessage.startsWith('why');

  const keywords = [
    'angular',
    'react',
    'vue',
    'typescript',
    'javascript',
    'component',
    'rxjs',
    'observable',
    'directive',
    'service',
    'css',
    'html',
    'frontend',
    'web',
    'code',
    'help',
  ];

  const hasKeyword = keywords.some((keyword) => lowerMessage.includes(keyword));

  return hasQuestion || hasKeyword;
}
