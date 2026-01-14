// Template system for PAPERMORPH
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  previewImageUrl?: string;
  tags?: string[];
  isBuiltIn?: boolean;
}

export const BUILT_IN_TEMPLATES: Template[] = [
  // Business Templates
  {
    id: 'business-letter',
    name: 'Business Letter',
    description: 'Professional business letter template',
    category: 'Business',
    content: `Your Name
Your Address
City, State ZIP
Email | Phone

Date

Recipient Name
Company Name
Address
City, State ZIP

Dear [Recipient Name],

[Opening paragraph - state your purpose clearly]

[Second paragraph - provide details and supporting information]

[Third paragraph - explain benefits or next steps]

[Closing paragraph - summarize and call to action]

Sincerely,
[Your Name]
[Your Title]`,
    tags: ['letter', 'business', 'formal', 'communication'],
    isBuiltIn: true,
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Professional meeting minutes template',
    category: 'Business',
    content: `MEETING MINUTES

Date: [Date]
Time: [Start Time] - [End Time]
Location: [Location/Meeting Room]
Meeting Type: [Regular/Special/Board]

ATTENDEES
• [Name] - [Title/Department]
• [Name] - [Title/Department]
• [Name] - [Title/Department]

ABSENT
• [Name] - [Reason]

AGENDA ITEMS
1. [Agenda Item 1]
2. [Agenda Item 2]
3. [Agenda Item 3]

DISCUSSION & DECISIONS

[Agenda Item 1]
Discussion: [Key points discussed]
Decision: [Decision made]
Action Items: [What needs to be done, by whom, by when]

[Agenda Item 2]
Discussion: [Key points discussed]
Decision: [Decision made]
Action Items: [What needs to be done, by whom, by when]

NEXT MEETING
Date: [Next meeting date]
Time: [Next meeting time]
Location: [Next meeting location]

Minutes recorded by: [Your Name]`,
    tags: ['meeting', 'notes', 'minutes', 'business'],
    isBuiltIn: true,
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'Comprehensive project proposal template',
    category: 'Business',
    content: `PROJECT PROPOSAL

Project Title: [Project Name]
Date: [Date]
Prepared by: [Your Name/Department]
Client: [Client Name]

EXECUTIVE SUMMARY
[Brief overview of the project, key objectives, and expected outcomes]

PROJECT OVERVIEW
• Project Goal: [What you aim to achieve]
• Scope: [What's included and excluded]
• Timeline: [Start date to completion date]
• Budget: [Total estimated cost]

OBJECTIVES
1. [Specific, measurable objective 1]
2. [Specific, measurable objective 2]
3. [Specific, measurable objective 3]

METHODOLOGY
[Describe your approach, methods, and processes]

DELIVERABLES
• [Deliverable 1] - [Due date]
• [Deliverable 2] - [Due date]
• [Deliverable 3] - [Due date]

TEAM
• [Team Member 1] - [Role]
• [Team Member 2] - [Role]
• [Team Member 3] - [Role]

BUDGET BREAKDOWN
• Labor: $[Amount]
• Materials: $[Amount]
• Equipment: $[Amount]
• Other: $[Amount]
• Total: $[Total Amount]

NEXT STEPS
1. [Immediate next action]
2. [Follow-up action]
3. [Timeline milestone]

For questions or approval, contact:
[Your Name]
[Your Title]
[Your Contact Information]`,
    tags: ['proposal', 'project', 'business', 'planning'],
    isBuiltIn: true,
  },
  {
    id: 'invoice-template',
    name: 'Invoice',
    description: 'Professional invoice template',
    category: 'Business',
    content: `INVOICE

Invoice #: [Invoice Number]
Date: [Date]
Due Date: [Due Date]

BILL TO
[Client Name]
[Client Address]
[City, State ZIP]
[Email]
[Phone]

FROM
[Your Name/Company]
[Your Address]
[City, State ZIP]
[Email]
[Phone]

ITEMS DESCRIPTION

Item Description                     Quantity    Rate        Amount
--------------------------------------------------------------------
[Service/Product 1]                 [Qty]        $[Rate]     $[Amount]
[Service/Product 2]                 [Qty]        $[Rate]     $[Amount]
[Service/Product 3]                 [Qty]        $[Rate]     $[Amount]

SUBTOTAL:                                         $[Subtotal]
Tax ([%]%):                                       $[Tax]
DISCOUNT:                                        -$[Discount]
TOTAL:                                           $[Total]

PAYMENT TERMS
• Payment due within [Number] days
• Late payments subject to [Late fee details]
• Payment methods: [Accepted payment methods]

THANK YOU FOR YOUR BUSINESS!

Please make checks payable to: [Your Name/Company]`,
    tags: ['invoice', 'billing', 'business', 'finance'],
    isBuiltIn: true,
  },

  // Academic Templates
  {
    id: 'academic-essay',
    name: 'Academic Essay',
    description: 'Standard academic essay format with proper structure',
    category: 'Academic',
    content: `[Your Name]
[Course Name]
[Instructor Name]
[Date]

[Essay Title]

Introduction
The introduction should grab the reader's attention and provide background information on your topic. End with a clear thesis statement that presents your main argument or position.

[Write your introduction here, including your thesis statement]

Body Paragraph 1
Start with a topic sentence that relates to your thesis. Provide evidence, examples, and analysis to support your point. Use transition words to connect ideas.

[Write your first body paragraph here]

Body Paragraph 2
Continue developing your argument with another main point. Use supporting evidence from credible sources. Remember to cite your sources properly.

[Write your second body paragraph here]

Body Paragraph 3
Present your third main point with supporting evidence. Consider addressing counterarguments or limitations in your research.

[Write your third body paragraph here]

Conclusion
Summarize your main points and restate your thesis in a new way. End with a final thought, call to action, or implication for future research.

[Write your conclusion here]

Works Cited
[List your sources in the appropriate citation format]`,
    tags: ['essay', 'academic', 'school', 'research'],
    isBuiltIn: true,
  },
  {
    id: 'lab-report',
    name: 'Lab Report',
    description: 'Scientific laboratory report template',
    category: 'Academic',
    content: `[Your Name]
[Course Name]
[Lab Partner Name]
[Date]

[Experiment Title]

Abstract
[Brief summary of the experiment, methods, results, and conclusions - 150-250 words]

Introduction
[Background information about the experiment, relevant theories, and objectives]

Materials and Methods
Materials:
• [Material 1]
• [Material 2]
• [Material 3]

Procedure:
1. [Step 1 of the procedure]
2. [Step 2 of the procedure]
3. [Step 3 of the procedure]
[Continue with numbered steps]

Results
[Present your data here, include tables, graphs, and observations]

Data Table:
[Variable 1] | [Variable 2] | [Variable 3]
-----------|------------|-----------
[Data 1]   | [Data 2]   | [Data 3]
[Data 4]   | [Data 5]   | [Data 6]

Discussion
[Interpret your results, explain their significance, compare with expected results]

Sources of Error:
• [Potential error 1]
• [Potential error 2]
• [Potential error 3]

Conclusion
[Summarize your findings and answer the research question]

References
[List your references in proper scientific format]`,
    tags: ['lab', 'report', 'science', 'research'],
    isBuiltIn: true,
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    description: 'Academic research paper template',
    category: 'Academic',
    content: `[Your Name]
[Institution]
[Course]
[Date]

[Research Paper Title]

Abstract
[Concise summary of your research (150-250 words) covering purpose, methods, results, and conclusions]

Keywords: [Keyword 1], [Keyword 2], [Keyword 3]

1. Introduction
1.1 Background
[Provide background information and context for your research]

1.2 Problem Statement
[Clearly state the research problem or question]

1.3 Research Objectives
[List your specific research objectives]

1.4 Significance
[Explain the importance and potential impact of your research]

2. Literature Review
[Review existing research relevant to your topic]

2.1 [Subtopic 1]
[Review literature related to first subtopic]

2.2 [Subtopic 2]
[Review literature related to second subtopic]

3. Methodology
3.1 Research Design
[Describe your overall research approach]

3.2 Data Collection
[Explain how you collected data]

3.3 Data Analysis
[Describe your analysis methods]

4. Results
[Present your findings without interpretation]

4.1 [Finding 1]
[Present first major finding]

4.2 [Finding 2]
[Present second major finding]

5. Discussion
[Interpret your results and discuss their implications]

6. Conclusion
[Summarize your research and its contributions]

7. References
[List all cited sources in proper format]

8. Appendices
[Include additional materials if needed]`,
    tags: ['research', 'paper', 'academic', 'scholarly'],
    isBuiltIn: true,
  },

  // Personal Templates
  {
    id: 'personal-resume',
    name: 'Professional Resume',
    description: 'Modern professional resume template',
    category: 'Personal',
    content: `[YOUR NAME]
[City, State] | [Phone] | [Email] | [LinkedIn Profile]

PROFESSIONAL SUMMARY
[Write 2-3 sentences highlighting your key qualifications, experience, and career goals]

WORK EXPERIENCE

[Job Title] | [Company Name] | [City, State]
[Month Year] – [Month Year]
• [Accomplishment or responsibility 1 - use action verbs]
• [Accomplishment or responsibility 2 - quantify when possible]
• [Accomplishment or responsibility 3 - show impact]

[Job Title] | [Company Name] | [City, State]
[Month Year] – [Month Year]
• [Accomplishment or responsibility 1]
• [Accomplishment or responsibility 2]
• [Accomplishment or responsibility 3]

EDUCATION

[Degree Name] | [University Name] | [City, State]
[Graduation Year]
• [GPA if 3.0 or higher]
• [Relevant coursework or achievements]
• [Honors or awards]

[Degree Name] | [University Name] | [City, State]
[Graduation Year]

SKILLS

Technical Skills:
• [Skill 1] - [Proficiency level]
• [Skill 2] - [Proficiency level]
• [Skill 3] - [Proficiency level]

Soft Skills:
• [Soft skill 1]
• [Soft skill 2]
• [Soft skill 3]

Languages:
• [Language 1] - [Fluency level]
• [Language 2] - [Fluency level]

CERTIFICATIONS & AWARDS
• [Certification/Award 1] - [Year]
• [Certification/Award 2] - [Year]

PROFESSIONAL DEVELOPMENT
• [Course/Workshop 1] - [Year]
• [Course/Workshop 2] - [Year]`,
    tags: ['resume', 'cv', 'personal', 'job', 'career'],
    isBuiltIn: true,
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    description: 'Professional job application cover letter',
    category: 'Personal',
    content: `[Your Name]
[Address]
[City, State ZIP]
[Email]
[Phone]
[LinkedIn Profile]

[Date]

[Hiring Manager Name] (if known, otherwise use title)
[Title]
[Company Name]
[Address]
[City, State ZIP]

Dear [Mr./Ms./Mx. Last Name],

I am writing to express my interest in the [Position Name] position at [Company Name]. With my [Number] years of experience in [Industry/Field], I am confident in my ability to contribute to your team's success.

In my current role as [Current Position] at [Current Company], I have [mention key achievement or responsibility]. This experience has prepared me well for the challenges and opportunities at [Company Name]. I am particularly drawn to your company because [mention something specific about the company].

My key qualifications include:
• [Key qualification 1 relevant to the position]
• [Key qualification 2 relevant to the position]
• [Key qualification 3 relevant to the position]

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application. I have attached my resume for your review and look forward to hearing from you.

Sincerely,
[Your Name]`,
    tags: ['cover-letter', 'job', 'application', 'personal'],
    isBuiltIn: true,
  },
  {
    id: 'personal-budget',
    name: 'Personal Budget',
    description: 'Monthly personal budget planner',
    category: 'Personal',
    content: `PERSONAL BUDGET - [Month Year]

INCOME
Primary Income: $[Amount]
Secondary Income: $[Amount]
Other Income: $[Amount]
TOTAL INCOME: $[Total Income]

EXPENSES

HOUSING
Rent/Mortgage: $[Amount]
Utilities: $[Amount]
Internet/Phone: $[Amount]
Household Supplies: $[Amount]

TRANSPORTATION
Car Payment: $[Amount]
Gas: $[Amount]
Insurance: $[Amount]
Maintenance: $[Amount]
Public Transit: $[Amount]

FOOD
Groceries: $[Amount]
Dining Out: $[Amount]
Coffee/Snacks: $[Amount]

PERSONAL
Healthcare: $[Amount]
Clothing: $[Amount]
Entertainment: $[Amount]
Subscriptions: $[Amount]
Personal Care: $[Amount]

SAVINGS & INVESTMENTS
Emergency Fund: $[Amount]
Retirement: $[Amount]
Investments: $[Amount]

DEBT PAYMENTS
Credit Cards: $[Amount]
Student Loans: $[Amount]
Other Loans: $[Amount]

TOTAL EXPENSES: $[Total Expenses]

NET INCOME: $[Total Income - Total Expenses]

BUDGET ANALYSIS
Amount Remaining: $[Net Income]
Savings Rate: [Percentage]%
Recommended Emergency Fund: [3-6 months expenses]
Current Emergency Fund: $[Current amount]

FINANCIAL GOALS
Short-term (1-3 months):
• [Goal 1] - $[Amount]
• [Goal 2] - $[Amount]

Medium-term (3-12 months):
• [Goal 1] - $[Amount]
• [Goal 2] - $[Amount]

Long-term (1+ years):
• [Goal 1] - $[Amount]
• [Goal 2] - $[Amount]`,
    tags: ['budget', 'finance', 'personal', 'planning'],
    isBuiltIn: true,
  },

  // Legal Templates
  {
    id: 'legal-contract',
    name: 'Simple Contract',
    description: 'Basic legal contract template',
    category: 'Legal',
    content: `SIMPLE CONTRACT AGREEMENT

This contract agreement is made and entered into on [Date]

BETWEEN:
[Party A Name]
[Party A Address]
[City, State ZIP]
(hereinafter "Party A")

AND:
[Party B Name]
[Party B Address]
[City, State ZIP]
(hereinafter "Party B")

ARTICLE 1 - PURPOSE
Party A agrees to [describe what Party A will provide/do] and Party B agrees to [describe what Party B will provide/do].

ARTICLE 2 - TERM
This agreement shall commence on [Start Date] and continue until [End Date] or until terminated by either party.

ARTICLE 3 - COMPENSATION
Party B shall pay Party A the sum of $[Amount] to be paid [Payment schedule - e.g., monthly, upon completion, etc.].

ARTICLE 4 - RESPONSIBILITIES
Party A Responsibilities:
• [Responsibility 1]
• [Responsibility 2]
• [Responsibility 3]

Party B Responsibilities:
• [Responsibility 1]
• [Responsibility 2]
• [Responsibility 3]

ARTICLE 5 - TERMINATION
Either party may terminate this agreement with [Number] days written notice.

ARTICLE 6 - CONFIDENTIALITY
Both parties agree to keep confidential all proprietary information shared during the course of this agreement.

ARTICLE 7 - GOVERNING LAW
This agreement shall be governed by the laws of [State/Country].

ARTICLE 8 - ENTIRE AGREEMENT
This document constitutes the entire agreement between the parties and supersedes all prior agreements.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

_________________________
Party A Signature
Date: _______________

_________________________
Party B Signature
Date: _______________

DISCLAIMER: This is a template only. Consult with a qualified attorney for legal advice.`,
    tags: ['contract', 'legal', 'agreement', 'formal'],
    isBuiltIn: true,
  },
  {
    id: 'rental-agreement',
    name: 'Rental Agreement',
    description: 'Residential rental lease agreement',
    category: 'Legal',
    content: `RESIDENTIAL RENTAL AGREEMENT

This rental agreement is made on [Date]

LANDLORD:
[Landlord Name]
[Landlord Address]
[City, State ZIP]
[Phone]
[Email]

TENANT:
[Tenant Name]
[Tenant Address]
[City, State ZIP]
[Phone]
[Email]

PREMISES
Landlord agrees to rent to Tenant and Tenant agrees to rent from Landlord the residential property located at:
[Rental Property Address]
[City, State ZIP]
(hereinafter "the Premises")

TERM
The lease term shall begin on [Start Date] and end on [End Date] (period of [Number] months).

RENT
Monthly rent: $[Amount]
Due date: [Day of month]
Late fee: $[Amount] after [Number] days grace period
Payment method: [Accepted payment methods]

SECURITY DEPOSIT
Security deposit: $[Amount]
Due: [Due date]
Refund: Within [Number] days of lease termination, less deductions for damages

UTILITIES
Tenant responsible for: [List utilities tenant pays]
Landlord responsible for: [List utilities landlord pays]

USE OF PREMISES
Premises shall be used for residential purposes only
Maximum occupants: [Number] persons
No illegal activities or business operations

MAINTENANCE AND REPAIRS
Tenant shall keep premises clean and in good condition
Tenant shall promptly report any needed repairs
Landlord shall maintain premises in habitable condition

PETS
[ ] Pets allowed with additional deposit of $[Amount]
[ ] No pets allowed

PARKING
[ ] Parking space included: [Location/Space number]
[ ] No parking included

TERMINATION
Either party may terminate with [Number] days written notice
Tenant shall vacate premises by termination date

GOVERNING LAW
This agreement shall be governed by the laws of [State]

SIGNATURES

_________________________
Landlord Signature
Date: _______________

_________________________
Tenant Signature
Date: _______________

DISCLAIMER: This is a template only. Consult with a qualified attorney for legal advice.`,
    tags: ['rental', 'lease', 'legal', 'housing'],
    isBuiltIn: true,
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    description: 'General power of attorney template',
    category: 'Legal',
    content: `GENERAL POWER OF ATTORNEY

I, [Your Name], residing at [Your Address], [City, State ZIP], hereby appoint [Agent Name], residing at [Agent Address], [City, State ZIP], as my true and lawful attorney-in-fact to act for me in the following matters:

FINANCIAL MATTERS
• To deposit and withdraw funds from my bank accounts
• To endorse checks, notes, and drafts payable to my order
• To buy, sell, and manage stocks, bonds, and securities
• To manage my real estate properties
• To prepare and file my tax returns
• To borrow money on my behalf
• To make charitable gifts from my assets

BUSINESS MATTERS
• To operate my business interests
• To enter into contracts on my behalf
• To hire employees and professionals
• To sue and defend lawsuits in my name

PERSONAL MATTERS
• To make healthcare decisions for me
• To access my medical records
• To make living arrangement decisions
• To handle insurance claims and benefits

LIMITATIONS
This power of attorney does not authorize my agent to:
• [List any specific limitations]
• [List any specific limitations]

EFFECTIVE DATE
This power of attorney shall become effective on [Date] and shall continue until revoked by me in writing.

REVOCATION
I reserve the right to revoke this power of attorney at any time by providing written notice to my agent.

GOVERNING LAW
This power of attorney shall be governed by the laws of [State].

IN WITNESS WHEREOF, I have executed this power of attorney on this [Day] day of [Month], [Year].

_________________________
[Your Signature]
[Your Printed Name]

STATE OF [State]
COUNTY OF [County]

On this [Day] day of [Month], [Year], before me personally appeared [Your Name], known to me to be the person whose name is subscribed to the within instrument, and acknowledged that they executed the same for the purposes therein contained.

_________________________
Notary Public
My commission expires: [Date]

DISCLAIMER: This is a template only. Consult with a qualified attorney for legal advice.`,
    tags: ['power-of-attorney', 'legal', 'financial', 'personal'],
    isBuiltIn: true,
  },
];

export function getCategories(): string[] {
  const categories = new Set(BUILT_IN_TEMPLATES.map(t => t.category));
  return Array.from(categories).sort();
}

export function searchTemplates(query: string): Template[] {
  if (!query) return BUILT_IN_TEMPLATES;
  
  const lowercaseQuery = query.toLowerCase();
  return BUILT_IN_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery) ||
    template.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function loadTemplate(id: string): Template | null {
  return BUILT_IN_TEMPLATES.find(template => template.id === id) || null;
}

export function getTemplateContent(id: string): string | null {
  const template = loadTemplate(id);
  return template?.content || null;
}

export function getTemplatesByCategory(category: string): Template[] {
  return BUILT_IN_TEMPLATES.filter(template => template.category === category);
}
