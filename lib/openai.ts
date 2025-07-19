import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Retry configuration for OpenAI API calls
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 8000, // 8 seconds
};

/**
 * Custom error class for OpenAI-related errors
 */
export class OpenAIError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'OpenAIError';
  }
}

/**
 * Sleep function for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for OpenAI API calls with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  operation: string
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      console.error(`OpenAI ${operation} attempt ${attempt} failed:`, error);
      
      // Don't retry on certain errors
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401 || error.status === 403) {
          throw new OpenAIError('Authentication failed. Please check your OpenAI API key.', error);
        }
        if (error.status === 429) {
          // Rate limit - wait longer
          const delay = Math.min(
            RETRY_CONFIG.baseDelay * Math.pow(2, attempt - 1) * 2,
            RETRY_CONFIG.maxDelay
          );
          console.log(`Rate limited, waiting ${delay}ms before retry...`);
          await sleep(delay);
          continue;
        }
        if (error.status === 400) {
          throw new OpenAIError('Invalid request. Please check the document content.', error);
        }
      }
      
      if (attempt === RETRY_CONFIG.maxRetries) {
        break;
      }
      
      // Exponential backoff
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, attempt - 1),
        RETRY_CONFIG.maxDelay
      );
      
      console.log(`Retrying ${operation} in ${delay}ms...`);
      await sleep(delay);
    }
  }
  
  throw new OpenAIError(
    `${operation} failed after ${RETRY_CONFIG.maxRetries} attempts. ${lastError?.message || 'Unknown error'}`,
    lastError || undefined
  );
}

/**
 * Generate AI summary for a document
 */
export async function generateDocumentSummary(
  parsedText: string,
  filename: string
): Promise<{
  title: string;
  summary: string;
  keyPoints: string[];
}> {
  if (!parsedText || parsedText.trim().length === 0) {
    throw new OpenAIError('No text content available for summary generation');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    throw new OpenAIError('OpenAI API key not configured');
  }
  
  const prompt = `Analyze the following document and provide:
1. A concise, descriptive title that captures the main topic
2. A comprehensive summary in 2-3 paragraphs that covers the key concepts and main ideas
3. 5-10 key points that highlight the most important information for studying

Document filename: ${filename}
Document content:
${parsedText}

Please format your response as JSON with the following structure:
{
  "title": "Document Title Here",
  "summary": "Comprehensive summary in 2-3 paragraphs...",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", ...]
}`;

  return withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic tutor helping students understand their study materials. Generate clear, concise, and accurate summaries that help students grasp key concepts quickly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError('No response content received from OpenAI');
    }
    
    try {
      const parsed = JSON.parse(content);
      
      // Validate the response structure
      if (!parsed.title || !parsed.summary || !Array.isArray(parsed.keyPoints)) {
        throw new OpenAIError('Invalid response format from OpenAI');
      }
      
      return {
        title: parsed.title,
        summary: parsed.summary,
        keyPoints: parsed.keyPoints
      };
    } catch (parseError) {
      throw new OpenAIError('Failed to parse OpenAI response as JSON', parseError as Error);
    }
  }, 'summary generation');
}

/**
 * Generate chatbot response for a document-specific query
 */
export async function generateChatbotResponse(
  message: string,
  documentTitle: string,
  parsedText: string
): Promise<string> {
  if (!message || message.trim().length === 0) {
    throw new OpenAIError('No message provided for chatbot response');
  }
  
  if (!parsedText || parsedText.trim().length === 0) {
    throw new OpenAIError('No document content available for chatbot response');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    throw new OpenAIError('OpenAI API key not configured');
  }
  
  const systemPrompt = `You are an AI tutor helping a student with their studies. You have access to their document: "${documentTitle}".

Your responses should:
- Use the document content when the question is related to the document
- Be clear, educational, and helpful for studying
- Answer general questions even if they're not about the document
- Provide explanations, clarifications, or create study materials
- When relevant, reference and use the document content to enhance your answers

Document content available:
${parsedText}

Guidelines:
- If the question is about the document or relates to its content, use the document information in your response
- If the question is general (like "explain quantum physics" or "help me with math"), answer normally using your general knowledge
- You can combine document content with general knowledge when appropriate
- Always be helpful and educational, whether using the document or general knowledge`;

  return withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError('No response content received from OpenAI');
    }
    
    return content;
  }, 'chatbot response');
}

/**
 * Check if OpenAI API is properly configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Validate OpenAI API key by making a simple test call
 */
export async function validateOpenAIKey(): Promise<boolean> {
  if (!process.env.OPENAI_API_KEY) {
    return false;
  }
  
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI API key validation failed:', error);
    return false;
  }
}