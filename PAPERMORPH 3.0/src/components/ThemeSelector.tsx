import React from 'react';
import { Button } from '@/components/ui/button';

const ACCENTS: { id: string; label: string; primary: string; accent?: string }[] = [
  { id: 'blue', label: 'Blue', primary: '217 91% 60%', accent: '188 94% 43%' },
  { id: 'purple', label: 'Purple', primary: '262 83% 58%', accent: '330 81% 60%' },
  { id: 'green', label: 'Green', primary: '142 76% 36%', accent: '160 84% 39%' },
  { id: 'red', label: 'Red', primary: '0 72% 51%', accent: '25 95% 53%' },
];

export function ThemeSelector() {
  const [currentAccent, setCurrentAccent] = React.useState<string>('blue');

  const setAccent = (id: string, primary: string, accent?: string) => {
    try {
      document.documentElement.style.setProperty('--primary', primary);
      if (accent) document.documentElement.style.setProperty('--accent', accent);
      localStorage.setItem('papermorph-accent', primary + (accent ? `|${accent}` : ''));
      localStorage.setItem('papermorph-accent-id', id);
      setCurrentAccent(id);
      
      // Add visual feedback
      document.documentElement.classList.add('theme-updating');
      setTimeout(() => document.documentElement.classList.remove('theme-updating'), 600);
    } catch (e) {
      console.warn('Failed to set accent', e);
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('papermorph-accent');
    const savedId = localStorage.getItem('papermorph-accent-id') || 'blue';
    setCurrentAccent(savedId);
    
    if (saved) {
      const [p, a] = saved.split('|');
      if (p) document.documentElement.style.setProperty('--primary', p);
      if (a) document.documentElement.style.setProperty('--accent', a);
    }
  }, []);

  return (
    <div className="p-3 w-56">
      <div className="text-sm font-medium mb-3 text-foreground">Choose Accent Color</div>
      <div className="grid grid-cols-2 gap-2">
        {ACCENTS.map((a) => (
          <Button
            key={a.id}
            variant={currentAccent === a.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setAccent(a.id, a.primary, a.accent)}
            className="flex items-center gap-2 justify-start h-10 transition-all hover:scale-105"
          >
            <div 
              className="h-4 w-4 rounded-full border-2 border-white shadow-sm" 
              style={{ background: `hsl(${a.primary})` }} 
            />
            <span className="text-xs font-medium">{a.label}</span>
            {currentAccent === a.id && (
              <div className="ml-auto h-2 w-2 rounded-full bg-current opacity-60" />
            )}
          </Button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Theme changes apply instantly across the entire application
        </p>
      </div>
    </div>
  );
}

export default ThemeSelector;
