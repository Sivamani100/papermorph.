import { cn } from '@/lib/utils';
import { FileText, Heart, Eye, Plus } from 'lucide-react';

interface TemplateCardProps {
  title: string;
  description: string;
  previewImageUrl?: string;
  category?: string;
  onSelect: () => void;
  className?: string;
}

export function TemplateCard({
  title,
  description,
  previewImageUrl,
  category,
  onSelect,
  className,
}: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative w-full text-left rounded-xl border border-border bg-card p-3 animate-fade-in',
        'transition-all duration-200 hover:border-primary/30 hover:shadow-glow',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {/* Preview */}
      <div className="aspect-[4/3] rounded-lg bg-muted mb-3 overflow-hidden flex items-center justify-center relative">
        {previewImageUrl && previewImageUrl !== '/placeholder.svg' ? (
          <img
            src={previewImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 group-focus:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileText className="h-8 w-8" />
            <span className="text-xs">Preview</span>
          </div>
        )}
      </div>

      {/* Hover Overlay Actions */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3">
        <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-auto flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); /* preview action placeholder */ }}
            className="btn-ghost flex items-center gap-2 px-3 py-1 text-xs rounded-md bg-background/60 backdrop-blur-sm"
            aria-label="Preview"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); /* quick add action */ }}
            className="btn-primary flex items-center gap-2 px-3 py-1 text-xs rounded-md"
            aria-label="Use"
          >
            <Plus className="h-4 w-4" />
            <span>Use</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); /* favorite */ }}
            className="btn-ghost flex items-center gap-2 px-2 py-1 text-xs rounded-md"
            aria-label="Favorite"
          >
            <Heart className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        {category && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
            {category}
          </span>
        )}
        <h3 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
