import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIChatBubble } from './AIChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { WizardForm } from './WizardForm';
import { useAISidebar, type WizardType } from '@/state/useAISidebar';
import { useEditorStore } from '@/state/useEditorStore';
import { AI_ACTIONS, WIZARD_TYPES } from '@/constants';
import {
  Sparkles,
  Send,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wand2,
  MessageSquare,
  GraduationCap,
  Check,
  Minimize2,
  Maximize2,
  FileText,
  Mail,
  FileBarChart,
  Presentation,
  BookOpen,
  Eraser,
  Zap,
  Pencil,
  Lightbulb,
  Copy,
  FileCheck,
  RefreshCw,
  AlertCircle,
  Brain,
  Flame,
  Eye,
  Volume2,
  Plus,
  X,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { debounce } from 'lodash';

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  generate: Sparkles,
  formal: GraduationCap,
  grammar: Check,
  condense: Minimize2,
  expand: Maximize2,
  summarize: FileText,
};

const WIZARD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  letter: Mail,
  report: FileBarChart,
  proposal: Presentation,
  essay: BookOpen,
};

export function SidebarRight() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [documentContext, setDocumentContext] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; content?: string; size?: number; type?: string }[]>([]);
  const [compactMode, setCompactMode] = useState<boolean>(() => { try { return localStorage.getItem('pm:compact') === '1'; } catch { return false; } });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { editor } = useEditorStore();
  
  // Handle applying content to the document
  useEffect(() => {
    const handleApplyContent = (event: Event) => {
      const customEvent = event as CustomEvent<{ content: string }>;
      const content = customEvent.detail?.content;
      if (content) {
        // Dispatch an event to the parent component to handle the content application
        const applyEvent = new CustomEvent('applyToDocument', { 
          detail: { content } 
        });
        window.dispatchEvent(applyEvent);
      }
    };

    const handleSuggestedFollowUp = (event: Event) => {
      const customEvent = event as CustomEvent<{ text: string }>;
      setInputValue(customEvent.detail.text);
      inputRef.current?.focus();
    };

    window.addEventListener('applyContent', handleApplyContent as EventListener);
    window.addEventListener('suggestedFollowUp', handleSuggestedFollowUp as EventListener);
    return () => {
      window.removeEventListener('applyContent', handleApplyContent as EventListener);
      window.removeEventListener('suggestedFollowUp', handleSuggestedFollowUp as EventListener);
    };
  }, []);

  const {
    isOpen,
    mode,
    messages,
    isGenerating,
    wizardType,
    setMode,
    sendMessage,
    clearMessages,
    generateSection,
    rewriteFormal,
    fixGrammar,
    condense,
    expand,
    summarize,
    startWizard,
  } = useAISidebar();

  const widthClass = compactMode ? 'w-64' : 'w-80';

  const speakText = (text?: string) => {
    if (!text) return;
    try {
      if ('speechSynthesis' in window) {
        const s = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(s);
      } else {
        toast({ title: 'TTS not supported' });
      }
    } catch (e) {
      console.error('TTS error', e);
    }
  };

  const applyLastAssistant = () => {
    const last = messages.slice().reverse().find(m => m.role === 'assistant');
    if (!last || !last.content) {
      toast({ title: 'No assistant response found' });
      return;
    }
    const ev = new CustomEvent('applyContent', { detail: { content: last.content } });
    window.dispatchEvent(ev);
    toast({ title: 'Applied last AI content' });
  };

  const showShortcuts = () => {
    alert('Keyboard shortcuts:\n• Enter = send\n• Shift+Enter = newline\n• Ctrl+Enter = page break\n• Ctrl+S = save (if available)');
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced message sending with error handling and retry
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue.trim();
    setInputValue('');
    setShowQuickActions(false);
    
    // Build a simple text context from uploaded files, if any
    const fileContext = uploadedFiles
      .filter(f => f.content)
      .map(f => `\n[File: ${f.name}]\n${f.content}`)
      .join('\n---\n');

    try {
      await sendMessage(message, fileContext || undefined);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Failed",
        description: "Unable to send your message. Please try again.",
        variant: "destructive"
      });
      // Restore the input value for retry
      setInputValue(message);
    }
  }, [inputValue, uploadedFiles, sendMessage]);

  // Debounced input handling for better performance
  const debouncedInputHandler = useCallback(
    debounce((value: string) => {
      // Additional input processing if needed
      if (value.length > 10000) {
        toast({
          title: "Input Too Long",
          description: "Please keep your message under 10,000 characters.",
          variant: "destructive"
        });
       }
     }, 300),
     []
  );

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const fileContext = uploadedFiles
      .filter(f => f.content)
      .map(f => `\n[File: ${f.name}]\n${f.content}`)
      .join('\n---\n');

    sendMessage(inputValue.trim(), fileContext || undefined);
    setInputValue('');
    setShowQuickActions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Enhanced action handling with error recovery
  const handleAction = useCallback(async (actionId: string) => {
    try {
      switch (actionId) {
        case 'generate':
          await generateSection();
          break;
        case 'formal':
          await rewriteFormal();
          break;
        case 'grammar':
          await fixGrammar();
          break;
        case 'condense':
          await condense();
          break;
        case 'expand':
          await expand();
          break;
        case 'summarize':
          await summarize();
          break;
        default:
          toast({
            title: "Unknown Action",
            description: "This action is not available.",
            variant: "destructive"
          });
      }
    } catch (error) {
      console.error(`Action ${actionId} failed:`, error);
      toast({
        title: "Action Failed",
        description: `The ${actionId} action failed. Please try again.`,
        variant: "destructive"
      });
    }
  }, [generateSection, rewriteFormal, fixGrammar, condense, expand, summarize]);

  if (isCollapsed) {
    return (
      <div className="w-14 border-l border-border bg-sidebar flex flex-col items-center py-3 gap-2">
        {isGenerating && (
          <div className="mb-1">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="h-px w-8 bg-border my-2" />
        <Button
          variant={mode === 'chat' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => {
            setMode('chat');
            setIsCollapsed(false);
          }}
          title="AI Chat"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant={mode === 'wizard' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => {
            setMode('wizard');
            setIsCollapsed(false);
          }}
          title="Document Wizard"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Wizard Mode
  if (mode === 'wizard' && wizardType) {
    return (
      <div className={`${widthClass} border-l border-border bg-sidebar flex flex-col animate-slide-in-right`}>
        <WizardForm type={wizardType} />
      </div>
    );
  }

  return (
    <div className={`${widthClass} border-l border-border bg-sidebar flex flex-col animate-slide-in-right`}>
      {/* Header - Enhanced */}
      <div className="p-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">AI Assistant</h2>
              <p className="text-[10px] text-muted-foreground">Intelligent writing</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => { setCompactMode((v) => { const n = !v; try { localStorage.setItem('pm:compact', n ? '1' : '0'); } catch {} return n; }); }} title="Toggle compact mode">
              {compactMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={showShortcuts} title="Shortcuts">
              <AlertCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={applyLastAssistant} title="Apply last AI answer">
              <FileCheck className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => { const last = messages.slice().reverse().find(m => m.role === 'assistant'); if (last) speakText(last.content || ''); }} title="Read last AI answer">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setIsCollapsed(true)} className="h-6 w-6">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Status indicator */}
        {isGenerating && (
          <div className="flex items-center gap-1.5 text-xs px-2 py-1.5 bg-primary/10 rounded-md">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-medium">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Mode Tabs - Enhanced */}
      <div className="flex p-2 gap-1 border-b border-border bg-muted/30">
        <Button
          variant={mode === 'chat' ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'flex-1 transition-all',
            mode === 'chat' && 'shadow-sm'
          )}
          onClick={() => setMode('chat')}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Chat
        </Button>
        <Button
          variant={mode === 'wizard' ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'flex-1 transition-all',
            mode === 'wizard' && 'shadow-sm'
          )}
          onClick={() => setMode('wizard')}
        >
          <Wand2 className="h-4 w-4 mr-1.5" />
          Wizard
        </Button>
      </div>

      {mode === 'chat' ? (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 py-2.5 px-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-4">
                {/* Welcome Animation */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" style={{ width: '56px', height: '56px' }} />
                  <div className="relative h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sparkles className="h-7 w-7 text-primary animate-bounce" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm text-foreground mb-0.5">
                  Meet Your AI Writer
                </h3>
                <p className="text-xs text-muted-foreground max-w-[200px] mb-4">
                  Enhance your writing with intelligent suggestions
                </p>
                
                {/* Quick Action Buttons - Enhanced */}
                <div className="flex flex-col gap-2 mt-3 w-full max-w-[240px]">
                  <button
                    onClick={() => setInputValue('Generate content for this document')}
                    className={cn(
                      'px-3 py-2.5 text-xs rounded-lg font-medium flex items-center gap-2.5',
                      'bg-primary/10 hover:bg-primary/20 text-primary',
                      'transition-all duration-200 hover:translate-x-0.5',
                      'border border-primary/20 hover:border-primary/40',
                      'group cursor-pointer'
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                    <span>Generate Content</span>
                  </button>
                  <button
                    onClick={() => setInputValue('Fix the grammar and improve this')}
                    className={cn(
                      'px-3 py-2.5 text-xs rounded-lg font-medium flex items-center gap-2.5',
                      'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400',
                      'transition-all duration-200 hover:translate-x-0.5',
                      'border border-blue-500/20 hover:border-blue-500/40',
                      'group cursor-pointer'
                    )}
                  >
                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Fix & Improve</span>
                  </button>
                  <button
                    onClick={() => setInputValue('Make this more concise')}
                    className={cn(
                      'px-3 py-2.5 text-xs rounded-lg font-medium flex items-center gap-2.5',
                      'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400',
                      'transition-all duration-200 hover:translate-x-0.5',
                      'border border-purple-500/20 hover:border-purple-500/40',
                      'group cursor-pointer'
                    )}
                  >
                    <Minimize2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Condense</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-4 w-full h-px bg-border" />

                {/* Help Text */}
                <p className="text-[10px] text-muted-foreground max-w-[220px]">
                  💡 Tip: You can ask anything about your document
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, idx) => (
                  <AIChatBubble 
                    key={message.id} 
                    message={message}
                    isGenerating={isGenerating && idx === messages.length - 1 && message.role === 'assistant'}
                    onRegenerate={() => console.log('Regenerate:', message.id)}
                  />
                ))}
                {isGenerating && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="flex items-start gap-2">
                    <div className="max-w-[85%] rounded-[8px] px-3.5 py-2 text-sm bg-card border border-border text-foreground rounded-bl-[2px]">
                      <TypingIndicator className="text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area - Enhanced */}
          <div className="p-2.5 border-t border-border bg-gradient-to-t from-muted/30 space-y-2">
            {/* Suggestion Pills */}
            {messages.length > 0 && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'flex-1 text-xs h-7 transition-all',
                    'hover:bg-destructive/10 hover:text-destructive'
                  )}
                  onClick={clearMessages}
                  title="Clear conversation"
                >
                  <Eraser className="h-3 w-3 mr-1" />
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'flex-1 text-xs h-7 transition-all',
                    showQuickActions 
                      ? 'bg-primary/10 text-primary border border-primary/30' 
                      : 'hover:bg-muted'
                  )}
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  title="Show suggestions"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Tips
                </Button>
              </div>
            )}
            
            {/* Quick Suggestions Grid */}
            {showQuickActions && messages.length > 0 && (
              <div className="grid grid-cols-2 gap-1 text-xs animate-slide-in-left p-1.5 bg-muted/40 rounded-lg border border-border/50">
                <button
                  onClick={() => setInputValue('Make this more professional')}
                  className="px-2 py-1.5 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-150 text-left text-[10px] font-medium hover:translate-x-0.5 flex items-center gap-1"
                  title="Make more professional"
                >
                  <Wand2 className="h-3 w-3 flex-shrink-0" />
                  Professional
                </button>
                <button
                  onClick={() => setInputValue('Make it shorter')}
                  className="px-2 py-1.5 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-150 text-left text-[10px] font-medium hover:translate-x-0.5 flex items-center gap-1"
                  title="Condense text"
                >
                  <Minimize2 className="h-3 w-3 flex-shrink-0" />
                  Shorter
                </button>
                <button
                  onClick={() => setInputValue('Add more detail')}
                  className="px-2 py-1.5 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-150 text-left text-[10px] font-medium hover:translate-x-0.5 flex items-center gap-1"
                  title="Add details"
                >
                  <Maximize2 className="h-3 w-3 flex-shrink-0" />
                  Expand
                </button>
                <button
                  onClick={() => setInputValue('Check for errors')}
                  className="px-2 py-1.5 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-150 text-left text-[10px] font-medium hover:translate-x-0.5 flex items-center gap-1"
                  title="Review text"
                >
                  <Check className="h-3 w-3 flex-shrink-0" />
                  Review
                </button>
              </div>
            )}

            {/* Input Section */}
            <div className="space-y-1">
              {/* File Badges */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                        'bg-primary/10 text-primary border border-primary/20',
                        'hover:bg-primary/20 transition-colors group'
                      )}
                    >
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate max-w-[70px]">{file.name.split('.')[0]}</span>
                      <button
                        onClick={() => {
                          const updated = uploadedFiles.filter(f => f.id !== file.id);
                          setUploadedFiles(updated);
                        }}
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded"
                      >
                        <X className="h-2.5 w-2.5 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input with Upload Button */}
              <div className="flex gap-1.5 items-start">
                {/* File Upload Button */}
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.doc,.docx"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    
                    const newFiles: typeof uploadedFiles = [];
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
                      
                      if (!['.txt', '.md', '.doc', '.docx'].includes(ext)) {
                        continue;
                      }

                      const uploadedFile: typeof uploadedFiles[0] = {
                        id: `${Date.now()}-${i}`,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                      };

                      if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          uploadedFile.content = evt.target?.result as string;
                        };
                        reader.readAsText(file);
                      }

                      newFiles.push(uploadedFile);
                    }

                    const allFiles = [...uploadedFiles, ...newFiles];
                    if (allFiles.length <= 3) {
                      setUploadedFiles(allFiles);
                    } else {
                      alert('Maximum 3 files allowed');
                    }

                    if (e.target) {
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                  id="fileInput"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  title="Upload files (max 3)"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                {/* Message Input */}
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isGenerating}
                  className="flex-1 h-8 text-sm bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                
                {/* Send Button */}
                <Button
                  variant="ai"
                  size="icon"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isGenerating}
                  className={cn(
                    'h-8 w-8 flex-shrink-0 transition-all',
                    !inputValue.trim() || isGenerating
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-md hover:scale-105'
                  )}
                  title="Send message"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Character Count - Optional */}
            {inputValue && messages.length > 0 && (
              <p className="text-[9px] text-muted-foreground text-right px-1">
                {inputValue.length} characters
              </p>
            )}
          </div>
        </>
      ) : (
        /* Wizard Selection */
        <ScrollArea className="flex-1 p-4">
          <p className="text-xs text-muted-foreground mb-4">
            Select a document type to generate with AI assistance
          </p>
          <div className="space-y-2">
            {WIZARD_TYPES.map((wizard) => {
              const Icon = WIZARD_ICONS[wizard.id];
              return (
                <button
                  key={wizard.id}
                  onClick={() => startWizard(wizard.id as WizardType)}
                  className="w-full p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {wizard.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Step-by-step {wizard.id} creation
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
