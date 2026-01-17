import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Check, X, RotateCcw, Copy, Loader2, Wand2, CheckCircle, Palette, Zap, BookOpen, Minimize2, Sparkles, GraduationCap, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAISidebar } from '@/state/useAISidebar';

interface AITextEnhancerProps {
  isOpen: boolean;
  selectedText: string;
  onClose: () => void;
  onApply: (newText: string) => void;
}

type EnhancementType = 'rephrase' | 'grammar' | 'tone' | 'simplify' | 'expand' | 'summarize';

interface EnhancementOption {
  id: EnhancementType;
  label: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
}

const ENHANCEMENT_OPTIONS: EnhancementOption[] = [
  {
    id: 'rephrase',
    label: 'Rephrase',
    icon: <Wand2 className="w-5 h-5 stroke-[2.5]" />,
    description: 'Reword the text with fresh perspective',
    prompt: 'Rephrase the following text while keeping the same meaning but using different words and structure. Make it more engaging and professional. Only return the rephrased text, nothing else:\n\n',
  },
  {
    id: 'grammar',
    label: 'Grammar Check',
    icon: <CheckCircle className="w-5 h-5 stroke-[2.5]" />,
    description: 'Fix grammar and spelling errors',
    prompt: 'Fix all grammar, spelling, and punctuation errors in the following text. Keep the original meaning and tone. Suggest better phrasing if appropriate. Only return the corrected text, nothing else:\n\n',
  },
  {
    id: 'tone',
    label: 'Adjust Tone',
    icon: <Palette className="w-5 h-5 stroke-[2.5]" />,
    description: 'Make it more professional or casual',
    prompt: 'Rewrite the following text to be more professional and formal. Use sophisticated vocabulary and proper business communication style. Only return the modified text, nothing else:\n\n',
  },
  {
    id: 'simplify',
    label: 'Simplify',
    icon: <Zap className="w-5 h-5 stroke-[2.5]" />,
    description: 'Make it easier to understand',
    prompt: 'Simplify the following text to be easier to understand while keeping all the important information. Use simpler words and shorter sentences. Only return the simplified text, nothing else:\n\n',
  },
  {
    id: 'expand',
    label: 'Expand',
    icon: <BookOpen className="w-5 h-5 stroke-[2.5]" />,
    description: 'Add more detail and depth',
    prompt: 'Expand the following text by adding more details, examples, and explanations. Make it more comprehensive while keeping it coherent. Only return the expanded text, nothing else:\n\n',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: <Minimize2 className="w-5 h-5 stroke-[2.5]" />,
    description: 'Make it more concise',
    prompt: 'Summarize the following text into a concise version that keeps all the key points. Make it brief but comprehensive. Only return the summary, nothing else:\n\n',
  },
  {
    id: 'improve',
    label: 'Improve Writing',
    icon: <Sparkles className="w-5 h-5 stroke-[2.5]" />,
    description: 'Enhance clarity, flow, and impact',
    prompt: 'Improve the following text by enhancing clarity, flow, and impact. Fix any awkward phrasing, improve sentence structure, and make it more compelling. Only return the improved text, nothing else:\n\n',
  },
  {
    id: 'academic',
    label: 'Academic Style',
    icon: <GraduationCap className="w-5 h-5 stroke-[2.5]" />,
    description: 'Convert to academic writing style',
    prompt: 'Rewrite the following text in academic style using formal language, proper citations format, and scholarly tone. Use appropriate terminology for academic writing. Only return the academic version, nothing else:\n\n',
  },
  {
    id: 'business',
    label: 'Business Style',
    
    description: 'Convert to business writing style',
    prompt: 'Rewrite the following text in professional business style using clear, concise language appropriate for corporate communication. Focus on action-oriented language and professional tone. Only return the business version, nothing else:\n\n',
  },
  {
    id: 'creative',
    label: 'Creative Style',
    icon: <Lightbulb className="w-5 h-5 stroke-[2.5]" />,
    description: 'Make it more creative and engaging',
    prompt: 'Rewrite the following text in a more creative and engaging style. Use vivid language, storytelling elements, and compelling descriptions. Only return the creative version, nothing else:\n\n',
  },
];

export function AITextEnhancer({
  isOpen,
  selectedText,
  onClose,
  onApply,
}: AITextEnhancerProps) {
  const [selectedOption, setSelectedOption] = useState<EnhancementType | null>(null);
  const [enhancedText, setEnhancedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { sendMessage } = useAISidebar();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null);
      setEnhancedText('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleEnhance = useCallback(async (optionId: EnhancementType) => {
    if (!selectedText.trim()) {
      toast.error('Please select some text to enhance');
      return;
    }

    setSelectedOption(optionId);
    setIsLoading(true);
    setEnhancedText('');

    try {
      const option = ENHANCEMENT_OPTIONS.find(opt => opt.id === optionId);
      if (!option) {
        throw new Error('Invalid enhancement option');
      }

      const prompt = option.prompt + selectedText;

      // Use Supabase Edge Function for better security
      const response = await fetch(
        'https://behebhohabohiiparyie.supabase.co/functions/v1/openrouter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlaGViaG9oYWJvaGlpcGFyeWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDQyMDksImV4cCI6MjA4NDIyMDIwOX0.3p0iFtzKq0FCaTARslaKatEMd5JvGclfYeLBFNdioyc'
          },
          body: JSON.stringify({
            prompt: prompt,
            model: 'anthropic/claude-3.5-sonnet'
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to enhance text');
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content?.trim() || '';

      if (!result) {
        throw new Error('No response from AI');
      }

      setEnhancedText(result);
      toast.success(`${option.label} completed`);
    } catch (error) {
      console.error('Enhancement failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to enhance text';
      toast.error(message);
      setSelectedOption(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedText]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(enhancedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  }, [enhancedText]);

  const handleApply = useCallback(() => {
    if (enhancedText) {
      onApply(enhancedText);
      toast.success('Text updated');
      onClose();
    }
  }, [enhancedText, onApply, onClose]);

  const currentOption = selectedOption
    ? ENHANCEMENT_OPTIONS.find(opt => opt.id === selectedOption)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Enhance Selected Text</DialogTitle>
          <DialogDescription>
            Choose an enhancement option to improve your text
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Text Display */}
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Original Text</p>
            <p className="text-sm leading-relaxed max-h-24 overflow-auto">{selectedText}</p>
          </div>

          {!selectedOption ? (
            <>
              {/* Enhancement Options Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ENHANCEMENT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleEnhance(option.id)}
                    disabled={isLoading}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all duration-200 text-left',
                      'hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed',
                      'border-border'
                    )}
                    title={option.description}
                  >
                    <div className="mb-3 text-foreground">{option.icon}</div>
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Enhanced Text Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="text-foreground">{currentOption?.icon}</div>
                  <div>
                    <p className="font-semibold">{currentOption?.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentOption?.description}
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Enhancing your text...
                      </p>
                    </div>
                  </div>
                ) : enhancedText ? (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">
                      Enhanced Text Preview
                    </p>
                    <p className="text-sm leading-relaxed max-h-40 overflow-auto text-foreground">
                      {enhancedText}
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              if (selectedOption) {
                setSelectedOption(null);
                setEnhancedText('');
              } else {
                onClose();
              }
            }}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            {selectedOption ? 'Back' : 'Close'}
          </Button>

          {selectedOption && enhancedText && (
            <>
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={isLoading}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied' : 'Copy'}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleEnhance(selectedOption)}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>

              <Button
                onClick={handleApply}
                disabled={isLoading}
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
