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

export function ToolsPanel() {
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
              variant={editor.isActive('bold') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="h-8 text-xs"
            >
              <Bold className="h-3 w-3 mr-1" />
              Bold
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="h-8 text-xs"
            >
              <Italic className="h-3 w-3 mr-1" />
              Italic
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="h-8 text-xs"
            >
              <Underline className="h-3 w-3 mr-1" />
              Underline
            </Button>
            <Button
              variant={editor.isActive('code') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className="h-8 text-xs"
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
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className="h-8 text-xs"
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className="h-8 text-xs"
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className="h-8 text-xs"
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
              variant={editor.isActive('bulletList') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="h-8 text-xs"
            >
              <List className="h-3 w-3 mr-1" />
              Bullet
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="h-8 text-xs"
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
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className="w-full justify-start h-8 text-xs"
            >
              <Quote className="h-3 w-3 mr-1" />
              Quote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = window.prompt('Enter URL');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className="w-full justify-start h-8 text-xs"
            >
              <Link2 className="h-3 w-3 mr-1" />
              Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = window.prompt('Enter image URL');
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="w-full justify-start h-8 text-xs"
            >
              <Image className="h-3 w-3 mr-1" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="w-full justify-start h-8 text-xs"
            >
              <Table className="h-3 w-3 mr-1" />
              Table
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
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 text-xs"
            >
              <Undo className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 text-xs"
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