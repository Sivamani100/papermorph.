import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from './TemplateCard';
import { ToolsPanel } from './ToolsPanel';
import OutlinePanel from './OutlinePanel';
import { useDocStore, type Document } from '@/state/useDocStore';
import { LEFT_SIDEBAR_TABS } from '@/constants';
import { useEditorStore } from '@/state/useEditorStore';
import { useUserStore } from '@/state/useUserStore';
import { useSidebarStore } from '@/state/useSidebarStore';
import {
  FileText,
  PenTool,
  Palette,
  Image,
  Bookmark,
  FolderOpen,
  Search,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Clock,
  Minus,
  ChevronDown,
  Type,
  Layers,
  Settings2,
  Copy,
  Share2,
  Eye,
  Lock,
  BarChart3,
  Wand2,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Star,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { BUILT_IN_TEMPLATES, searchTemplates, getTemplatesByCategory } from '@/utils/templateLoader';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  PenTool,
  Palette,
  Image,
  Bookmark,
  FolderOpen,
  Wand2,
};

export function SidebarLeft() {
  const { leftCollapsed, setLeftCollapsed } = useSidebarStore();
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, currentDocument, createDocumentWithContent, setCurrentDocument, updateDocument, deleteDocument } = useDocStore();
  const { editor } = useEditorStore();
  const { theme, colorTheme } = useUserStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'text-effects': true,
    'document-tools': false,
    'advanced-formatting': false,
    'document-stats': false,
    'outline': false,
    'bookmarks': false,
  });
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; name: string; pos: number }>>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pm:favorites') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  const addFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev : [id, ...prev].slice(0, 20);
      localStorage.setItem('pm:favorites', JSON.stringify(next));
      return next;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((fid) => fid !== id);
      localStorage.setItem('pm:favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = BUILT_IN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      createDocumentWithContent(template.name, template.content, template.id);
      toast.success(`Created document from "${template.name}" template`);
    }
  };

  const filteredTemplates = searchQuery ? searchTemplates(searchQuery) : BUILT_IN_TEMPLATES;
  const categories = ['Business', 'Academic', 'Personal', 'Legal'];

   const widthClass = leftCollapsed ? 'w-16' : 'w-[280px]';

  return (
    <div className={cn('flex flex-col transition-all duration-300 h-full relative', widthClass)} 
         style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b transition-all duration-200 backdrop-blur-xl"
           style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}>
        {!leftCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 bg-primary/20 border border-primary/30">
              <Layers className="h-4 w-4 transition-colors text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm transition-colors text-foreground">Workspace</span>
              <span className="text-xs transition-colors text-muted-foreground">Tools & Templates</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="h-8 w-8 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 hover:bg-primary/10 hover:text-primary border-border/50"
          title={leftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Floating Tabs for Collapsed State - Top Aligned */}
      {leftCollapsed && (
        <div className="flex flex-col items-center gap-2 p-3 pt-4 h-full overflow-y-auto">
          {LEFT_SIDEBAR_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.icon];
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 w-10 p-2 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-primary/20 text-primary border-primary/30' 
                    : 'hover:bg-primary/10 hover:text-primary border-border/50'
                }`}
                title={tab.label}
              >
                <Icon className="h-5 w-5" />
              </Button>
            );
          })}
        </div>
      )}

      {!leftCollapsed && (
        <>
          {/* Tab Navigation */}
          <div className={`flex p-4 gap-2 border-b transition-all duration-200 backdrop-blur-sm ${
            theme === 'dark' ? 'border-gray-800 bg-black/10' : 'border-gray-200 bg-white/5'
          }`}>
            {LEFT_SIDEBAR_TABS.map((tab) => {
              const Icon = ICON_MAP[tab.icon];
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 gap-2 h-10 p-2 transition-all duration-200 ${
                    activeTab === tab.id 
                      ? theme === 'dark' 
                        ? 'bg-primary/20 text-primary border-primary/30 backdrop-blur-sm' 
                        : 'bg-primary/10 text-primary border-primary/30 backdrop-blur-sm'
                      : theme === 'dark'
                        ? 'hover:bg-primary/10 hover:text-primary'
                        : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                  title={tab.label}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1 p-3 overflow-y-auto">
            {activeTab === 'templates' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors z-10 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-3 h-10 w-full text-sm transition-all duration-200 backdrop-blur-sm border rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/20' 
                        : 'bg-white/60 border-gray-200/50 placeholder-gray-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
                    }`}
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={`flex-1 gap-2 h-10 transition-all duration-200 backdrop-blur-sm border rounded-md text-sm ${
                      theme === 'dark' 
                        ? 'bg-primary/20 border-primary/30 text-primary hover:bg-primary/30 hover:border-primary/50' 
                        : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50'
                    }`}
                    onClick={() => createDocumentWithContent()}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">New</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`flex-1 gap-2 h-10 transition-all duration-200 backdrop-blur-sm border rounded-md text-sm ${
                      theme === 'dark' 
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50' 
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="font-medium">Import</span>
                  </Button>
                </div>

                {/* Template Categories */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        size="sm"
                        className={`h-8 text-xs justify-start transition-all duration-200 backdrop-blur-sm border rounded-md transform hover:scale-105 px-2 ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                            : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                        onClick={() => {
                          setSearchQuery(category);
                          setActiveTab('templates');
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    {searchQuery ? 'Search Results' : 'All Templates'}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {filteredTemplates.slice(0, 2).map((template) => (
                      <TemplateCard
                        key={template.id}
                        title={template.name}
                        description={template.description}
                        category={template.category}
                        onSelect={() => handleTemplateSelect(template.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-4">
                <ToolsPanel
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />
              </div>
            )}

            {activeTab === 'styles' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    Styles & Themes
                  </h4>
                  
                  <Collapsible open={expandedSections['text-effects']} onOpenChange={() => toggleSection('text-effects')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium">Text Effects</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 px-2">
                      {['Bold', 'Italic', 'Underline', 'Strikethrough'].map((effect) => (
                        <Button key={effect} variant="ghost" size="sm" className={`w-full justify-start text-sm h-8 transition-all duration-200 backdrop-blur-sm border ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                            : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}>
                          {effect}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={expandedSections['document-tools']} onOpenChange={() => toggleSection('document-tools')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium">Document Tools</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 px-2">
                      {['Page Setup', 'Margins', 'Orientation', 'Size'].map((tool) => (
                        <Button key={tool} variant="ghost" size="sm" className={`w-full justify-start text-sm h-8 transition-all duration-200 backdrop-blur-sm border ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                            : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}>
                          {tool}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    Images & Diagrams
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className={`w-full justify-start gap-3 h-10 transition-all duration-200 backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50'
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}>
                      <Upload className="h-4 w-4" />
                      <span className="font-medium">Upload Image</span>
                    </Button>
                    <Button variant="outline" size="sm" className={`w-full justify-start gap-3 h-10 transition-all duration-200 backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50'
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}>
                      <Image className="h-4 w-4" />
                      <span className="font-medium">Insert from URL</span>
                    </Button>
                    <Button variant="outline" size="sm" className={`w-full justify-start gap-3 h-10 transition-all duration-200 backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50'
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}>
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Create Chart</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'citations' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" />
                    Citations
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span className="font-medium">Add Citation</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors">
                      <Bookmark className="h-4 w-4" />
                      <span className="font-medium">Bibliography</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" />
                    Advanced Tools
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors">
                      <Wand2 className="h-4 w-4" />
                      <span className="font-medium">AI Assistant</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors">
                      <Settings2 className="h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" />
                    My Documents
                  </h4>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group transition-all duration-200 border border-transparent hover:border-border/50"
                      >
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(doc.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-100 hover:text-yellow-600">
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-red-100 hover:text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
}
