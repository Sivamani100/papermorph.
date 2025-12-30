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
  Redo
} from 'lucide-react';
import { useEditorStore } from '@/state/useEditorStore';

interface ToolsPanelProps {
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  hoverRows: number;
  setHoverRows: (rows: number) => void;
  hoverCols: number;
  setHoverCols: (cols: number) => void;
}

export function ToolsPanel({ 
  expandedSections, 
  toggleSection, 
  hoverRows, 
  setHoverRows, 
  hoverCols, 
  setHoverCols 
}: ToolsPanelProps) {
  const { editor } = useEditorStore();

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
          <h3 className="text-xs font-semibold text-foreground">Text Formatting</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                // Syncfusion editor formatting would go here
                console.log('Bold clicked');
              }}
            >
              <Bold className="h-3 w-3 mr-1" />
              Bold
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Italic clicked');
              }}
            >
              <Italic className="h-3 w-3 mr-1" />
              Italic
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Underline clicked');
              }}
            >
              <Underline className="h-3 w-3 mr-1" />
              Underline
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Code clicked');
              }}
            >
              <Code className="h-3 w-3 mr-1" />
              Code
            </Button>
          </div>
        </div>

        <Separator />

        {/* Text Alignment */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground">Alignment</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Align left clicked');
              }}
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Align center clicked');
              }}
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Align right clicked');
              }}
            >
              <AlignRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Lists */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground">Lists</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Bullet list clicked');
              }}
            >
              <List className="h-3 w-3 mr-1" />
              Bullet
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Numbered list clicked');
              }}
            >
              <ListOrdered className="h-3 w-3 mr-1" />
              Numbered
            </Button>
          </div>
        </div>

        <Separator />

        {/* Insert Elements */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground">Insert</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Link clicked');
              }}
            >
              <Link2 className="h-3 w-3 mr-1" />
              Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Image clicked');
              }}
            >
              <Image className="h-3 w-3 mr-1" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Table clicked');
              }}
            >
              <Table className="h-3 w-3 mr-1" />
              Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Quote clicked');
              }}
            >
              <Quote className="h-3 w-3 mr-1" />
              Quote
            </Button>
          </div>
        </div>

        <Separator />

        {/* History */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground">History</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Undo clicked');
              }}
            >
              <Undo className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                console.log('Redo clicked');
              }}
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
