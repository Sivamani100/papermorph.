/**
 * PaperMorph AI Training & Prompt Configuration
 * Defines AI behavior, capabilities, and response patterns for different use cases
 */

export const PAPERMORPH_AI_TRAINING = {
  // Core system behavior
  systemBehavior: {
    tone: 'professional',
    conciseness: 'concise but complete',
    focus: 'actionable and immediately applicable',
    outputFormat: 'HTML or plain text (no markdown)',
  },

  // Specific use case handlers
  useCases: {
    // Letter writing
    letter: {
      triggers: ['write a letter', 'draft a letter', 'compose a letter', 'letter to'],
      instruction: `Generate a professional letter with proper formatting:
- Include date, recipient address, salutation
- Well-structured body paragraphs
- Professional closing (Regards, Sincerely, Yours faithfully, etc.)
- Signature line
Return only the letter content, no explanations.`,
      contentType: 'full_document',
    },

    // Email writing
    email: {
      triggers: ['write an email', 'draft an email', 'compose an email', 'email to', 'send an email'],
      instruction: `Generate a professional email with proper structure:
- Subject: line
- Greeting
- Well-organized body
- Professional closing
- Signature
Return as plain text with clear subject line at the top.`,
      contentType: 'full_document',
    },

    // Report writing
    report: {
      triggers: ['write a report', 'create a report', 'generate a report', 'draft a report'],
      instruction: `Generate a structured report with:
- Executive Summary
- Introduction
- Sections with clear headings
- Key findings or points
- Recommendations
- Conclusion
Use proper HTML formatting for headings and structure.`,
      contentType: 'full_document',
    },

    // Proposal writing
    proposal: {
      triggers: ['write a proposal', 'create a proposal', 'draft a proposal'],
      instruction: `Generate a professional proposal with:
- Title page info
- Executive Summary
- Problem Statement
- Proposed Solution
- Timeline
- Budget (if relevant)
- Call to Action
Format with proper headings and structure.`,
      contentType: 'full_document',
    },

    // Essay writing
    essay: {
      triggers: ['write an essay', 'create an essay', 'draft an essay', 'essay about'],
      instruction: `Generate a well-structured essay with:
- Introduction with thesis statement
- Body paragraphs with supporting arguments
- Topic sentences and transitions
- Conclusion that reinforces thesis
Use proper paragraph formatting and clear structure.`,
      contentType: 'full_document',
    },

    // Text editing - make professional
    makeProfessional: {
      triggers: ['make more professional', 'make it professional', 'professional tone', 'formal tone'],
      instruction: `Rewrite the given text in a professional, formal tone:
- Use sophisticated vocabulary
- Remove casual language
- Maintain original meaning
- Use complete sentences
- Add appropriate punctuation
Return only the rewritten text.`,
      contentType: 'transformed_text',
    },

    // Text editing - condense
    condense: {
      triggers: ['make it shorter', 'condense', 'shorten', 'brief version', 'summarize'],
      instruction: `Condense the given text to its essential points:
- Reduce wordiness
- Remove redundancies
- Keep main ideas
- Maintain clarity
- Target 50-70% of original length
Return only the condensed text.`,
      contentType: 'transformed_text',
    },

    // Text editing - expand
    expand: {
      triggers: ['add more detail', 'expand', 'elaborate', 'make it longer', 'more details'],
      instruction: `Expand the given text with additional details:
- Add supporting information
- Include examples where relevant
- Provide more context
- Elaborate on key points
- Maintain coherence
Return only the expanded text.`,
      contentType: 'transformed_text',
    },

    // Grammar and fixing
    fixGrammar: {
      triggers: ['check for errors', 'fix grammar', 'grammar check', 'correct', 'proofread'],
      instruction: `Fix grammar, spelling, and punctuation errors:
- Correct grammar mistakes
- Fix spelling errors
- Improve punctuation
- Maintain original tone and meaning
- Suggest better phrasing if appropriate
Return only the corrected text.`,
      contentType: 'transformed_text',
    },

    // Table generation
    generateTable: {
      triggers: ['create a table', 'generate a table', 'make a table', 'table with'],
      instruction: `Generate a properly formatted HTML table:
- Use <table>, <tr>, <td>, <th> elements
- Include headers if relevant
- Proper structure and alignment
- Make it visually organized
Return only the HTML table.`,
      contentType: 'html_element',
    },

    // Content generation for sections
    generateSection: {
      triggers: ['generate content', 'write content', 'create content', 'add section'],
      instruction: `Generate well-structured content for a document section:
- Use proper paragraph formatting
- Include headings if multi-part
- Clear and organized
- Immediately applicable
- Professional quality
Return only the content.`,
      contentType: 'section_content',
    },
  },

  // Context extraction patterns
  contextPatterns: {
    // Extract document title from HTML
    documentTitle: /<h1[^>]*>([^<]+)<\/h1>/,
    
    // Extract main content blocks
    contentBlocks: /<(p|h[1-6]|li|td)[^>]*>([^<]+)<\/(p|h[1-6]|li|td)>/g,
  },

  // Response post-processing rules
  responseProcessing: {
    // Remove planning paragraphs
    filterPlanningParagraphs: [
      'okay,',
      'let me',
      'let me start',
      'first',
      'i will',
      "i'll",
      'in the body',
      'the format should',
      'let me begin',
    ],

    // Indicators for template/document content
    documentIndicators: [
      'Subject:',
      'Dear',
      'Yours sincerely',
      'Yours faithfully',
      'To,',
      'Date',
      'Regards,',
      'Sincerely,',
    ],
  },

  // Document templates for quick generation
  templates: {
    letter: `[Date]

[Recipient Name]
[Recipient Title]
[Company Name]
[Address]
[City, Country]

Dear [Recipient Name],

[Opening paragraph - purpose of letter]

[Body paragraphs - main content]

[Closing paragraph - call to action or conclusion]

[Closing],

[Your Name]`,

    email: `To: [Recipient Email]
Subject: [Subject Line]

Dear [Recipient Name],

[Opening]

[Body]

[Closing]

Best regards,
[Your Name]`,

    report: `# [Report Title]

## Executive Summary
[Brief overview of report]

## Introduction
[Background and context]

## Key Findings
[Main points and data]

## Analysis
[Detailed analysis]

## Recommendations
[Actionable recommendations]

## Conclusion
[Summary and next steps]`,
  },

  // Metadata for improving accuracy
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-01',
    trainingGoal: 'Make AI understand PaperMorph document structure and respond with immediately applicable content',
    responseQuality: 'professional, accurate, ready to apply',
  },
};

/**
 * Build enhanced system prompt for PaperMorph
 * @param documentContext - The current document HTML
 * @param userQuery - The user's question or request
 * @returns Enhanced system prompt
 */
export function buildEnhancedSystemPrompt(
  documentContext: string,
  userQuery: string
): string {
  // Detect use case from user query
  const queryLower = userQuery.toLowerCase();
  let detectedUseCase = null;

  for (const [caseKey, caseConfig] of Object.entries(PAPERMORPH_AI_TRAINING.useCases)) {
    if (caseConfig.triggers.some(trigger => queryLower.includes(trigger))) {
      detectedUseCase = { key: caseKey, config: caseConfig };
      break;
    }
  }

  // Build base prompt
  let basePrompt = `You are PaperMorph AI Assistant - integrated into PaperMorph, a professional document editor.

ABOUT PAPERMORPH:
- Word processor with Microsoft Word-like features
- Supports formatting, spacing, tables, and templates
- Rich text editing with AI assistance
- Export capabilities (HTML, text)

KEY CAPABILITIES:
- Generate professional documents (letters, emails, reports, proposals, essays)
- Edit and transform text (rewrite, condense, expand, fix grammar)
- Create tables and structured content
- Provide formatting suggestions
- Maintain document context and coherence`;

  // Add document context if available
  if (documentContext && documentContext.trim()) {
    basePrompt += `\n\nCURRENT DOCUMENT CONTENT:\n---\n${documentContext}\n---`;
  }

  // Add specific use case instructions if detected
  if (detectedUseCase) {
    basePrompt += `\n\nUSER REQUEST TYPE: ${detectedUseCase.config.contentType}\n`;
    basePrompt += `SPECIFIC INSTRUCTIONS:\n${detectedUseCase.config.instruction}`;
  }

  // Add general response guidelines
  basePrompt += `\n\nRESPONSE GUIDELINES:
- Return content ready to apply directly to the document
- Use HTML formatting when structure is needed (headings, tables, etc.)
- NO MARKDOWN - use HTML instead
- For text transformations, return only the transformed text
- For documents, return the complete formatted content
- NO explanations or preamble
- NO "Here's the..." or similar phrases
- Keep it concise but complete
- Consider the current document context for relevance`;

  return basePrompt;
}

/**
 * Post-process AI response to clean up and format properly
 * @param response - Raw AI response
 * @param contentType - Type of content expected
 * @returns Cleaned and formatted response
 */
export function postProcessAIResponse(
  response: string,
  contentType: string
): string {
  let processed = response.trim();

  // Remove planning/thinking paragraphs at the start
  const filterPhrases = PAPERMORPH_AI_TRAINING.responseProcessing.filterPlanningParagraphs;
  const lines = processed.split('\n');
  let startIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i].toLowerCase();
    if (filterPhrases.some(phrase => lineText.startsWith(phrase))) {
      startIdx = i + 1;
    } else {
      break;
    }
  }

  if (startIdx > 0) {
    processed = lines.slice(startIdx).join('\n').trim();
  }

  // Remove code fence markers
  processed = processed.replace(/```[\w]*\n?/g, '').trim();

  // For transformed text, ensure no explanations
  if (contentType === 'transformed_text') {
    // Remove lines that look like explanations
    const parts = processed.split('\n\n');
    processed = parts
      .filter(part => {
        const lower = part.toLowerCase();
        return !lower.startsWith('i have') &&
               !lower.startsWith('here') &&
               !lower.startsWith('this') &&
               !lower.startsWith('the changes') &&
               !lower.startsWith('now');
      })
      .join('\n\n');
  }

  return processed;
}
