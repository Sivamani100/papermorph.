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
  {
    id: 'business-letter',
    name: 'Business Letter',
    description: 'Professional business letter template',
    category: 'Business',
    content: `<p>Your Name<br/>Your Address<br/>City, State ZIP</p>
    <p>&nbsp;</p>
    <p>Date</p>
    <p>&nbsp;</p>
    <p>Recipient Name<br/>Company Name<br/>Address<br/>City, State ZIP</p>
    <p>&nbsp;</p>
    <p>Dear [Recipient Name],</p>
    <p>&nbsp;</p>
    <p>[Your message content here]</p>
    <p>&nbsp;</p>
    <p>Sincerely,<br/>[Your Name]</p>`,
    tags: ['letter', 'business', 'formal'],
    isBuiltIn: true,
  },
  {
    id: 'academic-essay',
    name: 'Academic Essay',
    description: 'Standard academic essay format',
    category: 'Academic',
    content: `<h1>Essay Title</h1>
    <h2>Introduction</h2>
    <p>Write your introduction here, including your thesis statement.</p>
    <h2>Body Paragraph 1</h2>
    <p>Write your first body paragraph here.</p>
    <h2>Body Paragraph 2</h2>
    <p>Write your second body paragraph here.</p>
    <h2>Conclusion</h2>
    <p>Write your conclusion here, summarizing your main points.</p>`,
    tags: ['essay', 'academic', 'school'],
    isBuiltIn: true,
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for taking meeting minutes',
    category: 'Business',
    content: `<h1>Meeting Notes</h1>
    <p><strong>Date:</strong> [Date]</p>
    <p><strong>Time:</strong> [Time]</p>
    <p><strong>Location:</strong> [Location]</p>
    <p><strong>Attendees:</strong> [List of attendees]</p>
    <h2>Agenda</h2>
    <ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
    <h2>Discussion</h2>
    <p>[Discussion points]</p>
    <h2>Action Items</h2>
    <ul><li>[Action item 1]</li><li>[Action item 2]</li></ul>
    <h2>Next Meeting</h2>
    <p>Date: [Next meeting date]</p>`,
    tags: ['meeting', 'notes', 'business'],
    isBuiltIn: true,
  },
  {
    id: 'personal-resume',
    name: 'Personal Resume',
    description: 'Professional resume template',
    category: 'Personal',
    content: `<h1>[Your Name]</h1>
    <p>[Address] | [Phone] | [Email]</p>
    <h2>Professional Summary</h2>
    <p>[Your professional summary]</p>
    <h2>Experience</h2>
    <h3>[Job Title] - [Company]</h3>
    <p>[Dates]</p>
    <ul><li>[Responsibility 1]</li><li>[Responsibility 2]</li></ul>
    <h2>Education</h2>
    <h3>[Degree] - [School]</h3>
    <p>[Graduation Year]</p>
    <h2>Skills</h2>
    <ul><li>[Skill 1]</li><li>[Skill 2]</li></ul>`,
    tags: ['resume', 'cv', 'personal', 'job'],
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
