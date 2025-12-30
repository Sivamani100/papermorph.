import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronDown, Type, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutlinePanelProps {
  editor?: any;
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
      // For Syncfusion editor, we'll extract headings differently
      const headingNodes: HeadingNode[] = [];
      
      // Placeholder implementation - in real app, extract from editor content
      const dummyHeadings: HeadingNode[] = [
        { id: '1', text: 'Introduction', level: 1, children: [] },
        { id: '2', text: 'Chapter 1', level: 1, children: [
          { id: '3', text: 'Section 1.1', level: 2, children: [] },
          { id: '4', text: 'Section 1.2', level: 2, children: [] },
        ]},
        { id: '5', text: 'Conclusion', level: 1, children: [] },
      ];

      setHeadings(dummyHeadings);
    };

    extractHeadings();
  }, [editor]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderHeading = (heading: HeadingNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(heading.id);
    const hasChildren = heading.children.length > 0;
    const indentClass = `pl-${Math.min(depth * 4, 12)}`;

    return (
      <div key={heading.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 rounded hover:bg-muted cursor-pointer text-xs',
            indentClass
          )}
          onClick={() => toggleNode(heading.id)}
        >
          {hasChildren && (
            <span className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
          {!hasChildren && <span className="w-3" />}
          <Type
            className={cn(
              'h-3 w-3',
              heading.level === 1 && 'text-blue-500',
              heading.level === 2 && 'text-green-500',
              heading.level === 3 && 'text-orange-500',
              heading.level >= 4 && 'text-purple-500'
            )}
          />
          <span className="truncate flex-1">{heading.text}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {heading.children.map((child) => renderHeading(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (headings.length === 0) {
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
          {headings.map((heading) => renderHeading(heading))}
        </div>
      </div>
    </ScrollArea>
  );
}
