import { Template } from './api';

export interface TemplateData {
  id: string;
  title: string;
  description: string;
  previewImageUrl: string;
  category: string;
}

/**
 * Built-in templates data
 */
export const BUILT_IN_TEMPLATES: TemplateData[] = [
  {
    id: 'tpl-resume-1',
    title: 'Professional Resume',
    description: 'Clean, modern resume template perfect for job applications',
    previewImageUrl: '/placeholder.svg',
    category: 'Career',
  },
  {
    id: 'tpl-resume-2',
    title: 'Creative Resume',
    description: 'Stand out with this creative and unique resume design',
    previewImageUrl: '/placeholder.svg',
    category: 'Career',
  },
  {
    id: 'tpl-letter-1',
    title: 'Formal Letter',
    description: 'Professional business letter template',
    previewImageUrl: '/placeholder.svg',
    category: 'Letters',
  },
  {
    id: 'tpl-letter-2',
    title: 'Cover Letter',
    description: 'Compelling cover letter for job applications',
    previewImageUrl: '/placeholder.svg',
    category: 'Letters',
  },
  {
    id: 'tpl-report-1',
    title: 'Business Report',
    description: 'Comprehensive business report template',
    previewImageUrl: '/placeholder.svg',
    category: 'Reports',
  },
  {
    id: 'tpl-report-2',
    title: 'Project Status Report',
    description: 'Track and communicate project progress',
    previewImageUrl: '/placeholder.svg',
    category: 'Reports',
  },
  {
    id: 'tpl-proposal-1',
    title: 'Business Proposal',
    description: 'Win clients with this professional proposal template',
    previewImageUrl: '/placeholder.svg',
    category: 'Business',
  },
  {
    id: 'tpl-invoice-1',
    title: 'Invoice',
    description: 'Clean and professional invoice template',
    previewImageUrl: '/placeholder.svg',
    category: 'Business',
  },
  {
    id: 'tpl-meeting-1',
    title: 'Meeting Notes',
    description: 'Structured meeting notes template',
    previewImageUrl: '/placeholder.svg',
    category: 'Productivity',
  },
  {
    id: 'tpl-essay-1',
    title: 'Academic Essay',
    description: 'Properly formatted academic essay template',
    previewImageUrl: '/placeholder.svg',
    category: 'Academic',
  },
];

/**
 * Get templates grouped by category
 */
export function getTemplatesByCategory(): Record<string, TemplateData[]> {
  return BUILT_IN_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, TemplateData[]>);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(BUILT_IN_TEMPLATES.map((t) => t.category))];
}

/**
 * Search templates by query
 * @param query - Search query
 */
export function searchTemplates(query: string): TemplateData[] {
  const lowerQuery = query.toLowerCase();
  return BUILT_IN_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Load template and create new document
 * @param templateId - Template ID
 * @returns New document ID
 */
export async function loadTemplate(templateId: string): Promise<string> {
  try {
    const result = await Template.clone(templateId);
    return result.documentId;
  } catch (error) {
    console.error('[loadTemplate] Error:', error);
    throw error;
  }
}

/**
 * Upload user's template file
 * @param file - File to upload
 * @returns Created template data
 */
export async function uploadUserTemplate(
  file: File
): Promise<TemplateData> {
  console.log('[uploadUserTemplate] File:', file.name);
  
  // Placeholder - simulate upload
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: `user-${Date.now()}`,
    title: file.name.replace(/\.[^/.]+$/, ''),
    description: 'User uploaded template',
    previewImageUrl: '/placeholder.svg',
    category: 'My Templates',
  };
}

/**
 * Return HTML content for a built-in template id.
 * These HTML strings are intended to be used as TipTap content (simple HTML).
 */
export function getTemplateContent(templateId: string): string | undefined {
  const templates: Record<string, string> = {
    'tpl-resume-1': `
      <h1>John Doe</h1>
      <p><strong>Professional Summary</strong></p>
      <p>Experienced professional with a history of delivering results...</p>
      <h2>Experience</h2>
      <h3>Company Name — Senior Developer</h3>
      <p><em>2022 - Present</em></p>
      <ul>
        <li>Led important projects and improved performance by 30%.</li>
        <li>Mentored junior engineers and enforced best practices.</li>
      </ul>
      <h2>Education</h2>
      <p>B.Sc. in Computer Science</p>
    `,

    'tpl-resume-2': `
      <h1>Jane Smith</h1>
      <p><strong>Creative Profile</strong></p>
      <p>Creative designer focused on user-centered experiences...</p>
      <h2>Portfolio Highlights</h2>
      <ul>
        <li>Brand redesign for Acme Corp.</li>
        <li>Mobile app UI for Spark.</li>
      </ul>
    `,

    'tpl-letter-1': `
      <p>Sender Name</p>
      <p>Sender Address</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Recipient Name</p>
      <p>Recipient Address</p>
      <p>Dear Sir / Madam,</p>
      <p>I am writing to inform you...</p>
      <p>Sincerely,</p>
      <p>Sender Name</p>
    `,

    'tpl-letter-2': `
      <p>Dear Hiring Manager,</p>
      <p>I am excited to apply for the role of ...</p>
      <p>My background includes...</p>
      <p>Thank you for your consideration.</p>
      <p>Sincerely,</p>
      <p>Applicant Name</p>
    `,

    'tpl-report-1': `
      <h1>Business Report</h1>
      <p><strong>Executive Summary</strong></p>
      <p>Summary goes here...</p>
      <h2>Findings</h2>
      <ul>
        <li>Finding A</li>
        <li>Finding B</li>
      </ul>
    `,

    'tpl-report-2': `
      <h1>Project Status Report</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <h2>Overview</h2>
      <p>Current status of the project is...</p>
      <h2>Risks</h2>
      <ul>
        <li>Risk A</li>
      </ul>
    `,

    'tpl-proposal-1': `
      <h1>Business Proposal</h1>
      <p><strong>Introduction</strong></p>
      <p>Proposal overview...</p>
      <h2>Scope</h2>
      <p>Details about scope and deliverables.</p>
    `,

    'tpl-invoice-1': `
      <h1>Invoice</h1>
      <p><strong>Invoice #:</strong> INV-${Date.now()}</p>
      <p>Bill To: Client Name</p>
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody><tr><td>Service</td><td>1</td><td>$100</td></tr></tbody>
      </table>
      <p>Total: $100</p>
    `,

    'tpl-meeting-1': `
      <h1>Meeting Notes</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <h2>Attendees</h2>
      <ul><li>Person A</li><li>Person B</li></ul>
      <h2>Notes</h2>
      <p>Notes go here...</p>
    `,

    'tpl-essay-1': `
      <h1>Essay Title</h1>
      <p><strong>Introduction</strong></p>
      <p>Intro paragraph...</p>
      <h2>Body</h2>
      <p>Body paragraph...</p>
      <h2>Conclusion</h2>
      <p>Conclusion paragraph...</p>
    `,
  };

  return templates[templateId];
}
