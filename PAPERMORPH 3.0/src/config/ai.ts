/**
 * AI Configuration for OpenRouter
 */

export const AI_CONFIG = {
  OPENROUTER_API_KEY: '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',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  MODEL: 'x-ai/grok-4.1-fast:free',
};

/**cd "c:\Users\LENOVO\OneDrive\Desktop\All Projects\EXTENSIONS\PAPERMORPH 3.0"
npm install html2canvas jspdf --save
 * Make a request to OpenRouter AI
 */
export async function askAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    // Validate API key
    if (!AI_CONFIG.OPENROUTER_API_KEY || AI_CONFIG.OPENROUTER_API_KEY === 'your-api-key-here') {
      throw new Error('AI API key not configured. Please set up your OpenRouter API key.');
    }

    const response = await fetch(`${AI_CONFIG.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Papermorph',
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      // Provide user-friendly error messages
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status >= 500) {
        throw new Error('AI service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`AI request failed with status ${response.status}. Please try again.`);
      }
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response received from AI. Please try again.');
    }
    
    return content;
  } catch (error) {
    console.error('AI request error:', error);
    
    // Return user-friendly error message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while communicating with AI. Please try again.');
    }
  }
}

/**
 * Generate document content using AI
 */
export async function generateDocument(payload: {
  type: string;
  data: Record<string, string>;
}): Promise<string> {
  const systemPrompt = `You are a professional document writer. Generate a well-formatted ${payload.type} document based on the provided information. Use proper formatting with headings, paragraphs, and lists where appropriate. Output in HTML format suitable for a rich text editor.`;
  
  const userPrompt = `Generate a ${payload.type} with the following details:\n${Object.entries(payload.data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')}`;

  return askAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}

/**
 * Rewrite text with AI
 */
export async function rewriteText(payload: {
  text: string;
  tone?: 'formal' | 'casual' | 'professional';
  action?: 'condense' | 'expand' | 'summarize' | 'fix-grammar';
}): Promise<string> {
  let instruction = '';
  
  if (payload.tone) {
    instruction = `Rewrite the following text in a ${payload.tone} tone:`;
  } else if (payload.action) {
    switch (payload.action) {
      case 'condense':
        instruction = 'Make the following text more concise while keeping the main points:';
        break;
      case 'expand':
        instruction = 'Expand the following text with more details and explanations:';
        break;
      case 'summarize':
        instruction = 'Provide a brief summary of the following text:';
        break;
      case 'fix-grammar':
        instruction = 'Fix any grammar and spelling errors in the following text:';
        break;
    }
  }

  return askAI([
    { role: 'system', content: 'You are a helpful writing assistant. Only return the rewritten text without any explanations.' },
    { role: 'user', content: `${instruction}\n\n${payload.text}` },
  ]);
}

/**
 * Generate a new section based on context
 */
export async function generateSection(context: string, instruction: string): Promise<string> {
  return askAI([
    { role: 'system', content: 'You are a professional document writer. Generate content in HTML format suitable for a rich text editor. Do not include any markdown formatting.' },
    { role: 'user', content: `Based on this context:\n${context}\n\nGenerate: ${instruction}` },
  ]);
}
