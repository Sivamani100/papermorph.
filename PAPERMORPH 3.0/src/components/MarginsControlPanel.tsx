import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocStore } from '@/state/useDocStore';

interface MarginsControlPanelProps {
  editor: any;
}

/**
 * MarginsControlPanel component
 * Provides MS Word-like margin controls for document formatting
 * Margins are applied globally to all pages, not to individual paragraphs
 */
export function MarginsControlPanel({ editor }: MarginsControlPanelProps) {
  const { currentDocument, updateDocument } = useDocStore();
  const [marginTop, setMarginTop] = useState(currentDocument?.pageMargins?.top || '25.4mm');
  const [marginBottom, setMarginBottom] = useState(currentDocument?.pageMargins?.bottom || '25.4mm');
  const [marginLeft, setMarginLeft] = useState(currentDocument?.pageMargins?.left || '25.4mm');
  const [marginRight, setMarginRight] = useState(currentDocument?.pageMargins?.right || '25.4mm');
  const [showMarginInput, setShowMarginInput] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null);

  // Update local state when document margins change
  useEffect(() => {
    if (currentDocument?.pageMargins) {
      setMarginTop(currentDocument.pageMargins.top || '25.4mm');
      setMarginBottom(currentDocument.pageMargins.bottom || '25.4mm');
      setMarginLeft(currentDocument.pageMargins.left || '25.4mm');
      setMarginRight(currentDocument.pageMargins.right || '25.4mm');
    }
  }, [currentDocument?.pageMargins]);

  if (!editor) return null;

  // Preset margins (in px/mm)
  const marginPresets = [
    { label: 'Default (25.4mm)', value: '25.4mm' },
    { label: 'Narrow (19mm)', value: '19mm' },
    { label: 'Normal (25.4mm)', value: '25.4mm' },
    { label: 'Wide (38mm)', value: '38mm' },
    { label: 'Moderate (32mm)', value: '32mm' },
  ];

  const applyMargin = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
    const newMargins = {
      top: marginTop,
      bottom: marginBottom,
      left: marginLeft,
      right: marginRight,
    };

    if (side === 'top') {
      newMargins.top = value;
      setMarginTop(value);
    } else if (side === 'bottom') {
      newMargins.bottom = value;
      setMarginBottom(value);
    } else if (side === 'left') {
      newMargins.left = value;
      setMarginLeft(value);
    } else if (side === 'right') {
      newMargins.right = value;
      setMarginRight(value);
    }

    // Update document margins globally
    updateDocument({ pageMargins: newMargins });
  };

  const applyAllMargins = (value: string) => {
    setMarginTop(value);
    setMarginBottom(value);
    setMarginLeft(value);
    setMarginRight(value);
    updateDocument({
      pageMargins: {
        top: value,
        bottom: value,
        left: value,
        right: value,
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 gap-1"
          title="Page Margins"
        >
          <Square className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">Margins</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Square className="h-4 w-4" />
              Page Margins (Applied to All Pages)
            </h3>
            <p className="text-xs text-muted-foreground">
              Margins are applied globally to ensure consistent text layout across all pages.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {marginPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyAllMargins(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Individual Margin Controls */}
          <div className="space-y-3">
            <Label className="text-xs font-medium">Custom Margins</Label>
            
            {/* Top Margin */}
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs font-medium">Top</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground min-w-[50px] text-right">{marginTop}</span>
                <Popover open={showMarginInput === 'top'} onOpenChange={(open) => setShowMarginInput(open ? 'top' : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      ↻
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="space-y-2">
                      <Label className="text-xs">Enter Top Margin (e.g., 10px, 1cm, 25.4mm, 1in)</Label>
                      <Input
                        type="text"
                        placeholder="25.4mm"
                        defaultValue={marginTop}
                        onChange={(e) => {
                          const value = e.target.value;
                          applyMargin('top', value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setShowMarginInput(null);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Bottom Margin */}
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs font-medium">Bottom</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground min-w-[50px] text-right">{marginBottom}</span>
                <Popover open={showMarginInput === 'bottom'} onOpenChange={(open) => setShowMarginInput(open ? 'bottom' : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      ↻
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="space-y-2">
                      <Label className="text-xs">Enter Bottom Margin (e.g., 10px, 1cm, 25.4mm, 1in)</Label>
                      <Input
                        type="text"
                        placeholder="25.4mm"
                        defaultValue={marginBottom}
                        onChange={(e) => {
                          const value = e.target.value;
                          applyMargin('bottom', value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setShowMarginInput(null);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Left Margin */}
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs font-medium">Left</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground min-w-[50px] text-right">{marginLeft}</span>
                <Popover open={showMarginInput === 'left'} onOpenChange={(open) => setShowMarginInput(open ? 'left' : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      ↻
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="space-y-2">
                      <Label className="text-xs">Enter Left Margin (e.g., 10px, 1cm, 25.4mm, 1in)</Label>
                      <Input
                        type="text"
                        placeholder="25.4mm"
                        defaultValue={marginLeft}
                        onChange={(e) => {
                          const value = e.target.value;
                          applyMargin('left', value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setShowMarginInput(null);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Right Margin */}
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs font-medium">Right</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground min-w-[50px] text-right">{marginRight}</span>
                <Popover open={showMarginInput === 'right'} onOpenChange={(open) => setShowMarginInput(open ? 'right' : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      ↻
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="space-y-2">
                      <Label className="text-xs">Enter Right Margin (e.g., 10px, 1cm, 25.4mm, 1in)</Label>
                      <Input
                        type="text"
                        placeholder="25.4mm"
                        defaultValue={marginRight}
                        onChange={(e) => {
                          const value = e.target.value;
                          applyMargin('right', value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setShowMarginInput(null);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Info */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <p className="font-semibold mb-1">Supported Units:</p>
            <ul className="space-y-0.5">
              <li>• px (pixels): 10px, 20px</li>
              <li>• mm (millimeters): 19mm, 25.4mm, 38mm</li>
              <li>• cm (centimeters): 1.9cm, 2.54cm, 3.8cm</li>
              <li>• in (inches): 0.75in, 1in, 1.5in</li>
            </ul>
            <p className="font-semibold mt-2 mb-1">Note:</p>
            <p>Margins apply to all pages. Text will properly flow across multiple pages without overlay.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MarginsControlPanel;
