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
import { useUserStore } from '@/state/useUserStore';
import { AI_ACTIONS, WIZARD_TYPES } from '@/constants';
import { toast } from 'sonner';
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
  Settings,
  History,
  Star,
  TrendingUp,
  Mic,
  Paperclip,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Link,
  Table,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Heart,
  Bookmark,
  Flag,
  Archive,
  Trash2,
  Edit3,
  Save,
  Undo,
  Redo,
  Scissors,
  Clipboard,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { debounce } from 'lodash';
import { useSidebarStore } from '@/state/useSidebarStore';

const CHAT_SUGGESTIONS = [
  {
    id: 'summarize',
    title: 'Summarize',
    icon: FileText,
    prompt: 'Please summarize the selected text or document in a clear and concise manner, highlighting the main points and key information.'
  },
  {
    id: 'formal',
    title: 'Make Formal',
    icon: GraduationCap,
    prompt: 'Please rewrite the selected text in a more formal tone, using professional language and appropriate business communication style.'
  },
  {
    id: 'grammar',
    title: 'Check Grammar',
    icon: Check,
    prompt: 'Please review and correct any grammatical errors, spelling mistakes, and punctuation issues in the selected text.'
  },
  {
    id: 'expand',
    title: 'Expand',
    icon: Maximize2,
    prompt: 'Please expand on the selected text with more details, examples, and explanations to make it more comprehensive and informative.'
  },
  {
    id: 'condense',
    title: 'Make Concise',
    icon: Minimize2,
    prompt: 'Please condense the selected text to make it more brief and to the point, removing unnecessary words while maintaining the core meaning.'
  },
  {
    id: 'generate',
    title: 'Generate',
    icon: Sparkles,
    prompt: 'Please generate new content based on the topic or context provided, creating original and relevant material.'
  }
];

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
  const { rightCollapsed, setRightCollapsed } = useSidebarStore();
  const [inputValue, setInputValue] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isQuickActionsCollapsed, setIsQuickActionsCollapsed] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isTipsCollapsed, setIsTipsCollapsed] = useState(false);
  const [documentContext, setDocumentContext] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; content?: string; size?: number; type?: string }[]>([]);
  const [compactMode, setCompactMode] = useState<boolean>(() => { try { return localStorage.getItem('pm:compact') === '1'; } catch { return false; } });
  const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'history'>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [floatingTab, setFloatingTab] = useState<'chat' | 'tools' | 'history' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { editor } = useEditorStore();
  const { theme, colorTheme } = useUserStore();
  
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

  // File upload handling
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile = {
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          content: content.slice(0, 5000), // Limit content size
          size: file.size,
          type: file.type,
        };
        setUploadedFiles(prev => [...prev, newFile]);
        toast({ title: `Uploaded: ${file.name}` });
      };
      reader.readAsText(file);
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // Quick action handlers
  const handleQuickAction = useCallback(async (action: string) => {
    try {
      switch (action) {
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
          break;
      }
    } catch (error) {
      console.error('Quick action failed:', error);
      toast({
        title: "Action Failed",
        description: "Unable to perform the requested action.",
        variant: "destructive"
      });
    }
  }, [generateSection, rewriteFormal, fixGrammar, condense, expand, summarize]);

  // Voice recording handler
  // Enhanced copy functionality with feedback
  const handleCopyMessage = useCallback(async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast({ title: "Message copied to clipboard" });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast({ title: "Failed to copy message", variant: "destructive" });
    }
  }, []);

  // Enhanced input focus handling
  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  // Enhanced UX handlers
  const handleActionHover = useCallback((actionId: string) => {
    setHoveredAction(actionId);
  }, []);

  const handleActionLeave = useCallback(() => {
    setHoveredAction(null);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const handleTypingStart = useCallback(() => {
    setIsTyping(true);
  }, []);

  const handleTypingEnd = useCallback(() => {
    setIsTyping(false);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setIsAnimating(true);
    setRightCollapsed(!rightCollapsed);
    setTimeout(() => setIsAnimating(false), 300);
  }, [rightCollapsed]);

  const handleNewChat = useCallback(() => {
    clearMessages();
    setInputValue('');
    toast({ title: "New chat started" });
  }, []);

  const handleSuggestionClick = useCallback((suggestion: typeof CHAT_SUGGESTIONS[0]) => {
    setInputValue(suggestion.prompt);
    inputRef.current?.focus();
  }, []);

  const handleTipAction = useCallback((tipId: string, prompt: string) => {
    setInputValue(prompt);
    setShowTips(false);
    setShowQuickActions(false);
    inputRef.current?.focus();
    toast({ title: "Tip applied to input" });
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({ title: "Recording stopped" });
    } else {
      setIsRecording(true);
      toast({ title: "Recording started" });
    }
  };

  return (
    <div className={cn('flex flex-col border-l transition-all duration-200 h-full relative', rightCollapsed ? 'w-16' : 'w-80')}
         style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b transition-all duration-200 backdrop-blur-xl"
           style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}>
        {!rightCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 bg-primary/20 border border-primary/30">
              <Brain className="h-4 w-4 transition-colors text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm transition-colors text-foreground">AI Assistant</span>
              <span className="text-xs transition-colors text-muted-foreground">Chat & Help</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {!rightCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchToggle}
              className={`h-8 w-8 transition-all duration-200 backdrop-blur-sm border transform hover:scale-110 ${
                theme === 'dark' 
                  ? 'hover:bg-primary/10 hover:text-primary border-gray-700/50' 
                  : 'hover:bg-primary/10 hover:text-primary border-gray-200/50'
              }`}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            className={`h-8 w-8 transition-all duration-300 backdrop-blur-sm border transform hover:scale-105 ${
              theme === 'dark' 
                ? 'hover:bg-primary/10 hover:text-primary border-gray-700/50' 
                : 'hover:bg-primary/10 hover:text-primary border-gray-200/50'
            }`}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${
              rightCollapsed ? 'rotate-0' : 'rotate-180'
            }`} />
          </Button>
        </div>
      </div>

      {/* Search Bar (when shown) */}
      {!rightCollapsed && showSearch && (
        <div className={`px-4 py-3 border-b transition-all duration-300 ${
          theme === 'dark' ? 'border-gray-800 bg-black/10' : 'border-gray-200 bg-white/50'
        }`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className={`pl-10 pr-4 h-8 text-sm transition-all duration-200 backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-primary/50' 
                  : 'bg-white/50 border-gray-200/50 placeholder-gray-500 focus:border-primary/50'
              }`}
            />
          </div>
        </div>
      )}

      {/* Floating Tabs for Collapsed State - Top Aligned */}
      {rightCollapsed && (
        <div className="flex flex-col items-center gap-2 p-3 pt-4 h-full overflow-y-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFloatingTab('chat')}
            className={`h-8 w-8 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 p-1.5 ${
              theme === 'dark' 
                ? 'hover:bg-primary/10 hover:text-primary border-gray-700/50' 
                : 'hover:bg-white/20 border-gray-200/50'
            }`}
            title="Open Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFloatingTab('history')}
            className={`h-8 w-8 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 p-1.5 ${
              theme === 'dark' 
                ? 'hover:bg-primary/10 hover:text-primary border-gray-700/50' 
                : 'hover:bg-white/20 border-gray-200/50'
            }`}
            title="Open History"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Floating Panel */}
      {floatingTab && (
        <div className={`absolute left-full top-0 ml-2 w-80 h-96 rounded-lg border transition-all duration-200 backdrop-blur-xl z-50 ${
          theme === 'dark' 
            ? 'bg-black/90 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className={`font-semibold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-foreground'
            }`}>
              {floatingTab === 'chat' && 'Chat'}
              {floatingTab === 'tools' && 'Tools'}
              {floatingTab === 'history' && 'History'}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFloatingTab(null)}
              className={`h-6 w-6 ${
                theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'
              }`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            {floatingTab === 'chat' && (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-gray-50/50 border-gray-200/50'
                }`}>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Chat interface will appear here...</p>
                </div>
              </div>
            )}
            {floatingTab === 'history' && (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-gray-50/50 border-gray-200/50'
                }`}>
                  <h4 className={`font-medium text-sm mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Chat History</h4>
                  <div className="space-y-2">
                    <div className={`p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-900/50 border-gray-700/50' 
                        : 'bg-white/50 border-gray-200/50'
                    }`}>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>No chat history yet...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {!rightCollapsed && (
        <>
          {/* Chat & History Tab Navigation */}
          <div className={`flex p-3 gap-1.5 border-b transition-all duration-200 backdrop-blur-sm ${
            theme === 'dark' ? 'border-gray-800 bg-black/10' : 'border-gray-200 bg-white/5'
          }`}>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 gap-1.5 h-8 p-1.5 transition-all duration-200 ${
                activeTab === 'chat' 
                  ? theme === 'dark' 
                    ? 'bg-primary/20 text-primary border-primary/30 backdrop-blur-sm' 
                    : 'bg-primary/10 text-primary border-primary/30 backdrop-blur-sm'
                  : theme === 'dark'
                    ? 'hover:bg-primary/10 hover:text-primary'
                    : 'hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium">Chat</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className={`w-8 gap-1.5 transition-all duration-200 p-1.5 ${
                theme === 'dark'
                  ? 'hover:bg-primary/10 hover:text-primary'
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
              title="New chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('history')}
              className={`flex-1 gap-1.5 h-8 p-1.5 transition-all duration-200 ${
                activeTab === 'history' 
                  ? theme === 'dark' 
                    ? 'bg-primary/20 text-primary border-primary/30 backdrop-blur-sm' 
                    : 'bg-primary/10 text-primary border-primary/30 backdrop-blur-sm'
                  : theme === 'dark'
                    ? 'hover:bg-primary/10 hover:text-primary'
                    : 'hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <History className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium">History</span>
            </Button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <>
              {/* Chat Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                    {/* Welcome Message */}
                    <div className="text-center space-y-4 mb-8">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto backdrop-blur-md border transition-all duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 shadow-lg shadow-primary/20' 
                          : 'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 shadow-lg shadow-primary/10'
                      }`}>
                        <Brain className={`h-6 w-6 ${
                          theme === 'dark' ? 'text-primary' : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>AI Assistant</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Ask me anything about your document!</p>
                      </div>
                    </div>

                    {/* Suggestions Grid */}
                    <div className="w-full max-w-xs space-y-2">
                      <div className={`text-center text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>Try asking:</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {CHAT_SUGGESTIONS.map((suggestion) => (
                          <Button
                            key={suggestion.id}
                            variant="outline"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`h-10 p-1.5 flex flex-col items-center justify-center gap-1 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 ${
                              theme === 'dark'
                                ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
                                : 'bg-white/30 border-gray-200/50 hover:bg-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
                            }`}
                          >
                            <suggestion.icon className="h-3 w-3 flex-shrink-0" />
                            <div className={`text-xs font-medium text-center leading-tight ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                            }`}>{suggestion.title}</div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <AIChatBubble
                        key={message.id}
                        message={message}
                        theme={theme}
                        onApplyContent={(content) => {
                          const ev = new CustomEvent('applyContent', { detail: { content } });
                          window.dispatchEvent(ev);
                        }}
                        onCopy={(content) => handleCopyMessage(content, message.id)}
                        copiedMessageId={copiedMessageId}
                      />
                    ))}
                    
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="rounded-[12px] rounded-bl-[4px] bg-card border border-border px-4 py-3 shadow-sm">
                          <TypingIndicator />
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input Area - Stuck to Bottom */}
              <div className={`p-3 border-t transition-colors ${
                theme === 'dark' ? 'border-gray-800' : 'border-border'
              }`}>
                <div className="space-y-2">
                  {/* File Attachments */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Paperclip className="h-3 w-3" />
                        <span>Attached files</span>
                      </div>
                      <div className="space-y-1">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`flex items-center gap-2 p-1.5 rounded-md border text-xs ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-gray-300'
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            <FileText className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="h-5 w-5 hover:bg-destructive/10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Input Controls with Focus Effects */}
                  <div className="flex gap-1.5">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          debouncedInputHandler(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Ask AI anything..."
                        className={`pr-20 resize-none transition-all duration-300 backdrop-blur-sm border transform ${
                          theme === 'dark' 
                            ? 'bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-primary/50 focus:bg-gray-800/50 focus:scale-[1.02]' 
                            : 'bg-white/50 border-gray-200/50 placeholder-gray-500 focus:border-primary/50 focus:bg-white/70 focus:scale-[1.02]'
                        } ${inputFocused ? 'shadow-lg' : ''}`}
                      />
                      
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className={`h-6 w-6 transition-all duration-200 backdrop-blur-sm border transform hover:scale-110 ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700/50 text-gray-400 border-gray-600/30' 
                              : 'hover:bg-gray-100/50 text-gray-500 border-gray-200/30'
                          }`}
                          title="Attach file"
                        >
                          <Paperclip className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleRecording}
                          className={`h-6 w-6 transition-all duration-200 backdrop-blur-sm border transform hover:scale-110 ${
                            isRecording ? 'text-red-500 animate-pulse' : ''
                          } ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700/50 text-gray-400 border-gray-600/30' 
                              : 'hover:bg-gray-100/50 text-gray-500 border-gray-200/30'
                          }`}
                          title="Voice input"
                        >
                          <Mic className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isGenerating}
                      className={`h-9 w-9 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 ${
                        theme === 'dark'
                          ? 'bg-primary/20 border-primary/30 hover:bg-primary/30 text-primary hover:shadow-lg hover:shadow-primary/20'
                          : 'bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary hover:shadow-lg hover:shadow-primary/10'
                      } ${inputValue.trim() && !isGenerating ? 'animate-pulse' : ''}`}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Hidden File Upload */}
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="flex-1 p-4">
              <div className="space-y-6">
                {/* Writing Tools */}
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Writing Tools
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(ACTION_ICONS).map(([action, Icon]) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="h-10 text-xs gap-2 hover:bg-primary/5 hover:border-primary/20 flex-col items-start"
                      >
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{action.charAt(0).toUpperCase() + action.slice(1)}</div>
                          <div className="text-muted-foreground text-xs">
                            {action === 'generate' && 'Create new content'}
                            {action === 'formal' && 'Make formal tone'}
                            {action === 'grammar' && 'Fix grammar issues'}
                            {action === 'condense' && 'Make shorter'}
                            {action === 'expand' && 'Make longer'}
                            {action === 'summarize' && 'Create summary'}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Document Types */}
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Types
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(WIZARD_TYPES).map(([type, config]) => {
                      const Icon = WIZARD_ICONS[type];
                      return (
                        <Button
                          key={type}
                          variant="outline"
                          onClick={() => startWizard(type as WizardType)}
                          className="h-10 text-xs gap-2 hover:bg-primary/5 hover:border-primary/20 flex-col items-start"
                        >
                          <Icon className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">{config.label}</div>
                            <div className="text-muted-foreground text-xs">{config.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Formatting Tools */}
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Bold className="h-4 w-4" />
                    Formatting
                  </h4>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { icon: Bold, label: 'Bold' },
                      { icon: Italic, label: 'Italic' },
                      { icon: Underline, label: 'Underline' },
                      { icon: AlignLeft, label: 'Left' },
                      { icon: AlignCenter, label: 'Center' },
                      { icon: AlignRight, label: 'Right' },
                      { icon: List, label: 'List' },
                      { icon: ListOrdered, label: 'Numbered' },
                    ].map(({ icon: Icon, label }) => (
                      <Button
                        key={label}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/5 hover:border-primary/20"
                        title={label}
                      >
                        <Icon className="h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Conversation History</h4>
                  <Button variant="outline" size="sm" onClick={clearMessages} className="text-xs">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No conversation history yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {messages.map((message, index) => (
                        <div key={message.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          )}

          </>
      )}
    </div>
  );
}
