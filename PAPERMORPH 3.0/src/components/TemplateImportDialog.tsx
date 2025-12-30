import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  html: string | null;
  title?: string;
  onClose: () => void;
  onImportNew: () => void;
  onReplaceCurrent: () => void;
};

export default function TemplateImportDialog({ open, html, title = 'Template Preview', onClose, onImportNew, onReplaceCurrent }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="w-full h-[420px] border overflow-hidden">
            {html ? (
              <iframe title="template-preview" srcDoc={html} className="w-full h-full" sandbox="allow-same-origin allow-scripts" />
            ) : (
              <div className="p-4 text-xs text-muted-foreground">No preview available.</div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onImportNew}>Import as New Document</Button>
            <Button variant="secondary" onClick={onReplaceCurrent}>Replace Current Document</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
