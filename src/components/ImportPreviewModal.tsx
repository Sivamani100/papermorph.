import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, FileText, Image, Table, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ParsedContent } from '@/utils/documentParser';
import '@/styles/document-styles.css';

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  parsedContent: ParsedContent | null;
  isLoading?: boolean;
}

export function ImportPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  parsedContent,
  isLoading = false,
}: ImportPreviewModalProps) {
  const [selectedTab, setSelectedTab] = useState('preview');

  if (!parsedContent) return null;

  const textLength = parsedContent.text.length;
  const imageCount = parsedContent.images.length;
  const tableCount = parsedContent.tables.length;
  const hasContent = textLength > 0;

  // Get preview text (first 300 chars)
  const previewText = parsedContent.text.substring(0, 300);
  const hasMore = textLength > 300;

  // Determine status
  const getStatus = () => {
    if (!hasContent) {
      return {
        label: 'No Content',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
        message: 'Document appears to be empty or could not be parsed'
      };
    }
    return {
      label: 'Ready',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50/50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
      message: 'Document is ready to import'
    };
  };

  const status = getStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                Import Document Preview
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {fileName} - Review the content before importing
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4 px-6">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="text-xs text-muted-foreground font-medium">Text</div>
              <div className="text-lg font-semibold mt-1">
                {(textLength / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-muted-foreground mt-1">characters</div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-1">
                <Image className="w-4 h-4" />
                <div className="text-xs text-muted-foreground font-medium">Images</div>
              </div>
              <div className="text-lg font-semibold mt-1">{imageCount}</div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-1">
                <Table className="w-4 h-4" />
                <div className="text-xs text-muted-foreground font-medium">Tables</div>
              </div>
              <div className="text-lg font-semibold mt-1">{tableCount}</div>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg border',
                status.bgColor
              )}
            >
              <div className="flex items-center gap-1">
                {hasContent ? (
                  <CheckCircle className={cn("w-4 h-4", status.color)} />
                ) : (
                  <AlertCircle className={cn("w-4 h-4", status.color)} />
                )}
                <div className="text-xs text-muted-foreground font-medium">Status</div>
              </div>
              <div className="text-sm font-semibold mt-1">{status.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{status.message}</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              {imageCount > 0 && <TabsTrigger value="images">Images ({imageCount})</TabsTrigger>}
              {tableCount > 0 && <TabsTrigger value="tables">Tables ({tableCount})</TabsTrigger>}
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>

            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1 overflow-hidden flex flex-col mt-4">
              <ScrollArea className="flex-1 border rounded-lg bg-background">
                <div className="p-6 min-h-full bg-white dark:bg-slate-950">
                  <div
                    className="document-preview prose prose-base dark:prose-invert max-w-none
                      prose-p:leading-relaxed prose-p:my-3
                      prose-h1:text-3xl prose-h1:font-bold prose-h1:my-4
                      prose-h2:text-2xl prose-h2:font-bold prose-h2:my-3
                      prose-h3:text-xl prose-h3:font-bold prose-h3:my-2
                      prose-strong:font-bold
                      prose-em:italic
                      prose-table:w-full prose-table:border-collapse prose-table:my-4
                      prose-th:bg-slate-100 prose-th:dark:bg-slate-800 prose-th:px-3 prose-th:py-2 prose-th:text-left
                      prose-td:px-3 prose-td:py-2 prose-td:border
                      prose-img:max-w-full prose-img:rounded
                      prose-ul:list-disc prose-ul:ml-5 prose-ul:my-3
                      prose-ol:list-decimal prose-ol:ml-5 prose-ol:my-3
                      prose-li:my-1
                      prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
                      prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                      prose-pre:bg-slate-100 prose-pre:dark:bg-slate-800 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-auto"
                    dangerouslySetInnerHTML={{ __html: parsedContent.html }}
                  />
                  {hasMore && (
                    <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-xs text-amber-800 dark:text-amber-200 italic border border-amber-200 dark:border-amber-800">
                      ✓ Preview truncated - showing first {(textLength / 1000).toFixed(1)}K characters. Full document ({(textLength / 1000).toFixed(1)}K) will be imported.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Images Tab */}
            {imageCount > 0 && (
              <TabsContent value="images" className="flex-1 overflow-hidden flex flex-col mt-4">
                <ScrollArea className="flex-1 border rounded-lg p-4 bg-background">
                  <div className="grid grid-cols-2 gap-4">
                    {parsedContent.images.map((img, idx) => (
                      <div key={img.id} className="group relative rounded-lg overflow-hidden border border-border">
                        <div className="bg-secondary aspect-square flex items-center justify-center">
                          {img.src.startsWith('data:') || img.src.startsWith('http') ? (
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="max-w-full max-h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22%3EImage Error%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <Image className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-2 bg-secondary/50">
                          <div className="text-xs font-medium truncate">{img.alt || `Image ${idx + 1}`}</div>
                          {img.width && img.height && (
                            <div className="text-xs text-muted-foreground">
                              {img.width} × {img.height}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            {/* Tables Tab */}
            {tableCount > 0 && (
              <TabsContent value="tables" className="flex-1 overflow-hidden flex flex-col mt-4">
                <ScrollArea className="flex-1 border rounded-lg p-4 bg-background">
                  <div className="space-y-6">
                    {parsedContent.tables.map((table, idx) => (
                      <div key={table.id} className="overflow-x-auto">
                        <div className="text-sm font-semibold mb-2">Table {idx + 1}</div>
                        <table className="border-collapse border border-border text-sm">
                          <tbody>
                            {table.content.map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="border border-border px-3 py-2 bg-secondary/30"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            {/* Raw Text Tab */}
            <TabsContent value="raw" className="flex-1 overflow-hidden flex flex-col mt-4">
              <ScrollArea className="flex-1 border rounded-lg p-4 bg-background font-mono text-sm">
                <div className="text-foreground whitespace-pre-wrap break-words">
                  {parsedContent.text}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="border-t bg-secondary/30 px-6 py-4 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!hasContent || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Import Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
