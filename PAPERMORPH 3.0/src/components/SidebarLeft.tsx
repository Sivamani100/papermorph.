import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from './TemplateCard';
import { ToolsPanel } from './ToolsPanel';
import OutlinePanel from './OutlinePanel';
import ImageCropper from './ImageCropper';
import TemplateImportDialog from './TemplateImportDialog';
import { useDocStore, type Document } from '@/state/useDocStore';
import {
  BUILT_IN_TEMPLATES,
  getCategories,
  searchTemplates,
  loadTemplate,
  getTemplateContent,
} from '@/utils/templateLoader';
import { LEFT_SIDEBAR_TABS } from '@/constants';
import { useEditorStore } from '@/state/useEditorStore';
import {
  FileText,
  PenTool,
  Palette,
  Table,
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
import { toast } from '@/components/ui/use-toast';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  PenTool,
  Palette,
  Table,
  Image,
  Bookmark,
  FolderOpen,
  Wand2,
};

export function SidebarLeft() {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, currentDocument, createDocumentWithContent, setCurrentDocument, updateDocument, deleteDocument } = useDocStore();
  const { editor } = useEditorStore();

  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);
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
      try { localStorage.setItem('pm:favorites', JSON.stringify(next)); } catch {}
      toast({ title: 'Favorite updated' });
      return next;
    });
  };
  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      try { localStorage.setItem('pm:favorites', JSON.stringify(next)); } catch {}
      toast({ title: 'Favorite removed' });
      return next;
    });
  };
  const isFavorite = (id: string) => favorites.includes(id);
  const [stockQuery, setStockQuery] = useState('office');
  const [stockResults, setStockResults] = useState<string[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);
  const [templatePreviewHtml, setTemplatePreviewHtml] = useState<string | null>(null);
  const [templatePreviewId, setTemplatePreviewId] = useState<string | null>(null);

  const createNewDocument = () => {
    createDocumentWithContent('Untitled Document', '<p>Start typing...</p>', '');
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTemplateSelect = async (templateId: string) => {
    // Instead of applying immediately, open a preview dialog
    const html = getTemplateContent(templateId);
    setTemplatePreviewHtml(html || null);
    setTemplatePreviewId(templateId);
    setTemplatePreviewOpen(true);
  };

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : BUILT_IN_TEMPLATES;

  const categories = getCategories();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="template-upload"
                accept=".html,.htm"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    createDocumentWithContent(file.name.replace(/\.[^/.]+$/, ''), text, 'uploaded');
                    toast({ title: 'Template uploaded', description: `Created document from ${file.name}` });
                    (e.target as HTMLInputElement).value = '';
                  } catch (err) {
                    console.error('Template upload failed', err);
                    toast({ title: 'Upload failed', description: 'Could not read template file.' });
                  }
                }}
                className="hidden"
              />
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => document.getElementById('template-upload')?.click()}>
                <Upload className="h-4 w-4" />
                Upload Template
              </Button>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="p-2 bg-muted rounded-lg">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Favorites</h4>
                <div className="grid grid-cols-2 gap-2">
                  {favorites.map((id) => {
                    const tpl = BUILT_IN_TEMPLATES.find(t => t.id === id);
                    if (!tpl) return null;
                    return (
                      <div key={id} className="relative group">
                        <TemplateCard {...tpl} onSelect={() => handleTemplateSelect(tpl.id)} />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="absolute top-2 right-2"
                          onClick={(e) => { e.stopPropagation(); removeFavorite(id); }}
                        >
                          <Star className="h-4 w-4 text-amber-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Templates Grid */}
            <div className="space-y-6">
              {searchQuery ? (
                <div className="grid grid-cols-1 gap-3">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="relative group">
                      <TemplateCard
                        {...template}
                        onSelect={() => handleTemplateSelect(template.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2 opacity-80"
                        onClick={(e) => { e.stopPropagation(); isFavorite(template.id) ? removeFavorite(template.id) : addFavorite(template.id); }}
                        title={isFavorite(template.id) ? 'Remove favorite' : 'Add to favorites'}
                      >
                        <Star className={cn('h-4 w-4', isFavorite(template.id) ? 'text-amber-500' : 'text-muted-foreground')} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {BUILT_IN_TEMPLATES.filter((t) => t.category === category)
                        .slice(0, 2)
                        .map((template) => (
                          <div key={template.id} className="relative group">
                            <TemplateCard
                              {...template}
                              onSelect={() => handleTemplateSelect(template.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="absolute top-2 right-2 opacity-80"
                              onClick={(e) => { e.stopPropagation(); isFavorite(template.id) ? removeFavorite(template.id) : addFavorite(template.id); }}
                              title={isFavorite(template.id) ? 'Remove favorite' : 'Add to favorites'}
                            >
                              <Star className={cn('h-4 w-4', isFavorite(template.id) ? 'text-amber-500' : 'text-muted-foreground')} />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="p-4 space-y-4">
            <Button
              variant="default"
              className="w-full justify-start gap-2"
              onClick={createNewDocument}
            >
              <Plus className="h-4 w-4" />
              New Document
            </Button>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Documents
              </h3>
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setCurrentDocument(doc)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); const favId = `doc:${doc.id}`; isFavorite(favId) ? removeFavorite(favId) : addFavorite(favId); }} title={isFavorite(`doc:${doc.id}`) ? 'Remove favorite' : 'Add to favorites'}>
                        <Star className={cn('h-3 w-3', isFavorite(`doc:${doc.id}`) ? 'text-amber-500' : 'text-muted-foreground')} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'tools':
        return <ToolsPanel />;

      case 'styles':
        const applyTheme = (themeName: string) => {
          if (!editor) {
            toast({ title: 'Editor not ready', description: 'The editor is not initialized yet.' });
            return;
          }

          const themes: Record<string, { fontFamily: string; fontSize: string; lineHeight: number; color: string; heading1: any; heading2: any }> = {
            Professional: {
              fontFamily: 'Calibri, Segoe UI, sans-serif',
              fontSize: '12pt',
              lineHeight: 1.5,
              color: '#1f2937',
              heading1: { fontSize: '28pt', fontWeight: 'bold', color: '#111827', marginBottom: '12pt' },
              heading2: { fontSize: '18pt', fontWeight: 'bold', color: '#374151', marginBottom: '8pt' }
            },
            Modern: {
              fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#2d3748',
              heading1: { fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' },
              heading2: { fontSize: '20px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }
            },
            Classic: {
              fontFamily: 'Georgia, serif',
              fontSize: '12pt',
              lineHeight: 1.6,
              color: '#3e3e3e',
              heading1: { fontSize: '26pt', fontWeight: 'bold', color: '#000000', marginBottom: '12pt' },
              heading2: { fontSize: '16pt', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8pt' }
            },
            Minimal: {
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: '11pt',
              lineHeight: 1.4,
              color: '#4a4a4a',
              heading1: { fontSize: '18pt', fontWeight: 'bold', color: '#000000', marginBottom: '8pt' },
              heading2: { fontSize: '13pt', fontWeight: 'bold', color: '#333333', marginBottom: '6pt' }
            },
            Academic: {
              fontFamily: 'Times New Roman, Times, serif',
              fontSize: '12pt',
              lineHeight: 2,
              color: '#2c3e50',
              heading1: { fontSize: '24pt', fontWeight: 'bold', color: '#000000', marginBottom: '12pt' },
              heading2: { fontSize: '14pt', fontWeight: 'bold', color: '#34495e', marginBottom: '10pt' }
            }
          };

          const theme = themes[themeName];
          if (!theme) return;

          try {
            // Update all paragraphs
            editor.chain().focus()
              .updateAttributes('paragraph', {
                fontSize: theme.fontSize,
                fontFamily: theme.fontFamily,
                lineHeight: theme.lineHeight,
                color: theme.color
              }).run();

            // Update headings
            editor.chain().focus()
              .updateAttributes('heading', {
                fontSize: theme.heading1.fontSize,
                fontWeight: theme.heading1.fontWeight,
                color: theme.heading1.color
              }).run();

            toast({ title: `Applied "${themeName}" theme`, description: 'Theme applied to document.' });
          } catch (e) {
            console.error('Apply theme failed:', e);
            toast({ title: 'Failed to apply theme', description: 'Could not apply the selected theme.' });
          }
        };

        return (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Choose a theme to apply styles to your document
              </p>

              {[
                { name: 'Professional', desc: 'Calibri, formal style', icon: '📊' },
                { name: 'Modern', desc: 'Contemporary design', icon: '✨' },
                { name: 'Classic', desc: 'Traditional serif', icon: '📖' },
                { name: 'Minimal', desc: 'Clean & simple', icon: '◻️' },
                { name: 'Academic', desc: 'Times New Roman', icon: '🎓' }
              ].map(({ name, desc, icon }) => (
                <Button
                  key={name}
                  variant="outline"
                  className="w-full justify-start gap-2 h-10 hover:bg-primary/5"
                  onClick={() => applyTheme(name)}
                >
                  <span className="text-lg">{icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-medium">{name}</div>
                    <div className="text-[10px] text-muted-foreground">{desc}</div>
                  </div>
                </Button>
              ))}

              <Separator className="my-2" />

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  <strong>💡 Tip:</strong> Themes update fonts, sizes, and colors throughout your document instantly.
                </p>
              </div>
            </div>
          </ScrollArea>
        );

      case 'tables':
        return (
          <div className="p-4 space-y-4">
            {/* Insert Table Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground">Insert Table</h4>
              <div className="grid grid-cols-5 gap-1 p-2 bg-muted rounded-lg">
                {Array.from({ length: 25 }).map((_, i) => {
                  const r = Math.floor(i / 5) + 1;
                  const c = (i % 5) + 1;
                  const active = r <= hoverRows && c <= hoverCols;
                  return (
                    <button
                      key={i}
                      onMouseEnter={() => { setHoverRows(r); setHoverCols(c); }}
                      onMouseLeave={() => { setHoverRows(0); setHoverCols(0); }}
                      onClick={() => {
                        try {
                          editor?.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run();
                        } catch (e) {
                          console.error('Insert table failed', e);
                        }
                      }}
                      className={cn(
                        'w-6 h-6 border rounded transition-colors',
                        active ? 'bg-primary/60 border-primary' : 'border-border hover:bg-primary/20 hover:border-primary'
                      )}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-center text-muted-foreground">Select size & click to insert</p>
            </div>

            <Separator />

            {/* Table Editing Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-foreground">Edit Table</h4>

              {/* Columns */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Columns</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => {
                      try {
                        editor?.chain().focus().addColumnBefore().run();
                      } catch (e) {
                        console.error('Add column before failed', e);
                      }
                    }}
                    title="Add column before current"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Before
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => {
                      try {
                        editor?.chain().focus().addColumnAfter().run();
                      } catch (e) {
                        console.error('Add column after failed', e);
                      }
                    }}
                    title="Add column after current"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    After
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      try {
                        editor?.chain().focus().deleteColumn().run();
                      } catch (e) {
                        console.error('Delete column failed', e);
                      }
                    }}
                    title="Delete current column"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Rows</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => {
                      try {
                        editor?.chain().focus().addRowBefore().run();
                      } catch (e) {
                        console.error('Add row before failed', e);
                      }
                    }}
                    title="Add row before current"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Before
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => {
                      try {
                        editor?.chain().focus().addRowAfter().run();
                      } catch (e) {
                        console.error('Add row after failed', e);
                      }
                    }}
                    title="Add row after current"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    After
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      try {
                        editor?.chain().focus().deleteRow().run();
                      } catch (e) {
                        console.error('Delete row failed', e);
                      }
                    }}
                    title="Delete current row"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Cell Styling */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Cell Background</label>
                <Input
                  type="color"
                  defaultValue="#FFFFFF"
                  onChange={(e) => {
                    try {
                      editor?.chain().focus().updateAttributes('tableCell', { background: e.target.value }).run();
                    } catch (err) {
                      console.error('Set cell background failed', err);
                    }
                  }}
                  className="w-full h-8 cursor-pointer"
                />
                <div className="flex gap-1">
                  {['#FFFFFF', '#F8FAFC', '#FEF3C7', '#FEE2E2', '#E0F2FE', '#E9D5FF'].map(c => (
                    <button
                      key={c}
                      className="flex-1 h-6 rounded border border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: c }}
                      onClick={() => {
                        try {
                          editor?.chain().focus().updateAttributes('tableCell', { background: c }).run();
                        } catch (err) {
                          console.error('Set cell background failed', err);
                        }
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Delete Table */}
              <Button
                variant="destructive"
                size="sm"
                className="w-full text-xs h-8"
                onClick={() => {
                  try {
                    if (confirm('Delete this table? This action cannot be undone.')) {
                      editor?.chain().focus().deleteTable().run();
                    }
                  } catch (e) {
                    console.error('Delete table failed', e);
                  }
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete Table
              </Button>
            </div>
          </div>
        );

      case 'images':
        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (!files || !editor) return;
                Array.from(files).forEach((file) => {
                  if (!file.type.startsWith('image/')) {
                    toast({ title: 'Invalid file type', description: 'Please select image files only.' });
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const url = event.target?.result as string;
                      // open cropper with the uploaded image first
                      setCropperSrc(url);
                      setCropperOpen(true);
                    } catch (error) {
                      console.error('Failed to prepare image for cropping:', error);
                      toast({ title: 'Insert image failed', description: 'Could not prepare the selected image.' });
                    }
                  };
                  reader.readAsDataURL(file);
                });
        };

        return (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Insert and manage images in your document
              </p>

              {/* Upload Image */}
              <div>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
              </div>

              {/* Stock Images (demo using picsum.photos) */}
              <div className="space-y-2 mt-3">
                <label className="text-xs font-semibold text-foreground">Stock Images</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by author (demo)"
                    value={stockQuery}
                    onChange={(e) => setStockQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        setStockLoading(true);
                        const res = await fetch(`https://picsum.photos/v2/list?page=1&limit=40`);
                        const json = await res.json();
                        // filter by author if query provided
                        const filtered = stockQuery.trim()
                          ? json.filter((i: any) => i.author.toLowerCase().includes(stockQuery.toLowerCase()))
                          : json;
                        setStockResults(filtered.map((i: any) => i.id.toString()));
                        setStockLoading(false);
                        toast({ title: 'Stock images loaded', description: `Found ${filtered.length} images (demo provider)` });
                      } catch (err) {
                        console.error('Load stock images failed', err);
                        setStockLoading(false);
                        toast({ title: 'Failed to load images', description: 'Could not fetch stock images.' });
                      }
                    }}
                  >
                    {stockLoading ? 'Loading...' : 'Load'}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                    {stockResults.slice(0, 18).map((id) => (
                    <button key={id} className="rounded overflow-hidden" onClick={async () => {
                      try {
                        const url = `https://picsum.photos/id/${id}/1200/800`;
                        // open cropper with remote image
                        setCropperSrc(url);
                        setCropperOpen(true);
                      } catch (e) {
                        console.error('Insert stock image failed', e);
                        toast({ title: 'Insert failed', description: 'Could not insert selected image.' });
                      }
                    }}>
                      <img src={`https://picsum.photos/id/${id}/300/200`} alt={`stock-${id}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Image Size</label>
                <div className="flex gap-1">
                  {['25%', '50%', '75%', '100%'].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => {
                        try {
                          editor?.chain().focus().setImageSize({ width: size }).run();
                        } catch (e) {
                          console.error('Set image size failed:', e);
                        }
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Image Alignment */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Alignment</label>
                <div className="flex gap-1">
                  {[
                    { align: 'left', label: '⬅️' },
                    { align: 'center', label: '⬆️⬇️' },
                    { align: 'right', label: '➡️' }
                  ].map(({ align, label }) => (
                    <Button
                      key={align}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-sm h-8"
                      onClick={() => {
                        try {
                          editor?.chain().focus().setImageAlignment(align as any).run();
                        } catch (e) {
                          console.error('Set image alignment failed:', e);
                        }
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Image Actions */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-8"
                onClick={() => {
                  try {
                    editor?.chain().focus().deleteImage().run();
                  } catch (e) {
                    console.error('Delete image failed:', e);
                  }
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete Selected Image
              </Button>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  <strong>💡 Tips:</strong> Click on images in the document to select them, then use alignment and size options to adjust. Supported: JPG, PNG, GIF, WebP.
                </p>
              </div>
            </div>
          </ScrollArea>
        );

      case 'citations':
        const [citations, setCitations] = useState<Array<{ id: string; author: string; title: string; year: string; url?: string; style: 'APA' | 'MLA' | 'Chicago' }>>([]);
        const [showCitationDialog, setShowCitationDialog] = useState(false);
        const [citationForm, setCitationForm] = useState({ author: '', title: '', year: '', url: '', style: 'APA' as const });

        const addCitation = () => {
          if (!citationForm.author.trim() || !citationForm.title.trim() || !citationForm.year.trim()) {
            toast({ title: 'Missing fields', description: 'Please fill in author, title, and year.' });
            return;
          }
          const newCitation = {
            id: `cit_${Date.now()}`,
            ...citationForm
          };
          setCitations([...citations, newCitation]);
          setCitationForm({ author: '', title: '', year: '', url: '', style: 'APA' });
          setShowCitationDialog(false);
          toast({ title: 'Citation added', description: `${citationForm.author} (${citationForm.year})` });
        };

        const deleteCitation = (id: string) => {
          setCitations(citations.filter(c => c.id !== id));
          toast({ title: 'Citation removed' });
        };

        const formatCitation = (citation: any, style: string) => {
          const { author, title, year, url } = citation;
          switch (style) {
            case 'APA':
              return `${author} (${year}). ${title}${url ? '. Retrieved from ' + url : ''}`;
            case 'MLA':
              return `${author}. "${title}." ${year}${url ? ', ' + url : ''}`;
            case 'Chicago':
              return `${author}. "${title}." Accessed ${year}${url ? '. ' + url : ''}`;
            default:
              return title;
          }
        };

        const generateBibliography = () => {
          if (citations.length === 0) {
            toast({ title: 'No citations', description: 'Add citations before generating bibliography.' });
            return;
          }
          const bibContent = `<h2>Bibliography</h2><ol>${citations.map(c => `<li>${formatCitation(c, c.style)}</li>`).join('')}</ol>`;
          try {
            editor?.chain().focus().insertContent(bibContent).run();
            toast({ title: 'Bibliography inserted', description: `Inserted ${citations.length} citations.` });
          } catch (e) {
            console.error('Insert bibliography failed:', e);
          }
        };

        return (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Manage citations and generate bibliography
              </p>

              {/* Citation Style Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Citation Style</label>
                <select
                  value={citationForm.style}
                  onChange={(e) => setCitationForm({ ...citationForm, style: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background"
                >
                  <option>APA</option>
                  <option>MLA</option>
                  <option>Chicago</option>
                </select>
              </div>

              {/* Add Citation Button */}
              {showCitationDialog ? (
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  <input
                    type="text"
                    placeholder="Author name"
                    value={citationForm.author}
                    onChange={(e) => setCitationForm({ ...citationForm, author: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={citationForm.title}
                    onChange={(e) => setCitationForm({ ...citationForm, title: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={citationForm.year}
                    onChange={(e) => setCitationForm({ ...citationForm, year: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background"
                  />
                  <input
                    type="text"
                    placeholder="URL (optional)"
                    value={citationForm.url}
                    onChange={(e) => setCitationForm({ ...citationForm, url: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs h-8" onClick={addCitation}>
                      Add
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => setShowCitationDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowCitationDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Citation
                </Button>
              )}

              <Separator className="my-2" />

              {/* Citations List */}
              {citations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground">Citations ({citations.length})</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {citations.map((citation) => (
                      <div key={citation.id} className="p-2 bg-muted rounded-lg text-xs">
                        <div className="font-medium truncate">{citation.author} ({citation.year})</div>
                        <div className="text-muted-foreground truncate">{citation.title}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs mt-1 w-full justify-start text-destructive"
                          onClick={() => deleteCitation(citation.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Bibliography */}
              <Button
                className="w-full"
                onClick={generateBibliography}
                disabled={citations.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Generate Bibliography
              </Button>

              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                  <strong>💡 Tip:</strong> Add citations and click "Generate Bibliography" to insert a formatted bibliography at the end of your document.
                </p>
              </div>
            </div>
          </ScrollArea>
        );

      case 'advanced':
        return (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {/* Text Effects Section */}
              <Collapsible
                open={expandedSections['text-effects']}
                onOpenChange={() => toggleSection('text-effects')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-9 hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Text Effects</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSections['text-effects'] && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-2 mt-2 border-l-2 border-purple-500/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => editor?.chain().focus().toggleSubscript().run()}
                  >
                    <span className="text-[10px]">H</span>
                    <span className="text-[7px] align-sub">2</span>O
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                  >
                    <span className="text-[10px]">E=mc</span>
                    <span className="text-[7px] align-super">2</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => editor?.chain().focus().toggleSmallCaps().run()}
                  >
                    Small Caps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => editor?.chain().focus().clearNodes().run()}
                  >
                    Clear Formatting
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-2" />

              {/* Advanced Formatting Section */}
              <Collapsible
                open={expandedSections['advanced-formatting']}
                onOpenChange={() => toggleSection('advanced-formatting')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-9 hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Advanced Formatting</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSections['advanced-formatting'] && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-2 mt-2 border-l-2 border-blue-500/30">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Letter Spacing</label>
                    <Input
                      type="range"
                      min="-2"
                      max="10"
                      step="0.5"
                      className="h-1.5"
                      onChange={(e) => {
                        const spacing = `${e.target.value}px`;
                        editor?.chain().focus().updateAttributes('paragraph', { letterSpacing: spacing }).run();
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Line Height</label>
                    <div className="flex gap-1">
                      {[1, 1.5, 2].map((val) => (
                        <Button
                          key={val}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => {
                            editor?.chain().focus().setLineHeight(val).run();
                          }}
                        >
                          {val}x
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                  >
                    <Type className="h-3 w-3 mr-1" />
                    Code Block
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-2" />

              {/* Document Tools Section */}
              <Collapsible
                open={expandedSections['document-tools']}
                onOpenChange={() => toggleSection('document-tools')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-9 hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Document Tools</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSections['document-tools'] && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-2 mt-2 border-l-2 border-green-500/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => {
                      if (currentDocument) {
                        const html = editor?.getHTML() || '';
                        navigator.clipboard.writeText(html);
                      }
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy as HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share Document
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => editor?.chain().focus().selectAll().run()}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview Mode
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-2" />

              {/* Document Stats Section */}
              <Collapsible
                open={expandedSections['document-stats']}
                onOpenChange={() => toggleSection('document-stats')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-9 hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Document Stats</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSections['document-stats'] && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pl-2 mt-2 border-l-2 border-orange-500/30">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted rounded p-2">
                      <p className="text-xs text-muted-foreground">Words</p>
                      <p className="text-lg font-semibold text-foreground">
                        {editor?.storage.characterCount?.words() || 0}
                      </p>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <p className="text-xs text-muted-foreground">Characters</p>
                      <p className="text-lg font-semibold text-foreground">
                        {editor?.storage.characterCount?.characters() || 0}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <p className="text-xs text-muted-foreground">Reading Time</p>
                    <p className="text-sm font-medium text-foreground">
                      {Math.ceil((editor?.storage.characterCount?.words() || 0) / 200)} min
                    </p>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-foreground">
                      {currentDocument?.createdAt ? new Date(currentDocument.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-2" />

              {/* Outline/TOC Section */}
              <Collapsible
                open={expandedSections['outline']}
                onOpenChange={() => toggleSection('outline')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-9 hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium">Outline</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSections['outline'] && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-2 mt-2 border-l-2 border-indigo-500/30">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-start text-xs h-8"
                        onClick={() => {
                          try {
                            const headings: Array<{ text?: string; level?: number; pos?: number }> = [];
                            if (!editor) return;
                            (editor as any).state.doc.descendants((node: any, pos: number) => {
                              if (node.type?.name === 'heading') {
                                const text = node.textContent || (node.content?.[0]?.text) || '';
                                const level = node.attrs?.level || 1;
                                headings.push({ text, level, pos });
                              }
                            });
                            if (headings.length === 0) {
                              toast({ title: 'No headings', description: 'Add headings (H1/H2...) to generate a TOC.' });
                              return;
                            }
                            const toc = `<h2>Table of Contents</h2><ol>${headings.map((h) => `<li>${h.text || 'Heading'}</li>`).join('')}</ol>`;
                            editor.chain().focus().insertContent(toc).run();
                            toast({ title: 'TOC inserted', description: `Inserted ${headings.length} entries.` });
                          } catch (e) {
                            console.error('Generate TOC failed:', e);
                            toast({ title: 'TOC failed', description: 'Could not generate Table of Contents.' });
                          }
                        }}
                      >
                        <Bookmark className="h-3 w-3 mr-1" />
                        Generate TOC
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-start text-xs h-8"
                        onClick={() => {
                          try {
                            editor?.chain().focus().insertContent('<h1>New Section</h1><p>Content goes here...</p>').run();
                            toast({ title: 'Section added' });
                          } catch (e) {
                            console.error('Insert section failed:', e);
                          }
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Insert Section
                      </Button>
                    </div>

                    <div>
                      {/* Live Outline list component */}
                      <div className="mt-2">
                        {/* lazy load the outline panel when editor is available */}
                        {editor ? (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore - dynamic import avoided for simplicity
                          <OutlinePanel editor={editor} />
                        ) : (
                          <div className="text-xs text-muted-foreground">Editor not initialized</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-2" />

              {/* Bookmarks Section */}
              <Collapsible
                open={expandedSections['bookmarks']}
                onOpenChange={() => toggleSection('bookmarks')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 h-9 hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium">Bookmarks</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSections['bookmarks'] && 'rotate-180'
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-2 mt-2 border-l-2 border-rose-500/30">
                  <p className="text-xs text-muted-foreground">Mark important sections for quick navigation</p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Bookmark name" className="flex-1" id="bookmark-name-input" />
                      <Button
                        size="sm"
                        onClick={() => {
                          const nameInput = (document.getElementById('bookmark-name-input') as HTMLInputElement);
                          const name = nameInput?.value?.trim() || `Bookmark ${bookmarks.length + 1}`;
                          if (!editor) return;
                          try {
                            const pos = (editor as any).state.selection.from as number;
                            const id = `bookmark-${Date.now()}`;
                            // insert a zero-width span with data-bookmark-id so it persists visually
                            editor.chain().focus().insertContent(`<span data-bookmark-id="${id}" style="display:none"></span>`).run();
                            setBookmarks([...bookmarks, { id, name, pos }]);
                            if (nameInput) nameInput.value = '';
                            toast({ title: 'Bookmark added', description: name });
                          } catch (e) {
                            console.error('Add bookmark failed:', e);
                          }
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>

                    {bookmarks.length > 0 && (
                      <div className="space-y-1">
                        {bookmarks.map((b) => (
                          <div key={b.id} className="flex items-center gap-2">
                            <button className="text-sm text-left flex-1" onClick={() => editor?.chain().focus().setTextSelection(b.pos).run()}>{b.name}</button>
                            <Button variant="ghost" size="icon-sm" onClick={() => setBookmarks(bookmarks.filter(x => x.id !== b.id))}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-2" />
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Pro Tip</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl+Enter</kbd> to insert a page break.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      default:
        return null;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-14 border-r border-border bg-sidebar flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="m-2"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-1 py-2">
          {LEFT_SIDEBAR_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.icon];
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCollapsed(false);
                }}
                title={tab.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-border bg-sidebar flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">
          {LEFT_SIDEBAR_TABS.find((t) => t.id === activeTab)?.label}
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto p-2 gap-1 border-b border-border scrollbar-thin">
        {LEFT_SIDEBAR_TABS.map((tab) => {
          const Icon = ICON_MAP[tab.icon];
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'shrink-0',
                activeTab === tab.id && 'bg-secondary'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">{renderTabContent()}</ScrollArea>

      {/* Image cropper dialog */}
      <ImageCropper
        src={cropperSrc}
        open={cropperOpen}
        onCancel={() => { setCropperOpen(false); setCropperSrc(null); }}
        onCrop={(dataUrl) => {
          try {
            editor?.chain().focus().setImage({ src: dataUrl }).run();
            toast({ title: 'Image inserted', description: 'Cropped image inserted into document.' });
          } catch (e) {
            console.error('Insert cropped image failed', e);
            toast({ title: 'Insert failed', description: 'Could not insert cropped image.' });
          }
          setCropperOpen(false);
          setCropperSrc(null);
        }}
      />

      {/* Template preview/import dialog */}
      <TemplateImportDialog
        open={templatePreviewOpen}
        html={templatePreviewHtml}
        title={templatePreviewId ? `Preview: ${templatePreviewId}` : 'Template Preview'}
        onClose={() => { setTemplatePreviewOpen(false); setTemplatePreviewHtml(null); setTemplatePreviewId(null); }}
        onImportNew={() => {
          if (templatePreviewHtml) {
            createDocumentWithContent('Imported Template', templatePreviewHtml, templatePreviewId || 'imported');
            toast({ title: 'Template imported', description: 'Created new document from template.' });
          }
          setTemplatePreviewOpen(false);
        }}
        onReplaceCurrent={() => {
          if (templatePreviewHtml) {
            if (!currentDocument) {
              createDocumentWithContent('Imported Template', templatePreviewHtml, templatePreviewId || 'imported');
            } else {
              updateDocument({ content: templatePreviewHtml, templateId: templatePreviewId });
            }
            toast({ title: 'Template applied', description: 'Replaced current document content.' });
          }
          setTemplatePreviewOpen(false);
        }}
      />
    </div>
  );
}
