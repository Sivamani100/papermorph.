import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Rows3 } from 'lucide-react';

interface LineSpacingControlProps {
  editor: any;
}

/**
 * LineSpacingControl component
 * Provides line spacing (line height) controls with presets
 */
export function LineSpacingControl({ editor }: LineSpacingControlProps) {
  const [customLineHeight, setCustomLineHeight] = useState('1');

  if (!editor) return null;

  const lineSpacingPresets = [
    { label: 'Single (1.0)', value: '1' },
    { label: '1.15 Lines', value: '1.15' },
    { label: '1.5 Lines', value: '1.5' },
    { label: 'Double (2.0)', value: '2' },
    { label: 'Triple (3.0)', value: '3' },
  ];

  const applyLineSpacing = (value: string) => {
    editor?.chain().focus().setLineHeight(value || null).run();
    setCustomLineHeight(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 gap-1"
          title="Line Spacing"
        >
          <Rows3 className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">Line Spacing</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Rows3 className="h-4 w-4" />
              Line Spacing
            </h3>
          </div>

          {/* Preset Options */}
          <div className="grid grid-cols-2 gap-2">
            {lineSpacingPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
                onClick={() => applyLineSpacing(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Separator />

          {/* Custom Line Spacing */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Custom Line Spacing</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                value={customLineHeight}
                onChange={(e) => setCustomLineHeight(e.target.value)}
                placeholder="1.5"
                className="text-xs"
              />
              <Button
                size="sm"
                onClick={() => applyLineSpacing(customLineHeight)}
                className="text-xs"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <p className="font-semibold mb-1">Line Spacing Guide:</p>
            <ul className="space-y-0.5">
              <li>• 1.0 = Single spacing</li>
              <li>• 1.5 = 1.5x spacing</li>
              <li>• 2.0 = Double spacing</li>
              <li>• Enter decimal for custom values</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default LineSpacingControl;
