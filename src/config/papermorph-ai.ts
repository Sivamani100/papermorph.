/**
 * PaperMorph AI Training & Prompt Configuration
 * Defines AI behavior, capabilities, and response patterns for different use cases
 * Enhanced with comprehensive document editor rules and regulations
 */

export const PAPERMORPH_AI_TRAINING = {
  // Core system behavior
  systemBehavior: {
    tone: 'professional',
    conciseness: 'concise but complete',
    focus: 'actionable and immediately applicable',
    outputFormat: 'HTML or plain text (no markdown)',
  },

  // Comprehensive document editor knowledge base
  documentEditorRules: {
    // Microsoft Word equivalent formatting rules
    formatting: {
      fonts: {
        professional: ['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana'],
        academic: ['Times New Roman', 'Georgia', 'Cambria'],
        creative: ['Arial', 'Calibri', 'Verdana'],
        technical: ['Consolas', 'Courier New', 'Monaco'],
      },
      sizes: {
        headings: { h1: '16-20pt', h2: '14-16pt', h3: '13-14pt', h4: '12-13pt' },
        body: '11-12pt',
        footnotes: '9-10pt',
        captions: '10pt',
      },
      spacing: {
        lineSpacing: { single: 1.0, singleAndHalf: 1.5, double: 2.0 },
        paragraphSpacing: { before: '6pt', after: '6pt' },
        indentation: { firstLine: '0.5in', hanging: '0.5in' },
      },
      alignment: {
        left: 'General body text',
        center: 'Titles, headings, captions',
        right: 'Dates, signatures',
        justify: 'Newspaper columns, formal documents',
      },
    },

    // Document structure standards
    structure: {
      margins: {
        standard: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
        narrow: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
        wide: { top: '1.5in', bottom: '1.5in', left: '1.5in', right: '1.5in' },
        mirror: { inside: '1.5in', outside: '1in', top: '1in', bottom: '1in' },
      },
      pageLayout: {
        orientation: ['portrait', 'landscape'],
        size: ['letter', 'a4', 'legal', 'tabloid'],
        columns: { single: 1, double: 2, three: 3, newspaper: 2 },
      },
      sections: {
        header: 'Document title, author, date',
        footer: 'Page numbers, confidentiality notices',
        tableOfContents: 'Auto-generated with page numbers',
        bibliography: 'Formatted citations and references',
        appendix: 'Supplementary materials',
      },
    },

    // Grammar and style conventions
    grammar: {
      punctuation: {
        oxfordComma: 'Use in formal writing for clarity',
        serialComma: 'Required in academic and legal documents',
        emDash: '— for emphasis and parenthetical statements',
        enDash: '– for ranges (2010–2020)',
        hyphen: '- for compound words and line breaks',
      },
      capitalization: {
        titleCase: 'Major Words: Articles, Prepositions, Conjunctions lowercase',
        sentenceCase: 'Only first word and proper nouns capitalized',
        allCaps: 'For emphasis only, never for body text',
        smallCaps: 'For abbreviations and stylistic elements',
      },
      numbers: {
        spellOut: 'Zero through nine',
        numerals: '10 and above',
        percentages: 'Always use numerals with % symbol',
        currency: 'Always use numerals with currency symbols',
        dates: 'Month Day, Year (January 1, 2025)',
      },
    },

    // Professional writing standards
    professionalStandards: {
      tone: {
        formal: 'Third person, passive voice where appropriate',
        semiFormal: 'First person plural, active voice preferred',
        informal: 'First person singular, conversational',
        technical: 'Precise terminology, minimal ambiguity',
      },
      clarity: {
        activeVoice: 'Prefer over passive for clarity',
        simpleLanguage: 'Avoid jargon unless necessary',
        shortSentences: 'Average 15-20 words',
        shortParagraphs: '3-5 sentences maximum',
      },
      consistency: {
        terminology: 'Use same terms throughout document',
        formatting: 'Apply styles consistently',
        numbering: 'Follow sequential patterns',
        citations: 'Use consistent citation style',
      },
    },
  },

  // Document type specifications
  documentTypes: {
    business: {
      letter: {
        structure: ['header', 'date', 'recipient', 'salutation', 'body', 'closing', 'signature'],
        font: 'Calibri or Times New Roman',
        size: '11-12pt',
        margins: 'Standard 1-inch',
        spacing: 'Single or 1.5',
        alignment: 'Left-aligned',
      },
      memo: {
        structure: ['to', 'from', 'date', 'subject', 'body'],
        font: 'Arial or Calibri',
        size: '11pt',
        margins: 'Standard 1-inch',
        spacing: 'Single',
        alignment: 'Left-aligned',
      },
      report: {
        structure: ['title', 'executive', 'summary', 'introduction', 'findings', 'conclusion', 'recommendations'],
        font: 'Times New Roman or Calibri',
        size: '11pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Justified',
      },
      proposal: {
        structure: ['cover', 'executive', 'summary', 'problem', 'solution', 'timeline', 'budget', 'conclusion'],
        font: 'Calibri or Arial',
        size: '11pt',
        margins: 'Standard 1-inch',
        spacing: '1.5',
        alignment: 'Left-aligned',
      },
    },
    academic: {
      essay: {
        structure: ['introduction', 'thesis', 'body', 'conclusion', 'references'],
        font: 'Times New Roman',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Left-aligned',
      },
      research: {
        structure: ['abstract', 'introduction', 'literature', 'methodology', 'results', 'discussion', 'conclusion', 'references'],
        font: 'Times New Roman',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Left-aligned',
      },
      thesis: {
        structure: ['title', 'abstract', 'acknowledgments', 'table', 'contents', 'introduction', 'chapters', 'conclusion', 'bibliography', 'appendices'],
        font: 'Times New Roman',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Left-aligned',
      },
    },
    legal: {
      contract: {
        structure: ['title', 'parties', 'recitals', 'terms', 'conditions', 'signatures'],
        font: 'Times New Roman',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Left-aligned',
      },
      brief: {
        structure: ['caption', 'table', 'contents', 'statement', 'argument', 'conclusion', 'signature'],
        font: 'Times New Roman',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Left-aligned',
      },
    },
    creative: {
      story: {
        structure: ['title', 'author', 'body'],
        font: 'Times New Roman or Georgia',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Double',
        alignment: 'Left-aligned',
      },
      script: {
        structure: ['title', 'author', 'characters', 'scenes', 'dialogue'],
        font: 'Courier New',
        size: '12pt',
        margins: 'Standard 1-inch',
        spacing: 'Single',
        alignment: 'Left-aligned',
      },
    },
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

    // NEW: Enhanced document creation capabilities
    createResume: {
      triggers: ['create a resume', 'write a resume', 'build a resume', 'cv', 'curriculum vitae'],
      instruction: `Generate a professional resume with:
- Contact information header
- Professional summary/objective
- Work experience with bullet points
- Education background
- Skills section
- Optional: certifications, awards, languages
Use clean, professional formatting with clear sections.
Return only the resume content.`,
      contentType: 'full_document',
    },

    createCoverLetter: {
      triggers: ['write a cover letter', 'create a cover letter', 'job application letter'],
      instruction: `Generate a compelling cover letter that:
- Includes your contact info and date
- Addresses the hiring manager
- References the specific position
- Highlights relevant qualifications
- Shows enthusiasm for the role
- Includes a strong call to action
Use professional, persuasive language.
Return only the cover letter content.`,
      contentType: 'full_document',
    },

    createMeetingAgenda: {
      triggers: ['create meeting agenda', 'write agenda', 'meeting plan'],
      instruction: `Generate a structured meeting agenda with:
- Meeting title, date, time, location
- Attendees list
- Meeting objectives
- Agenda items with time allocations
- Required materials/preparation
- Action items follow-up
Use clear, organized formatting.
Return only the agenda content.`,
      contentType: 'full_document',
    },

    createMeetingMinutes: {
      triggers: ['write meeting minutes', 'create minutes', 'meeting notes'],
      instruction: `Generate professional meeting minutes including:
- Meeting details (date, time, attendees)
- Meeting purpose
- Key discussion points
- Decisions made
- Action items with responsibilities
- Next meeting date
Use clear, factual language.
Return only the minutes content.`,
      contentType: 'full_document',
    },

    createPressRelease: {
      triggers: ['write press release', 'create press release', 'media release'],
      instruction: `Generate a professional press release with:
- "FOR IMMEDIATE RELEASE" header
- Catchy headline
- Dateline (city, state)
- Introduction paragraph (who, what, when, where, why)
- Body paragraphs with details
- Quotes from key people
- Boilerplate about organization
- Contact information
Use journalistic style.
Return only the press release content.`,
      contentType: 'full_document',
    },

    createNewsletter: {
      triggers: ['write newsletter', 'create newsletter', 'company newsletter'],
      instruction: `Generate an engaging newsletter with:
- Compelling header/title
- Date and issue number
- Table of contents
- Multiple sections with headlines
- Engaging content for each section
- Call-to-action items
- Contact information
Use conversational yet professional tone.
Return only the newsletter content.`,
      contentType: 'full_document',
    },

    createBlogPost: {
      triggers: ['write blog post', 'create blog', 'blog article'],
      instruction: `Generate an engaging blog post with:
- Catchy title
- Compelling introduction
- Well-structured body with subheadings
- Engaging content with examples
- Clear conclusion
- Call-to-action
Use conversational, engaging tone.
Return only the blog post content.`,
      contentType: 'full_document',
    },

    createSocialMediaContent: {
      triggers: ['write social media', 'create social post', 'social media content'],
      instruction: `Generate social media content that:
- Is platform-appropriate (Twitter, LinkedIn, Facebook, Instagram)
- Has engaging hook
- Includes relevant hashtags
- Has clear call-to-action
- Fits character limits
- Uses appropriate tone for platform
Return only the social media content.`,
      contentType: 'transformed_text',
    },

    createTechnicalDocumentation: {
      triggers: ['write technical documentation', 'create user manual', 'technical guide'],
      instruction: `Generate clear technical documentation with:
- Title and overview
- Prerequisites
- Step-by-step instructions
- Screenshots/diagrams descriptions
- Troubleshooting section
- FAQ section
Use clear, precise language and logical organization.
Return only the documentation content.`,
      contentType: 'full_document',
    },

    createPolicyDocument: {
      triggers: ['write policy', 'create policy document', 'company policy'],
      instruction: `Generate a formal policy document with:
- Policy title and number
- Effective date
- Purpose statement
- Scope
- Policy statement
- Procedures
- Responsibilities
- Enforcement/consequences
- Related documents
Use formal, precise language.
Return only the policy content.`,
      contentType: 'full_document',
    },

    createContract: {
      triggers: ['write contract', 'create agreement', 'legal agreement'],
      instruction: `Generate a basic contract with:
- Contract title
- Parties involved
- Recitals/background
- Terms and conditions
- Obligations of each party
- Payment terms (if applicable)
- Term and termination
- Signatures
Use formal legal language.
Return only the contract content.`,
      contentType: 'full_document',
    },

    createInvoice: {
      triggers: ['create invoice', 'write invoice', 'billing invoice'],
      instruction: `Generate a professional invoice with:
- "INVOICE" header
- Invoice number and date
- Bill to and ship to information
- Itemized list with descriptions, quantities, rates
- Subtotal, taxes, total amount
- Payment terms and methods
- Due date
Use clear, organized format.
Return only the invoice content.`,
      contentType: 'full_document',
    },

    createBusinessPlan: {
      triggers: ['write business plan', 'create business plan', 'company plan'],
      instruction: `Generate a comprehensive business plan with:
- Executive summary
- Company description
- Market analysis
- Organization and management
- Products/services
- Marketing and sales strategy
- Financial projections
- Funding request (if applicable)
Use professional, persuasive language.
Return only the business plan content.`,
      contentType: 'full_document',
    },

    createMarketingPlan: {
      triggers: ['write marketing plan', 'create marketing strategy'],
      instruction: `Generate a strategic marketing plan with:
- Executive summary
- Situation analysis
- Marketing objectives
- Target audience
- Marketing strategies
- Tactics and channels
- Budget allocation
- Metrics and KPIs
- Timeline
Use strategic, actionable language.
Return only the marketing plan content.`,
      contentType: 'full_document',
    },

    createProjectPlan: {
      triggers: ['write project plan', 'create project plan', 'project proposal'],
      instruction: `Generate a detailed project plan with:
- Project title and overview
- Objectives and deliverables
- Scope and exclusions
- Timeline with milestones
- Resource requirements
- Risk assessment
- Budget estimate
- Success criteria
Use clear, structured format.
Return only the project plan content.`,
      contentType: 'full_document',
    },

    createTrainingManual: {
      triggers: ['write training manual', 'create training guide', 'employee handbook'],
      instruction: `Generate a comprehensive training manual with:
- Table of contents
- Introduction and objectives
- Module/chapter divisions
- Step-by-step instructions
- Examples and case studies
- Review questions
- Assessment criteria
Use clear, instructional language.
Return only the training manual content.`,
      contentType: 'full_document',
    },

    createResearchPaper: {
      triggers: ['write research paper', 'create research article', 'academic paper'],
      instruction: `Generate an academic research paper with:
- Abstract
- Introduction with research question
- Literature review
- Methodology
- Results/findings
- Discussion
- Conclusion
- References
Use formal academic language and proper citations.
Return only the research paper content.`,
      contentType: 'full_document',
    },

    createCaseStudy: {
      triggers: ['write case study', 'create case study', 'business case study'],
      instruction: `Generate a compelling case study with:
- Executive summary
- Client background
- Challenge/problem
- Solution implemented
- Results and metrics
- Lessons learned
- Testimonials
Use storytelling approach with data.
Return only the case study content.`,
      contentType: 'full_document',
    },

    createWhitePaper: {
      triggers: ['write white paper', 'create white paper', 'industry white paper'],
      instruction: `Generate an authoritative white paper with:
- Compelling title
- Executive summary
- Introduction to the problem
- In-depth analysis
- Proposed solution
- Supporting data and research
- Conclusion and recommendations
Use expert, authoritative tone.
Return only the white paper content.`,
      contentType: 'full_document',
    },

    // Enhanced text transformation capabilities
    improveReadability: {
      triggers: ['improve readability', 'make easier to read', 'enhance clarity'],
      instruction: `Improve text readability by:
- Breaking long sentences into shorter ones
- Using simpler words without losing meaning
- Improving paragraph structure
- Adding transitions where needed
- Ensuring logical flow
Return only the improved text.`,
      contentType: 'transformed_text',
    },

    adjustTone: {
      triggers: ['change tone', 'adjust tone', 'different tone'],
      instruction: `Adjust the text tone as requested:
- Identify the desired tone (formal, casual, professional, friendly, authoritative)
- Modify word choice and sentence structure
- Maintain the original meaning
- Ensure consistency throughout
Return only the adjusted text.`,
      contentType: 'transformed_text',
    },

    simplifyLanguage: {
      triggers: ['simplify language', 'make simpler', 'easy to understand'],
      instruction: `Simplify the text while preserving meaning:
- Replace complex words with simpler alternatives
- Break down complex concepts
- Use shorter sentences
- Add clarifying examples if needed
- Maintain accuracy and key information
Return only the simplified text.`,
      contentType: 'transformed_text',
    },

    enhanceVocabulary: {
      triggers: ['enhance vocabulary', 'improve wording', 'better vocabulary'],
      instruction: `Enhance the vocabulary in the text:
- Replace common words with more sophisticated alternatives
- Use precise, descriptive language
- Maintain natural flow and readability
- Avoid over-complicating simple ideas
- Ensure words fit the context
Return only the enhanced text.`,
      contentType: 'transformed_text',
    },

    addTransitions: {
      triggers: ['add transitions', 'improve flow', 'better transitions'],
      instruction: `Add smooth transitions to improve text flow:
- Identify logical connections between ideas
- Add appropriate transition words and phrases
- Ensure smooth progression of thoughts
- Maintain coherence and readability
- Don't overuse transitions
Return only the improved text.`,
      contentType: 'transformed_text',
    },

    reorganizeContent: {
      triggers: ['reorganize', 'restructure', 'better organization'],
      instruction: `Reorganize the content for better structure:
- Group related ideas together
- Create logical flow from general to specific
- Ensure proper paragraph structure
- Add headings if needed
- Maintain coherence and readability
Return only the reorganized content.`,
      contentType: 'transformed_text',
    },

    // Specialized content creation
    createFAQ: {
      triggers: ['create faq', 'write faq', 'frequently asked questions'],
      instruction: `Generate a comprehensive FAQ section with:
- Common questions about the topic
- Clear, concise answers
- Logical organization by category
- Helpful, informative responses
- Professional yet accessible tone
Return only the FAQ content.`,
      contentType: 'full_document',
    },

    createGlossary: {
      triggers: ['create glossary', 'write glossary', 'define terms'],
      instruction: `Generate a glossary with:
- Alphabetical list of terms
- Clear, concise definitions
- Context-specific explanations
- Examples where helpful
- Consistent formatting
Return only the glossary content.`,
      contentType: 'full_document',
    },

    createChecklist: {
      triggers: ['create checklist', 'make checklist', 'todo list'],
      instruction: `Generate a practical checklist with:
- Clear, actionable items
- Logical organization
- Checkboxes or bullet points
- Specific, measurable tasks
- Comprehensive coverage of the topic
Return only the checklist content.`,
      contentType: 'full_document',
    },

    createSOP: {
      triggers: ['create sop', 'write standard operating procedure', 'procedure manual'],
      instruction: `Generate standard operating procedures with:
- Purpose and scope
- Responsibilities
- Step-by-step procedures
- Quality control measures
- Documentation requirements
- Revision history
Use precise, instructional language.
Return only the SOP content.`,
      contentType: 'full_document',
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

  // Comprehensive document templates for quick generation
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

    resume: `[Your Name]
[Your Address] | [Phone] | [Email] | [LinkedIn]

---

**PROFESSIONAL SUMMARY**
[2-3 sentence summary of your qualifications and career goals]

**WORK EXPERIENCE**

**[Job Title]** | [Company Name] | [City, State]
*[Start Date] - [End Date]*
- [Achievement 1 with quantifiable results]
- [Achievement 2 with quantifiable results]
- [Achievement 3 with quantifiable results]

**EDUCATION**

**[Degree]** | [University Name] | [Graduation Year]
- [Relevant coursework or achievements]

**SKILLS**
- [Skill 1]: [Proficiency level]
- [Skill 2]: [Proficiency level]
- [Skill 3]: [Proficiency level]`,

    proposal: `# [Project Name] - Proposal

## Executive Summary
[Brief overview of the proposal]

## Problem Statement
[Description of the problem or opportunity]

## Proposed Solution
[Detailed description of your solution]

## Timeline
[Phase 1]: [Duration] - [Description]
[Phase 2]: [Duration] - [Description]
[Phase 3]: [Duration] - [Description]

## Budget
- [Item 1]: $[Cost]
- [Item 2]: $[Cost]
- [Item 3]: $[Cost]
**Total: $[Total Amount]**

## Conclusion
[Summary and call to action]`,
  },

  // Advanced document analysis patterns
  documentAnalysis: {
    // Content type detection patterns
    contentTypePatterns: {
      letter: /\b(dear|sincerely|regards|yours)\b/i,
      email: /\b(subject|to:|from:|cc:|bcc:)\b/i,
      report: /\b(executive summary|findings|recommendations|conclusion)\b/i,
      academic: /\b(abstract|methodology|literature review|bibliography)\b/i,
      legal: /\b(whereas|therefore|party|agreement|contract)\b/i,
      creative: /\b(chapter|once upon a time|character|dialogue)\b/i,
    },
    
    // Quality assessment metrics
    qualityMetrics: {
      readability: {
        fleschKincaid: 'Score 0-100 (higher = easier)',
        averageWordsPerSentence: 'Optimal: 15-20 words',
        averageSentencesPerParagraph: 'Optimal: 3-5 sentences',
      },
      structure: {
        hasIntroduction: 'Clear opening paragraph',
        hasBody: 'Well-developed main content',
        hasConclusion: 'Proper closing or summary',
        hasTransitions: 'Smooth flow between sections',
      },
      formatting: {
        consistentSpacing: 'Proper line and paragraph spacing',
        consistentFont: 'Uniform font usage',
        properAlignment: 'Appropriate text alignment',
        properHeadings: 'Hierarchical heading structure',
      },
    },
  },

  // Industry-specific writing standards
  industryStandards: {
    academic: {
      citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE'],
      tone: 'Formal, objective, evidence-based',
      structure: 'Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion',
      formatting: 'Double-spaced, 12pt Times New Roman, 1-inch margins',
    },
    business: {
      documentTypes: ['Memo', 'Report', 'Proposal', 'Contract', 'Invoice'],
      tone: 'Professional, concise, action-oriented',
      structure: 'Executive Summary, Introduction, Body, Conclusion, Recommendations',
      formatting: 'Single or 1.5 spaced, 11-12pt Calibri/Arial, standard margins',
    },
    legal: {
      documentTypes: ['Contract', 'Agreement', 'Brief', 'Memorandum', 'Will'],
      tone: 'Formal, precise, unambiguous',
      structure: 'Title, Parties, Recitals, Terms, Conditions, Signatures',
      formatting: 'Double-spaced, 12pt Times New Roman, numbered paragraphs',
    },
    medical: {
      documentTypes: ['Patient Report', 'Medical History', 'Prescription', 'Referral Letter'],
      tone: 'Clinical, objective, precise',
      structure: 'Patient Info, History, Examination, Diagnosis, Treatment, Follow-up',
      formatting: 'Clear headings, concise entries, proper medical terminology',
    },
    technical: {
      documentTypes: ['Manual', 'Specification', 'Procedure', 'Technical Report'],
      tone: 'Technical, precise, instructional',
      structure: 'Overview, Requirements, Design, Implementation, Testing, Documentation',
      formatting: 'Clear sections, numbered steps, technical diagrams',
    },
  },

  // Comprehensive writing style guidelines
  styleGuidelines: {
    professional: {
      vocabulary: 'Business-appropriate, industry-specific',
      sentenceStructure: 'Varied sentence length, active voice preferred',
      paragraphStructure: 'Topic sentence, supporting details, concluding thought',
      transitions: 'Logical connectors between ideas',
      formatting: 'Consistent, clean, hierarchical',
    },
    academic: {
      vocabulary: 'Scholarly, discipline-specific',
      sentenceStructure: 'Complex but clear, formal',
      paragraphStructure: 'Claim, evidence, analysis, link',
      transitions: 'Academic phrases, logical flow',
      formatting: 'Citation-integrated, structured',
    },
    creative: {
      vocabulary: 'Descriptive, evocative, varied',
      sentenceStructure: 'Varied for effect, rhetorical devices',
      paragraphStructure: 'Narrative flow, sensory details',
      transitions: 'Literary devices, smooth flow',
      formatting: 'Stylistic, genre-appropriate',
    },
    technical: {
      vocabulary: 'Precise, standardized, unambiguous',
      sentenceStructure: 'Clear, direct, imperative',
      paragraphStructure: 'Step-by-step, logical progression',
      transitions: 'Sequential markers, clear connections',
      formatting: 'Structured, coded, documented',
    },
  },

  // Advanced text enhancement patterns
  textEnhancement: {
    rephrase: {
      techniques: ['Synonym replacement', 'Sentence restructuring', 'Voice change', 'Tone adjustment'],
      preserveElements: ['Core meaning', 'Key data', 'Proper nouns', 'Technical terms'],
      enhanceElements: ['Clarity', 'Flow', 'Engagement', 'Professionalism'],
    },
    grammar: {
      checks: ['Spelling', 'Punctuation', 'Grammar rules', 'Syntax', 'Usage'],
      corrections: ['Misspellings', 'Punctuation errors', 'Grammar mistakes', 'Awkward phrasing'],
      improvements: ['Word choice', 'Sentence structure', 'Readability', 'Flow'],
    },
    expansion: {
      methods: ['Add examples', 'Include details', 'Provide context', 'Elaborate concepts'],
      addElements: ['Supporting evidence', 'Illustrative cases', 'Background info', 'Explanations'],
      maintainElements: ['Original meaning', 'Core message', 'Key points', 'Logical flow'],
    },
    condensation: {
      techniques: ['Remove redundancy', 'Combine sentences', 'Eliminate filler', 'Focus on essentials'],
      preserveElements: ['Main ideas', 'Key data', 'Critical points', 'Essential information'],
      removeElements: ['Repetitions', 'Wordiness', 'Irrelevant details', 'Filler phrases'],
    },
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
