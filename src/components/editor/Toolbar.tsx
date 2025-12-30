import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  MessageCircle,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Minus,
  Link,
  Image,
  Code,
  Quote,
  ChevronDown,
  Table,
  Plus,
  Trash2,
  Type,
  Palette,
  Sparkles,
  Settings2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/state/useUserStore';
import { useSidebarStore } from '@/state/useSidebarStore';

interface ToolbarProps {
  onAction: (action: string, value?: string) => void;
  activeFormats: string[];
  selectedFont: string;
  selectedFontSize: string;
}

const fonts = ['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Consolas'];
const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
const headingSizes = [
  { label: 'Heading 1', value: 'h1', preview: 'H1' },
  { label: 'Heading 2', value: 'h2', preview: 'H2' },
  { label: 'Heading 3', value: 'h3', preview: 'H3' },
];

const Toolbar: React.FC<ToolbarProps> = ({ onAction, activeFormats, selectedFont, selectedFontSize }) => {
  const { theme, colorTheme } = useUserStore();
  const { leftCollapsed, rightCollapsed } = useSidebarStore();
  const isActive = (format: string) => activeFormats.includes(format);
  
  // Determine if we should use compact layout (when any sidebar is open)
  const isCompactLayout = !leftCollapsed || !rightCollapsed;

  return (
    <div className={`flex flex-col backdrop-blur supports-[backdrop-filter]: transition-colors border-b shadow-sm`}
         style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}>
      {/* Primary Toolbar Row */}
      <div className={`flex items-center gap-1 px-4 py-2 transition-all duration-300 min-h-[44px] ${
        isCompactLayout ? 'flex-wrap gap-1 [&>*]:mb-[5px]' : 'flex-nowrap gap-1'
      }`}>
        {/* File Operations Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('undo')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('redo')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1 bg-border" />

        {/* Typography Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          {/* Font Family */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 px-3 min-w-0 justify-between transition-colors ${
                  isCompactLayout ? 'max-w-24' : 'max-w-32'
                } ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="truncate text-sm">{selectedFont}</span>
                <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-48 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              {fonts.map(font => (
                <DropdownMenuItem key={font} onClick={() => onAction('fontFamily', font)} className={
                  theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                }>
                  <span style={{ fontFamily: font }} className="text-sm">{font}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 justify-between transition-colors ${
                  isCompactLayout ? 'w-12 px-2' : 'w-16 px-3'
                } ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-sm">{selectedFontSize}</span>
                <ChevronDown className="h-3 w-3 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-32 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              {fontSizes.map(size => (
                <DropdownMenuItem key={size} onClick={() => onAction('fontSize', size)} className={
                  theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                }>
                  <span className="text-sm">{size}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Headings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 transition-colors ${
                  isCompactLayout ? 'px-2' : 'px-3'
                } ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Type className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-40 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              {headingSizes.map(heading => (
                <DropdownMenuItem key={heading.value} onClick={() => onAction(heading.value)}>
                  <span className={cn(
                    'font-bold text-sm',
                    heading.value === 'h1' && 'text-2xl',
                    heading.value === 'h2' && 'text-xl',
                    heading.value === 'h3' && 'text-lg'
                  )}>
                    {heading.preview}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">{heading.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className={`h-6 mx-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Text Formatting Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant={isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('bold')}
            className={cn(
              'h-8 w-8 transition-colors',
              isActive('bold') 
                ? 'bg-primary text-primary-foreground border border-primary'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('italic')}
            className={cn(
              'h-8 w-8 transition-colors',
              isActive('italic') 
                ? 'bg-primary text-primary-foreground border border-primary'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('underline')}
            className={cn(
              'h-8 w-8 transition-colors',
              isActive('underline') 
                ? 'bg-primary text-primary-foreground border border-primary'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant={isActive('strikethrough') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onAction('strikethrough')}
            className={cn(
              'h-8 w-8 transition-colors',
              isActive('strikethrough') 
                ? 'bg-primary text-primary-foreground border border-primary'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1 bg-border" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('subscript')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Subscript"
          >
            <span className="text-sm font-medium">X₂</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('superscript')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Superscript"
          >
            <span className="text-sm font-medium">X²</span>
          </Button>
        </div>

        <Separator orientation="vertical" className={`h-6 mx-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Color & Style Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Text Color"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-48 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              <DropdownMenuItem onClick={() => onAction('textColor', '#000000')} className={
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }>
                <div className="w-4 h-4 bg-black rounded mr-2" />
                <span className="text-sm">Black</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#ef4444')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <div className="w-4 h-4 bg-red-500 rounded mr-2" />
                <span className="text-sm">Red</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#3b82f6')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                <span className="text-sm">Blue</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('textColor', '#10b981')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                <span className="text-sm">Green</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('highlight')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Highlight Text"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className={`h-6 mx-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Alignment Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignLeft')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignCenter')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignRight')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('alignJustify')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className={`h-6 mx-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Comments Group */}
        <div className={`flex items-center gap-1 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('comment')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Add Comment"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists Group - Moved from second row */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('orderedList')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('unorderedList')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className={`h-6 mx-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Insert Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('link')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('image')}
            className={`h-8 transition-colors ${
              isCompactLayout ? 'px-2 gap-2' : 'w-8'
            } hover:bg-primary/10 hover:text-primary`}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
            {isCompactLayout && <span className="text-sm">Image</span>}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 transition-colors ${
                  isCompactLayout ? 'px-2 gap-2' : 'w-8'
                } ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Insert Table"
              >
                <Table className="h-4 w-4" />
                {isCompactLayout && <span className="text-sm">Table</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`w-48 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              <DropdownMenuItem onClick={() => onAction('table')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <Table className="h-4 w-4 mr-2" />
                <span className="text-sm">Insert Table</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('insertRow')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Insert Row</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('insertColumn')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Insert Column</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('deleteRow')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Delete Row</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('deleteColumn')} className={
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }>
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Delete Column</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('code')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Code Format"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('quote')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Block Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className={`h-6 mx-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Elements Group */}
        <div className={`flex items-center gap-1 pr-2 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('horizontalRule')}
            className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1" />

        {/* Layout Group - Moved to right side */}
        <div className={`flex items-center gap-1 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 transition-colors ${
                  isCompactLayout ? 'px-2' : 'px-3'
                } ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-4 h-3 border border-current rounded-sm mr-2" />
                <span className="text-sm">Margins</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => onAction('margins', 'normal')}>
                <span className="text-sm">Normal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('margins', 'narrow')}>
                <span className="text-sm">Narrow</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('margins', 'wide')}>
                <span className="text-sm">Wide</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 hover:bg-accent/50 transition-colors ${
                  isCompactLayout ? 'px-2' : 'px-3'
                }`}
              >
                <AlignJustify className="h-4 w-4 mr-2" />
                <span className="text-sm">Spacing</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => onAction('lineSpacing', '1')}>
                <span className="text-sm">Single</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('lineSpacing', '1.5')}>
                <span className="text-sm">1.5 Lines</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('lineSpacing', '2')}>
                <span className="text-sm">Double</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* AI & More Tools */}
        <div className={`flex items-center gap-1 transition-all duration-300 ${
          isCompactLayout ? 'shrink-0' : 'flex-shrink-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('ai-assist')}
            className={`h-8 gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
              isCompactLayout ? 'px-2' : 'px-3'
            }`}
            title="AI Assistant"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 hover:bg-accent/50 transition-colors"
                title="More Tools"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAction('settings')}>
                <Settings2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('macros')}>
                <Code className="h-4 w-4 mr-2" />
                <span className="text-sm">Macros</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;