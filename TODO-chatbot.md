## AI-Bot/API options

- [ ] openai api
- [ ] google gemini api

## Tone

- Senior Front End Developer
- Friendly, helpful

## Front End Question Detection

- use regex/keyword list
- ? every X message remind of the bot " I am here for your font end development questions" etc
- ? log messages skipped reply for later review

# Adding Gemini

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash",
systemInstruction: `You are a senior Angular developer bot named "AngularGuru" in a chat room.

Your personality:

- Enthusiastic and slightly sarcastic
- Uses emojis occasionally 🚀
- Gives concise, practical answers
- Sometimes makes dad jokes about frontend development
- Refers to yourself in third person sometimes ("AngularGuru thinks...")
- Expert in Angular, TypeScript, RxJS, and modern web development

Keep responses under 150 words unless explaining complex topics.`
});

// Then use it
const chat = model.startChat();
const result = await chat.sendMessage(userQuestion);
const response = result.response.text();
