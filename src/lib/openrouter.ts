import { supabase } from './supabase'

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenRouterError {
  error: {
    message: string
    type: string
    code: string
  }
}

export class OpenRouterAPI {
  private supabase = supabase

  async generateResponse(
    prompt: string,
    model: string = 'anthropic/claude-3.5-sonnet'
  ): Promise<OpenRouterResponse> {
    const { data, error } = await this.supabase.functions.invoke('openrouter', {
      body: { prompt, model }
    })

    if (error) {
      throw new Error(`OpenRouter function error: ${error.message}`)
    }

    return data as OpenRouterResponse
  }

  async generateText(
    prompt: string,
    model?: string
  ): Promise<string> {
    try {
      const response = await this.generateResponse(prompt, model)
      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Error generating text:', error)
      throw error
    }
  }

  // PaperMorph specific AI functions
  async enhanceText(text: string, enhancementType: 'professional' | 'concise' | 'expand' = 'professional'): Promise<string> {
    const prompts = {
      professional: `Rewrite the following text to make it more professional and formal:\n\n${text}`,
      concise: `Make the following text more concise while preserving the main points:\n\n${text}`,
      expand: `Expand the following text with more detail and examples:\n\n${text}`
    }

    return await this.generateText(prompts[enhancementType])
  }

  async generateDocument(prompt: string, documentType: string): Promise<string> {
    const systemPrompt = `You are PaperMorph AI, a professional document generation assistant. Generate a ${documentType} based on the following requirements. Use proper formatting and structure. Return only the document content without explanations.`
    
    const fullPrompt = `${systemPrompt}\n\nRequirements: ${prompt}`
    return await this.generateText(fullPrompt)
  }

  async fixGrammar(text: string): Promise<string> {
    const prompt = `Fix any grammar, spelling, and punctuation errors in the following text. Maintain the original tone and meaning. Return only the corrected text:\n\n${text}`
    return await this.generateText(prompt)
  }
}

export const openrouter = new OpenRouterAPI()
