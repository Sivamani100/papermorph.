import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronDown, Type, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutlinePanelProps {
  editor: any;
}

interface HeadingNode {
  id: string;
  text: string;
  level: number;
  children: HeadingNode[];
}

export default function OutlinePanel({ editor }: OutlinePanelProps) {
  const [headings, setHeadings] = useState<HeadingNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!editor) return;

    const extractHeadings = () => {
      const doc = editor.state.doc;
      const headingNodes: HeadingNode[] = [];
      
      doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'heading') {
          const text = node.textContent;
          const level = node.attrs.level || 1;
          const id = `heading-${pos}`;
          
          headingNodes.push({
            id,
            text: text || 'Untitled Heading',
            level,
            children: []
          });
        }
      });

      setHeadings(headingNodes);
    };

    extractHeadings();
    
    // Update headings when document changes
    const unsubscribe = editor.on('update', extractHeadings);
    
    return unsubscribe;
  }, [editor]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const navigateToHeading = (pos: number) => {
    if (editor) {
      editor.chain().focus().setTextSelection(pos).run();
    }
  };

  const getHeadingIcon = (level: number) => {
    switch (level) {
      case 1:
        return <FileText className="h-3 w-3" />;
      case 2:
        return <Type className="h-3 w-3" />;
      default:
        return <Type className="h-3 w-3" />;
    }
  };

  if (!headings.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No headings found</p>
        <p className="text-xs mt-1">Add headings to see document outline</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <div className="space-y-1">
          {headings.map((heading, index) => {
            const isExpanded = expandedNodes.has(heading.id);
            const indent = (heading.level - 1) * 12;
            
            return (
              <div key={heading.id} className="group">
                <button
                  className={cn(
                    "w-full flex items-center gap-1 px-2 py-1.5 text-left rounded-sm hover:bg-muted/50 transition-colors",
                    "text-xs"
                  )}
                  style={{ paddingLeft: `${indent + 8}px` }}
                  onClick={() => navigateToHeading(parseInt(heading.id.replace('heading-', '')))}
                >
                  {getHeadingIcon(heading.level)}
                  <span className="flex-1 truncate">{heading.text}</span>
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-2 text-xs text-muted-foreground">
          {headings.length} heading{headings.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </ScrollArea>
  );
}
