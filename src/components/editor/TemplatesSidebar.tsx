import React, { useState } from 'react';
import { 
  FileText, 
  Tag, 
  MessageSquare, 
  Link, 
  Table, 
  Image, 
  Bookmark,
  Search,
  Upload,
  Star,
  ChevronLeft
} from 'lucide-react';

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  isFavorite?: boolean;
}

interface TemplatesSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectTemplate: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: '1',
    category: 'CAREER',
    title: 'Professional Resume',
    description: 'Clean, modern resume template perfect for job applications',
    isFavorite: false,
  },
  {
    id: '2',
    category: 'CAREER',
    title: 'Cover Letter',
    description: 'Professional cover letter template',
    isFavorite: false,
  },
  {
    id: '3',
    category: 'BUSINESS',
    title: 'Business Proposal',
    description: 'Formal business proposal template',
    isFavorite: false,
  },
];

const quickActions = [
  { icon: FileText, label: 'New Document' },
  { icon: Tag, label: 'Tags' },
  { icon: MessageSquare, label: 'Comments' },
  { icon: Link, label: 'Links' },
  { icon: Table, label: 'Tables' },
  { icon: Image, label: 'Images' },
  { icon: Bookmark, label: 'Bookmarks' },
];

const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  if (isCollapsed) {
    return (
      <aside className="templates-sidebar templates-sidebar-collapsed">
        <button className="sidebar-toggle-btn" onClick={onToggleCollapse}>
          <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="templates-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Templates</h2>
        <button className="sidebar-toggle-btn" onClick={onToggleCollapse}>
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button key={index} className="quick-action-btn" title={action.label}>
            <action.icon size={16} />
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Upload Template */}
      <button className="upload-template-btn">
        <Upload size={16} />
        <span>Upload Template</span>
      </button>

      {/* Template Categories */}
      <div className="templates-list">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="template-category">
            <h3 className="category-title">{category}</h3>
            <div className="category-templates">
              {categoryTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className="template-card"
                  onClick={() => onSelectTemplate(template)}
                >
                  <button 
                    className="template-favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle favorite
                    }}
                  >
                    <Star size={16} />
                  </button>
                  <div className="template-preview">
                    <FileText size={32} />
                    <span>Preview</span>
                  </div>
                  <div className="template-info">
                    <span className="template-category-badge">{template.category}</span>
                    <h4 className="template-title">{template.title}</h4>
                    <p className="template-description">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default TemplatesSidebar;
