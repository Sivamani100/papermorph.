import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, FileText, Sparkles } from 'lucide-react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted shimmer-loading',
        className
      )}
    />
  );
}

export function DocumentCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="aspect-[4/3] rounded-lg bg-muted mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function DocumentListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex items-start gap-2 animate-pulse">
      <div className="max-w-[85%] rounded-[8px] px-3.5 py-2 bg-muted border border-border rounded-bl-[2px]">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
}

interface FullPageLoadingProps {
  message?: string;
}

export function FullPageLoading({ message = 'Loading...' }: FullPageLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-accent-foreground animate-bounce" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Papermorph</h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        <LoadingSpinner size="md" className="mx-auto" />
      </div>
    </div>
  );
}

interface InlineLoadingProps {
  message?: string;
  className?: string;
}

export function InlineLoading({ message = 'Loading...', className }: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-3 gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-3 gap-4 p-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagramSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <Skeleton className="h-4 w-64 mb-2" />
      <div className="w-full h-64 bg-surface relative rounded-md flex items-center justify-center">
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}