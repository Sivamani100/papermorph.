import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/state/useEditorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MessageSquare, Send, Zap, CheckCircle, User, Bot, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistantPage() {
  const navigate = useNavigate();
  const { contentRef } = useEditorStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I am your AI chat assistant. Ask me anything about your document or ideas.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const next: ChatMessage[] = [
      ...messages,
      { id: Date.now().toString(), role: 'user', content: text },
    ];
    setMessages(next);
    setInput('');
    setIsSending(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a demo reply to: "${text}". In a real app, this would come from your AI backend and could edit or analyze your document.`,
      };
      setMessages((prev) => [...prev, reply]);
      setIsSending(false);
    }, 900);
  };

  const applyLastAssistantToDoc = () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!last) {
      toast.error('No assistant message to apply');
      return;
    }
    if (contentRef?.current) {
      // Set as plain text, not HTML
      contentRef.current.innerText = last.content;
      toast.success('Last assistant reply applied to document');
      navigate('/');
    }
  };

  const copyLastAssistant = () => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!last) return;
    navigator.clipboard.writeText(last.content);
    toast.success('Assistant reply copied');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                AI Chat Assistant
              </h1>
              <p className="text-muted-foreground text-sm">Chat demo that can apply answers back into your document</p>
            </div>
          </div>
          <Badge variant="default" className="gap-1">
            <Zap className="h-3 w-3" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[420px]">
              <ScrollArea className="flex-1 pr-3">
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={
                        m.role === 'user'
                          ? 'flex justify-end'
                          : 'flex justify-start'
                      }
                    >
                      <div
                        className={
                          m.role === 'user'
                            ? 'max-w-[80%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm'
                            : 'max-w-[80%] rounded-lg bg-card border px-3 py-2 text-sm'
                        }
                      >
                        <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                          {m.role === 'user' ? (
                            <>
                              <User className="h-3 w-3" /> You
                            </>
                          ) : (
                            <>
                              <Bot className="h-3 w-3" /> Assistant
                            </>
                          )}
                        </div>
                        <div>{m.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Ask something... (demo only)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isSending}
                  className="gap-1"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Use the last assistant reply to update your editor content or copy it.
              </p>
              <Button className="w-full gap-2" onClick={applyLastAssistantToDoc}>
                <CheckCircle className="h-4 w-4" />
                Apply Last Reply to Document
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={copyLastAssistant}
              >
                <Copy className="h-4 w-4" />
                Copy Last Reply
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
