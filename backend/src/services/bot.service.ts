import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Configuration for the AI bot's personality and behavior
 */
const BOT_SYSTEM_INSTRUCTION = `You are a front-end, a senior developer bot in a chat room.

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

If asked about non-tech topics, politely redirect to tech questions.`;

/**
 * Keywords that trigger bot responses
 */
const TECH_KEYWORDS = [
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
] as const;

/**
 * Question starter words that trigger bot responses
 */
const QUESTION_STARTERS = ['how', 'what', 'why'] as const;
const DEFAULT_ERROR_MESSAGE =
  'Hmm, my circuits are a bit fried right now. Try asking again! ⚡';

/**
 * Initializes the Google Generative AI client
 *
 * @returns {GoogleGenerativeAI} Configured AI client
 * @throws {Error} If API key is not configured
 */
function initializeAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Creates the AI model with system instructions
 *
 * @param {GoogleGenerativeAI} genAI - The AI client instance
 * @returns {GenerativeModel} Configured AI model
 */
function createBotModel(genAI: GoogleGenerativeAI): GenerativeModel {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: BOT_SYSTEM_INSTRUCTION,
  });
}

const genAI = initializeAI();
const model = createBotModel(genAI);

/**
 * Gets a response from the AI bot
 *
 * @description
 * Sends a user message to the Google Gemini AI and returns the bot's response.
 * The bot is configured with a senior frontend developer personality and will
 * provide technical guidance on web development topics.
 *
 * @async
 * @param {string} userMessage - The user's message to respond to
 * @returns {Promise<string>} The bot's response text
 *
 * @example
 * ```typescript
 * const response = await getBotResponse('What is Angular dependency injection?');
 * console.log(response); // "Dependency injection in Angular is..."
 * ```
 *
 * @throws {Error} If API call fails (caught and returns error message)
 */
export async function getBotResponse(userMessage: string): Promise<string> {
  try {
    validateUserMessage(userMessage);

    const result = await model.generateContent(userMessage);

    return extractResponseText(result);
  } catch (error) {
    handleBotError(error);
    return DEFAULT_ERROR_MESSAGE;
  }
}

/**
 * Determines if the bot should respond to a message
 *
 * @description
 * Analyzes a message to determine if it contains technical content that
 * the bot should respond to. Returns true if the message:
 * - Contains a question mark
 * - Starts with "how", "what", or "why"
 * - Contains tech-related keywords (angular, react, typescript, etc.)
 *
 * @param {string} message - The message to analyze
 * @returns {boolean} True if bot should respond
 *
 * @example
 * ```typescript
 * shouldBotRespond('What is Angular?'); // true
 * shouldBotRespond('Hello everyone!'); // false
 * shouldBotRespond('I need help with TypeScript'); // true
 * ```
 */
export function shouldBotRespond(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const normalized = normalizeMessage(message);

  return hasQuestion(normalized) || hasTechKeyword(normalized);
}

/**
 * Validates user message before sending to AI
 *
 * @private
 * @param {string} message - Message to validate
 * @throws {Error} If message is invalid
 */
function validateUserMessage(message: string): void {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message: must be a non-empty string');
  }

  if (message.trim().length === 0) {
    throw new Error('Invalid message: must not be empty or whitespace only');
  }
}

function extractResponseText(result: any): string {
  return result.response.text();
}

function handleBotError(error: unknown): void {
  console.error('Gemini API error:', error);

  if (error instanceof Error) {
    if (error.message.includes('rate limit')) {
      console.error(
        'Rate limit exceeded. Consider implementing request throttling.'
      );
    } else if (error.message.includes('API key')) {
      console.error(
        'API key issue. Verify GEMINI_API_KEY environment variable.'
      );
    }
  }
}

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim();
}

function hasQuestion(normalized: string): boolean {
  if (normalized.includes('?')) {
    return true;
  }

  return QUESTION_STARTERS.some((starter) => normalized.startsWith(starter));
}

function hasTechKeyword(normalized: string): boolean {
  return TECH_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
