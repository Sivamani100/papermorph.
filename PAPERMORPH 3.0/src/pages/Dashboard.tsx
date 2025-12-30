import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocStore, type Document } from '@/state/useDocStore';
import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_NAME } from '@/constants';
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Clock,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  FolderOpen,
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { documents, loadAllDocuments, createNewDocument, setCurrentDocument, deleteDocument } =
    useDocStore();
  const { user, theme, toggleTheme, logout } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllDocuments();
  }, []);

  const handleNewDocument = () => {
    createNewDocument();
    navigate('/editor');
  };

  const handleOpenDocument = (doc: Document) => {
    setCurrentDocument(doc);
    navigate('/editor');
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">{APP_NAME}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:block">{user?.name || 'Guest'}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-heading-section text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            Continue working on your documents or create a new one
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button onClick={handleNewDocument} className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Recent Documents
          </h2>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No documents yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first document to get started
              </p>
              <Button onClick={handleNewDocument} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-soft transition-all cursor-pointer"
                  onClick={() => handleOpenDocument(doc)}
                >
                  {/* Preview */}
                  <div className="aspect-[4/3] rounded-lg bg-muted mb-3 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                  </div>

                  {/* Content */}
                  <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDocument(doc);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
