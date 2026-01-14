import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image,
  Table,
  Undo,
  Redo,
  Highlighter,
  Strikethrough
} from 'lucide-react';
import { useEditorStore } from '@/state/useEditorStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ToolsPanelProps {
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

export function ToolsPanel({ 
  expandedSections, 
  toggleSection
}: ToolsPanelProps) {
  const { editor } = useEditorStore();

  const handleEditorAction = (action: string) => {
    if (!editor?.documentEditor) {
      toast.error('No active document');
      return;
    }
    
    const documentEditor = editor.documentEditor;
    const selection = documentEditor.selection;
    const editorModule = documentEditor.editor;

    // Show feedback for actions
    const showActionFeedback = (actionName: string) => {
      toast.success(`${actionName} applied`, { duration: 1000 });
    };

    switch (action) {
      case 'bold':
        if (selection?.characterFormat) {
          selection.characterFormat.bold = !selection.characterFormat.bold;
          showActionFeedback(selection.characterFormat.bold ? 'Bold' : 'Unbold');
        }
        break;
      case 'italic':
        if (selection?.characterFormat) {
          selection.characterFormat.italic = !selection.characterFormat.italic;
          showActionFeedback(selection.characterFormat.italic ? 'Italic' : 'Unitalic');
        }
        break;
      case 'underline':
        if (selection?.characterFormat) {
          selection.characterFormat.underline = selection.characterFormat.underline === 'Single' ? 'None' : 'Single';
          showActionFeedback('Underline');
        }
        break;
      case 'strikethrough':
        if (selection?.characterFormat) {
          selection.characterFormat.strikethrough = selection.characterFormat.strikethrough === 'SingleStrike' ? 'None' : 'SingleStrike';
          showActionFeedback('Strikethrough');
        }
        break;
      case 'code':
        if (selection?.characterFormat) {
          const isCode = selection.characterFormat.fontFamily === 'Consolas';
          selection.characterFormat.fontFamily = isCode ? 'Inter' : 'Consolas';
          showActionFeedback(isCode ? 'Normal text' : 'Code format');
        }
        break;
      case 'alignLeft':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Left';
          showActionFeedback('Aligned left');
        }
        break;
      case 'alignCenter':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Center';
          showActionFeedback('Aligned center');
        }
        break;
      case 'alignRight':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Right';
          showActionFeedback('Aligned right');
        }
        break;
      case 'bulletList':
        if (selection?.paragraphFormat) {
          editorModule?.applyBullet('\uf0b7', 'Symbol');
          showActionFeedback('Bullet list');
        }
        break;
      case 'numberedList':
        if (selection?.paragraphFormat) {
          editorModule?.applyNumbering('%1.');
          showActionFeedback('Numbered list');
        }
        break;
      case 'quote':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.leftIndent = selection.paragraphFormat.leftIndent === 36 ? 0 : 36;
          showActionFeedback('Quote format');
        }
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          const text = selection?.text || url;
          editorModule?.insertHyperlink(url, text);
          showActionFeedback('Link inserted');
        }
        break;
      case 'image':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              editorModule?.insertImage(base64, 400, 300);
              showActionFeedback('Image inserted');
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        break;
      case 'table':
        const rows = prompt('Number of rows:', '3');
        const columns = prompt('Number of columns:', '3');
        if (rows && columns) {
          const rowCount = parseInt(rows);
          const colCount = parseInt(columns);
          if (!isNaN(rowCount) && !isNaN(colCount) && rowCount > 0 && colCount > 0) {
            editorModule?.insertTable(rowCount, colCount);
            showActionFeedback(`Table ${rowCount}x${colCount} inserted`);
          } else {
            toast.error('Please enter valid numbers for rows and columns');
          }
        }
        break;
      case 'undo':
        if (documentEditor.editorHistory?.canUndo()) {
          documentEditor.editorHistory.undo();
          showActionFeedback('Undo');
        } else {
          toast.info('Nothing to undo');
        }
        break;
      case 'redo':
        if (documentEditor.editorHistory?.canRedo()) {
          documentEditor.editorHistory.redo();
          showActionFeedback('Redo');
        } else {
          toast.info('Nothing to redo');
        }
        break;
      case 'highlight':
        if (selection?.characterFormat) {
          // Syncfusion doesn't support backgroundColor directly on characterFormat
          // For now, we'll show a message that highlight is coming soon
          toast.info('Highlight feature coming soon! Use the toolbar highlight option instead.');
        }
        break;
      default:
        toast.info(`Action "${action}" not yet implemented`);
    }
  };

  if (!editor) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-xs">Editor not ready</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Text Formatting */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Text Formatting</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('bold')}
            >
              <Bold className="h-3 w-3 mr-1" />
              Bold
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('italic')}
            >
              <Italic className="h-3 w-3 mr-1" />
              Italic
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('underline')}
            >
              <Underline className="h-3 w-3 mr-1" />
              Underline
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('strikethrough')}
            >
              <Strikethrough className="h-3 w-3 mr-1" />
              Strike
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('code')}
            >
              <Code className="h-3 w-3 mr-1" />
              Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('highlight')}
            >
              <Highlighter className="h-3 w-3 mr-1" />
              Highlight
            </Button>
          </div>
        </div>

        <Separator />

        {/* Text Alignment */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Alignment</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('alignLeft')}
            >
              <AlignLeft className="h-3 w-3 mr-1" />
              Left
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('alignCenter')}
            >
              <AlignCenter className="h-3 w-3 mr-1" />
              Center
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('alignRight')}
            >
              <AlignRight className="h-3 w-3 mr-1" />
              Right
            </Button>
          </div>
        </div>

        <Separator />

        {/* Lists */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Lists</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('bulletList')}
            >
              <List className="h-3 w-3 mr-1" />
              Bullets
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('numberedList')}
            >
              <ListOrdered className="h-3 w-3 mr-1" />
              Numbered
            </Button>
          </div>
        </div>

        <Separator />

        {/* Insert Elements */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Insert</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('link')}
            >
              <Link2 className="h-3 w-3 mr-1" />
              Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('image')}
            >
              <Image className="h-3 w-3 mr-1" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('table')}
            >
              <Table className="h-3 w-3 mr-1" />
              Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('quote')}
            >
              <Quote className="h-3 w-3 mr-1" />
              Quote
            </Button>
          </div>
        </div>

        <Separator />

        {/* History */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">History</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('undo')}
            >
              <Undo className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              onClick={() => handleEditorAction('redo')}
            >
              <Redo className="h-3 w-3 mr-1" />
              Redo
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
