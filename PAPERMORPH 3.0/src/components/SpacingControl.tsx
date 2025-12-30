import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Type } from 'lucide-react';

interface SpacingControlProps {
  editor: any;
}

/**
 * SpacingControl component
 * Provides word spacing and letter spacing controls
 */
export function SpacingControl({ editor }: SpacingControlProps) {
  const [wordSpacing, setWordSpacing] = useState('0');
  const [letterSpacing, setLetterSpacing] = useState('0');

  if (!editor) return null;

  const wordSpacingPresets = [
    { label: 'Normal (0)', value: '0' },
    { label: 'Relaxed (2px)', value: '2px' },
    { label: 'Wide (4px)', value: '4px' },
    { label: 'Extra Wide (6px)', value: '6px' },
  ];

  const letterSpacingPresets = [
    { label: 'Tight (-1px)', value: '-1px' },
    { label: 'Normal (0)', value: '0' },
    { label: 'Expanded (1px)', value: '1px' },
    { label: 'Wide (2px)', value: '2px' },
    { label: 'Extra Wide (3px)', value: '3px' },
  ];

  const applyWordSpacing = (value: string) => {
    editor?.chain().focus().setWordSpacing(value || null).run();
    setWordSpacing(value);
  };

  const applyLetterSpacing = (value: string) => {
    editor?.chain().focus().setLetterSpacing(value || null).run();
    setLetterSpacing(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 gap-1"
          title="Word & Letter Spacing"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">Spacing</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Type className="h-4 w-4" />
              Word & Letter Spacing
            </h3>
          </div>

          {/* Word Spacing */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium mb-2 block">Word Spacing</Label>
              <div className="grid grid-cols-2 gap-2">
                {wordSpacingPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => applyWordSpacing(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Word Spacing */}
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="text-xs font-medium min-w-fit">Custom:</span>
              <Input
                type="text"
                placeholder="e.g., 2px, 1em"
                value={wordSpacing}
                onChange={(e) => setWordSpacing(e.target.value)}
                className="text-xs h-7"
              />
              <Button
                size="sm"
                onClick={() => applyWordSpacing(wordSpacing)}
                className="text-xs h-7 px-2"
              >
                Apply
              </Button>
            </div>
          </div>

          <Separator />

          {/* Letter Spacing */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium mb-2 block">Letter Spacing</Label>
              <div className="grid grid-cols-2 gap-2">
                {letterSpacingPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => applyLetterSpacing(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Letter Spacing */}
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="text-xs font-medium min-w-fit">Custom:</span>
              <Input
                type="text"
                placeholder="e.g., 1px, 0.1em"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(e.target.value)}
                className="text-xs h-7"
              />
              <Button
                size="sm"
                onClick={() => applyLetterSpacing(letterSpacing)}
                className="text-xs h-7 px-2"
              >
                Apply
              </Button>
            </div>
          </div>

          <Separator />

          {/* Info */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded space-y-2">
            <div>
              <p className="font-semibold mb-1">Supported Units:</p>
              <ul className="space-y-0.5">
                <li>• px (pixels): 1px, 2px</li>
                <li>• em (relative): 0.1em, 0.5em</li>
                <li>• Negative values allowed: -1px</li>
              </ul>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SpacingControl;
