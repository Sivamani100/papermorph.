import { create } from 'zustand';
import { buildEnhancedSystemPrompt, postProcessAIResponse } from '@/config/papermorph-ai';
import { htmlToReadableText, isHTMLContent, sanitizeHTML } from '@/utils/htmlFormatter';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  applyContent?: string; // The content to apply to the document
}

export type WizardType = 'letter' | 'report' | 'proposal' | 'essay' | null;

export interface WizardStep {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface AISidebarState {
  isOpen: boolean;
  mode: 'chat' | 'wizard';
  messages: Message[];
  isGenerating: boolean;
  
  // Wizard state
  wizardType: WizardType;
  wizardStep: number;
  wizardData: Record<string, string>;
  
  // Actions
  toggle: () => void;
  setMode: (mode: 'chat' | 'wizard') => void;
  sendMessage: (content: string, documentContext?: string) => Promise<void>;
  clearMessages: () => void;
  
  // AI Actions
  generateSection: () => Promise<void>;
  rewriteFormal: () => Promise<void>;
  fixGrammar: () => Promise<void>;
  condense: () => Promise<void>;
  expand: () => Promise<void>;
  summarize: () => Promise<void>;
  
  // Wizard Actions
  startWizard: (type: WizardType) => void;
  setWizardData: (key: string, value: string) => void;
  nextWizardStep: () => void;
  prevWizardStep: () => void;
  finishWizard: () => Promise<void>;
  cancelWizard: () => void;
  // Pending intent (used for multi-step flows like email composition)
  pendingIntent: null | {
    type: 'email';
    assistantMessageId: string;
  };
  setPendingIntent: (intent: null | { type: 'email'; assistantMessageId: string }) => void;
}

const WIZARD_STEPS: Record<string, WizardStep[]> = {
  letter: [
    { id: 'recipient', label: 'Recipient Name', type: 'text', placeholder: 'John Smith', required: true },
    { id: 'recipientTitle', label: 'Recipient Title', type: 'text', placeholder: 'HR Manager' },
    { id: 'purpose', label: 'Purpose of Letter', type: 'select', options: ['Job Application', 'Resignation', 'Recommendation', 'Complaint', 'Thank You', 'Other'], required: true },
    { id: 'keyPoints', label: 'Key Points to Include', type: 'textarea', placeholder: 'List the main points you want to cover...' },
    { id: 'tone', label: 'Tone', type: 'select', options: ['Formal', 'Semi-formal', 'Friendly', 'Professional'] },
  ],
  report: [
    { id: 'title', label: 'Report Title', type: 'text', placeholder: 'Q1 Sales Report', required: true },
    { id: 'reportType', label: 'Report Type', type: 'select', options: ['Progress Report', 'Research Report', 'Annual Report', 'Incident Report', 'Technical Report'], required: true },
    { id: 'period', label: 'Reporting Period', type: 'text', placeholder: 'January - March 2025' },
    { id: 'keyFindings', label: 'Key Findings', type: 'textarea', placeholder: 'Summarize main findings...' },
    { id: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'List your recommendations...' },
  ],
  proposal: [
    { id: 'projectName', label: 'Project Name', type: 'text', placeholder: 'Website Redesign', required: true },
    { id: 'client', label: 'Client/Recipient', type: 'text', placeholder: 'ABC Corporation' },
    { id: 'objective', label: 'Project Objective', type: 'textarea', placeholder: 'What do you aim to achieve?', required: true },
    { id: 'budget', label: 'Budget Range', type: 'text', placeholder: '$10,000 - $15,000' },
    { id: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months' },
    { id: 'deliverables', label: 'Key Deliverables', type: 'textarea', placeholder: 'List main deliverables...' },
  ],
  essay: [
    { id: 'topic', label: 'Essay Topic', type: 'text', placeholder: 'Climate Change Impact', required: true },
    { id: 'essayType', label: 'Essay Type', type: 'select', options: ['Argumentative', 'Expository', 'Narrative', 'Descriptive', 'Compare/Contrast'], required: true },
    { id: 'thesis', label: 'Thesis Statement', type: 'textarea', placeholder: 'Your main argument or point...' },
    { id: 'wordCount', label: 'Target Word Count', type: 'text', placeholder: '1500' },
    { id: 'sources', label: 'Key Sources/References', type: 'textarea', placeholder: 'List your sources...' },
  ],
};

export const useAISidebar = create<AISidebarState>((set, get) => ({
  isOpen: true,
  mode: 'chat',
  messages: [],
  isGenerating: false,
  wizardType: null,
  wizardStep: 0,
  wizardData: {},

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  setMode: (mode) => set({ mode }),

  sendMessage: async (content, documentContext) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    // Add user message to the chat
    set((state) => ({
      messages: [...state.messages, userMessage],
      isGenerating: true,
    }));

    // Create assistant message with empty content initially
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    // Add empty assistant message to start the streaming effect
    set((state) => ({
      messages: [...state.messages, assistantMessage],
    }));

    // Disable pending intent handling
    // const pending = get().pendingIntent;
    // if (pending && pending.type === 'email') {
    //   // Clear pending intent immediately (we'll fulfill it now)
    //   set({ pendingIntent: null });

    //   // Proceed to call API with an instruction to return ONLY email content
    //   try {
    //     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //         method: 'POST',
    //         headers: {
    //           'Authorization': 'Bearer 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',
    //           'Content-Type': 'application/json',
    //           'HTTP-Referer': 'https://papermorph.com',
    //           'X-Title': 'Papermorph',
    //         },
    //         body: JSON.stringify({
    //           model: 'tngtech/tng-r1t-chimera:free',
    //           messages: [
    //             { role: 'system', content: 'You are Papermorph assistant. When asked to compose an email, ask clarifying questions. When provided with email details, produce ONLY the final email text (Subject line + body) with no extra commentary.' },
    //             // include previous messages for context
    //             ...get().messages.map(msg => ({ role: msg.role, content: msg.content })),
    //             { role: 'user', content },
    //           ],
    //           stream: true,
    //         }),
    //     });

    //     if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

    //     const reader = response.body?.getReader();
    //     const decoder = new TextDecoder();
    //     let done = false;
    //     let fullResponse = '';

    //     if (!reader) throw new Error('Failed to read response stream');

    //     while (!done) {
    //       const { value, done: doneReading } = await reader.read();
    //       done = doneReading;
    //       if (value) {
    //         const chunk = decoder.decode(value, { stream: true });
    //         const lines = chunk.split('\n').filter(line => line.trim() !== '');
    //         for (const line of lines) {
    //           if (line.startsWith('data: ')) {
    //             const data = line.replace('data: ', '');
    //             if (data === '[DONE]') { done = true; break; }
    //             try {
    //               const parsed = JSON.parse(data);
    //               const c = parsed.choices[0]?.delta?.content || '';
    //               if (c) {
    //                 // Accumulate fullResponse but DO NOT update visible message until stream completes
    //                 fullResponse += c;
    //               }
    //             } catch (e) {
    //               console.error('Error parsing chunk:', e);
    //             }
    //           }
    //         }
    //       }
    //     }

    //     // When done, store the entire final email as applyContent (we instructed model to return only email)
    //     // Convert to readable text for display but keep original for apply
    //     const displayEmail = isHTMLContent(fullResponse) ? htmlToReadableText(fullResponse) : fullResponse;
    //     set((state) => ({ messages: state.messages.map(m => m.id === assistantMessageId ? { ...m, content: displayEmail, applyContent: sanitizeHTML(fullResponse) } : m) }));
    //   } catch (err) {
    //     console.error('Error during pending email generation', err);
    //     set((state) => ({ messages: state.messages.map(m => m.id === assistantMessageId ? { ...m, content: 'Sorry, failed to generate email.' } : m) }));
    //   } finally {
    //     set({ isGenerating: false });
    //   }

    //   return;
    // }

    try {
      // Build enhanced system prompt using PaperMorph AI training
      const systemPrompt = buildEnhancedSystemPrompt(documentContext || '', content);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://papermorph.com',
          'X-Title': 'Papermorph',
        },
        body: JSON.stringify({
          model: 'tngtech/tng-r1t-chimera:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...get().messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content }
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = '';

      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '');
              if (data === '[DONE]') {
                done = true;
                break;
              }
              
                      try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                          // Accumulate full response; don't update visible content until finished
                          fullResponse += content;
                        }
                      } catch (e) {
                        console.error('Error parsing chunk:', e);
                      }
            }
          }
        }
      }
      // When streaming completes, extract the main document content for the Apply button
      const extractApplyContent = (text: string) => {
        if (!text) return text;

        // Simply remove planning/thinking paragraphs and keep all the actual content
        const cleaned = text.trim();
        const paras = cleaned.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
        
        // Skip planning paragraphs at the start
        const prefixRe = /^(okay[,\s]|let me |let me start|first\b|i will\b|i'll\b|in the body\b|the format should\b|let me begin\b|here is|here's|so here|let's)/i;
        let startIdx = 0;
        while (startIdx < paras.length && prefixRe.test(paras[startIdx])) {
          startIdx++;
        }

        // Skip filler/commentary at the end
        const suffixRe = /^(please|feel free to|let me know|additionally|also|i hope|you can|this should|does this|would you|hope this|cheers|regards)/i;
        let endIdx = paras.length;
        while (endIdx > startIdx && suffixRe.test(paras[endIdx - 1])) {
          endIdx--;
        }

        // Return ALL content between start and end - no limitations!
        const resultParas = paras.slice(startIdx, endIdx);
        return resultParas.length ? resultParas.join('\n\n') : cleaned;
      };

      const applyContent = extractApplyContent(fullResponse);
      // Final display content should also be sanitized (hide planning paragraphs)
      const sanitizeFinal = (text: string) => {
        if (!text) return text;
        const cleaned = text.trim();
        const paras = cleaned.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
        const analysisRe = /^(okay[,\s]|let me |let me start|first\b|i will\b|i'll\b|in the body\b|the format should\b|let me begin\b)/i;
        let i = 0;
        while (i < paras.length && analysisRe.test(paras[i])) i++;
        const resultParas = paras.slice(i);
        return resultParas.length ? resultParas.join('\n\n') : cleaned;
      };

      const finalDisplay = sanitizeFinal(fullResponse);
      
      // Apply additional post-processing for better content application
      const processedDisplay = postProcessAIResponse(finalDisplay, 'general');
      
      // Convert HTML to readable text for chat display, but keep HTML for apply
      let displayContent = processedDisplay;
      let htmlApplyContent = applyContent;

      // If the response contains HTML, show readable text in chat
      if (isHTMLContent(processedDisplay)) {
        displayContent = htmlToReadableText(processedDisplay);
      }

      // If apply content is HTML, sanitize it for document insertion
      if (isHTMLContent(htmlApplyContent)) {
        htmlApplyContent = sanitizeHTML(htmlApplyContent);
      }
      
      // Update the assistant message once, after the stream is fully received
      set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: displayContent, applyContent: htmlApplyContent }
            : msg
        ),
      }));
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      
      // Update with error message
      set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === assistantMessageId 
            ? { 
                ...msg, 
                content: 'Sorry, I encountered an error while processing your request. Please try again later.' 
              } 
            : msg
        ),
      }));
    } finally {
      set({ isGenerating: false });
    }
  },

  clearMessages: () => set({ messages: [] }),

  generateSection: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Placeholder - would generate content and insert into document
    set({ isGenerating: false });
  },

  rewriteFormal: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isGenerating: false });
  },

  fixGrammar: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isGenerating: false });
  },

  condense: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isGenerating: false });
  },

  expand: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    set({ isGenerating: false });
  },

  summarize: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isGenerating: false });
  },

  startWizard: (type) => set({ wizardType: type, wizardStep: 0, wizardData: {}, mode: 'wizard' }),

  setWizardData: (key, value) =>
    set((state) => ({ wizardData: { ...state.wizardData, [key]: value } })),

  nextWizardStep: () => {
    const { wizardType, wizardStep } = get();
    if (wizardType && wizardStep < WIZARD_STEPS[wizardType].length - 1) {
      set({ wizardStep: wizardStep + 1 });
    }
  },

  prevWizardStep: () => {
    const { wizardStep } = get();
    if (wizardStep > 0) {
      set({ wizardStep: wizardStep - 1 });
    }
  },

  finishWizard: async () => {
    set({ isGenerating: true });
    // Placeholder - would send wizard data to AI API
    await new Promise((resolve) => setTimeout(resolve, 3000));
    set({ isGenerating: false, wizardType: null, wizardStep: 0, wizardData: {}, mode: 'chat' });
  },

  cancelWizard: () => set({ wizardType: null, wizardStep: 0, wizardData: {}, mode: 'chat' }),
  pendingIntent: null,
  setPendingIntent: (intent) => set({ pendingIntent: intent }),
}));

export { WIZARD_STEPS };
