import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextSelectionMenuProps {
  isVisible: boolean;
  position: { x: number; y: number } | null;
  onOpenEnhancer: () => void;
}

export function TextSelectionMenu({
  isVisible,
  position,
  onOpenEnhancer,
}: TextSelectionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle click outside to close menu
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Don't close if clicking on the editor
        const editorElement = document.getElementById('documentEditor');
        if (!editorElement?.contains(e.target as Node)) {
          // Menu will be hidden by parent component
        }
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  if (!isVisible || !position) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-50 animate-in fade-in slide-in-from-top-2 duration-200',
        'bg-background border border-border rounded-lg shadow-lg'
      )}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <Button
        size="sm"
        variant="ghost"
        className="whitespace-nowrap gap-2 h-9"
        onClick={onOpenEnhancer}
        title="Enhance selected text with AI"
      >
        <Sparkles className="h-4 w-4" />
        Enhance Text
      </Button>
    </div>
  );
}
