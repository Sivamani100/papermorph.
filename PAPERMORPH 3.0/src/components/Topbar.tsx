import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocStore } from '@/state/useDocStore';
import { useUserStore } from '@/state/useUserStore';
import { useEditorStore } from '@/state/useEditorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Save,
  Download,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Check,
  Loader2,
  Cloud,
  Presentation,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { APP_NAME } from '@/constants';
import { Palette } from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';
import { toast } from 'sonner';
import { exportToPDF, exportToDOCX, exportToHTML, exportToTXT } from '@/utils/exportDocument';

export function Topbar() {
  const navigate = useNavigate();
  const { currentDocument, saveStatus, updateDocumentTitle, saveDocument, autoSave } = useDocStore();
  const { user, theme, toggleTheme, logout } = useUserStore();
  const { contentRef } = useEditorStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDocument?.title || 'Untitled Document');
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Handle save error notifications
  useEffect(() => {
    const handleSaveError = (event: CustomEvent) => {
      const { message } = event.detail;
      toast.error(`Save failed: ${message}`);
      setShowSaveError(true);
    };

    window.addEventListener('documentSaveError', handleSaveError as EventListener);
    return () => window.removeEventListener('documentSaveError', handleSaveError as EventListener);
  }, []);

  // Auto-save setup
  useEffect(() => {
    const cleanup = autoSave();
    return cleanup;
  }, [autoSave]);

  const handleRetrySave = async () => {
    setIsRetrying(true);
    try {
      await saveDocument();
      setShowSaveError(false);
      toast.success('Document saved successfully');
    } catch (error) {
      toast.error('Retry failed. Please check your connection.');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleTitleClick = () => {
    setTitleValue(currentDocument?.title || 'Untitled Document');
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      updateDocumentTitle(titleValue.trim());
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleValue(currentDocument?.title || 'Untitled Document');
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'html' | 'txt') => {
    if (!currentDocument || !contentRef?.current) {
      toast.error('No document or content to export');
      return;
    }

    setIsExporting(true);
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(currentDocument, contentRef);
          toast.success('PDF exported successfully');
          break;
        case 'docx':
          await exportToDOCX(currentDocument, contentRef);
          toast.success('Word document exported successfully');
          break;
        case 'html':
          await exportToHTML(currentDocument, contentRef);
          toast.success('HTML file exported successfully');
          break;
        case 'txt':
          await exportToTXT(currentDocument, contentRef);
          toast.success('Text file exported successfully');
          break;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      toast.error(message);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'saved':
        return <Check className="h-4 w-4 text-success" />;
      default:
        if (showSaveError) {
          return <AlertTriangle className="h-4 w-4 text-destructive" />;
        }
        return <Cloud className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      default:
        if (showSaveError) {
          return 'Save failed';
        }
        return 'Unsaved changes';
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      {/* Logo & Title Section */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">{APP_NAME}</span>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Document Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditingTitle ? (
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="h-8 max-w-xs bg-transparent border-muted-foreground/30"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-xs"
            >
              {currentDocument?.title || 'Untitled Document'}
            </button>
          )}

          {/* Save Status */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            {getSaveStatusIcon()}
            <span className="hidden md:block">{getSaveStatusText()}</span>
            {showSaveError && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleRetrySave}
                disabled={isRetrying}
                title="Retry save"
                className="h-5 w-5"
              >
                <RefreshCw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => saveDocument()}>
          <Save className="h-4 w-4" />
          <span className="hidden md:block">Save</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isExporting}>
              <Download className="h-4 w-4" />
              <span className="hidden md:block">
                {isExporting ? 'Exporting...' : 'Export'}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              PDF Document (.pdf)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('docx')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              Word Document (.docx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('html')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              Web Page (.html)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('txt')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              Plain Text (.txt)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Features Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/features')}
          className="gap-2 hidden sm:flex"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs">Features</span>
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Accent Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ThemeSelector />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden md:block text-sm">
                {user?.name || 'Guest'}
              </span>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
