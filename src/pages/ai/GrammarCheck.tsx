import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { useEditorStore } from '@/state/useEditorStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  Download,
  ArrowLeft,
  Send,
  Loader2,
  SpellCheck,
  Check,
  X,
  Eye,
  EyeOff,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GrammarIssue {
  id: string;
  type: 'spelling' | 'grammar' | 'punctuation' | 'style' | 'clarity';
  severity: 'error' | 'warning' | 'suggestion';
  text: string;
  position: { start: number; end: number };
  suggestion: string;
  explanation: string;
  category: string;
}

const GRAMMAR_CATEGORIES = [
  { id: 'all', label: 'All Issues', color: 'default' },
  { id: 'spelling', label: 'Spelling', color: 'destructive' },
  { id: 'grammar', label: 'Grammar', color: 'destructive' },
  { id: 'punctuation', label: 'Punctuation', color: 'secondary' },
  { id: 'style', label: 'Style', color: 'outline' },
  { id: 'clarity', label: 'Clarity', color: 'outline' },
];

export default function GrammarCheck() {
  const navigate = useNavigate();
  const { theme } = useUserStore();
  const { contentRef } = useEditorStore();
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCorrections, setShowCorrections] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    errors: 0,
    warnings: 0,
    suggestions: 0,
  });

  useEffect(() => {
    const filteredIssues = selectedCategory === 'all' 
      ? issues 
      : issues.filter(issue => issue.type === selectedCategory);
    
    setStats({
      total: filteredIssues.length,
      errors: filteredIssues.filter(i => i.severity === 'error').length,
      warnings: filteredIssues.filter(i => i.severity === 'warning').length,
      suggestions: filteredIssues.filter(i => i.severity === 'suggestion').length,
    });
  }, [issues, selectedCategory]);

  const handleGrammarCheck = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to check');
      return;
    }

    setIsProcessing(true);
    setIssues([]);

    // Simulate AI grammar checking
    setTimeout(() => {
      const result = simulateGrammarCheck(inputText);
      setIssues(result.issues);
      setCorrectedText(result.correctedText);
      setIsProcessing(false);
      toast.success(`Found ${result.issues.length} issues to review`);
    }, 2000);
  };

  const simulateGrammarCheck = (text: string) => {
    // Simulated grammar checking logic
    const mockIssues: GrammarIssue[] = [
      {
        id: '1',
        type: 'spelling',
        severity: 'error',
        text: 'recieve',
        position: { start: 10, end: 17 },
        suggestion: 'receive',
        explanation: 'Common spelling error - "receive" follows "i before e except after c"',
        category: 'Spelling',
      },
      {
        id: '2',
        type: 'grammar',
        severity: 'error',
        text: 'dont',
        position: { start: 25, end: 29 },
        suggestion: "don't",
        explanation: 'Missing apostrophe in contraction',
        category: 'Grammar',
      },
      {
        id: '3',
        type: 'punctuation',
        severity: 'warning',
        text: '.',
        position: { start: 45, end: 46 },
        suggestion: '.',
        explanation: 'Consider adding a space after punctuation',
        category: 'Punctuation',
      },
      {
        id: '4',
        type: 'style',
        severity: 'suggestion',
        text: 'very',
        position: { start: 60, end: 64 },
        suggestion: 'extremely',
        explanation: 'Consider using a stronger alternative to "very"',
        category: 'Style',
      },
    ];

    let correctedText = text;
    mockIssues.reverse().forEach(issue => {
      correctedText = correctedText.substring(0, issue.position.start) + 
                     issue.suggestion + 
                     correctedText.substring(issue.position.end);
    });

    return { issues: mockIssues, correctedText };
  };

  const applyCorrection = (issueId: string, apply: boolean) => {
    if (!apply) {
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
      toast.success('Correction dismissed');
      return;
    }

    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      setCorrectedText(prev => 
        prev.substring(0, issue.position.start) + 
        issue.suggestion + 
        prev.substring(issue.position.end)
      );
      setIssues(prev => prev.filter(i => i.id !== issueId));
      toast.success('Correction applied');
    }
  };

  const applyAllCorrections = () => {
    setIssues([]);
    toast.success('All corrections applied');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(correctedText);
    toast.success('Corrected text copied to clipboard!');
  };

  const handleApplyToDocument = () => {
    if (contentRef?.current) {
      contentRef.current.innerText = correctedText;
      toast.success('Corrected text applied to document!');
      navigate('/');
    }
  };

  const getIssueIcon = (type: GrammarIssue['type']) => {
    switch (type) {
      case 'spelling':
        return <SpellCheck className="h-4 w-4 text-red-500" />;
      case 'grammar':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'punctuation':
        return <XCircle className="h-4 w-4 text-yellow-500" />;
      case 'style':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'clarity':
        return <EyeOff className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: GrammarIssue['severity']) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'suggestion':
        return 'outline';
      default:
        return 'default';
    }
  };

  const filteredIssues = selectedCategory === 'all' 
    ? issues 
    : issues.filter(issue => issue.type === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
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
                <CheckCircle className="h-6 w-6 text-primary" />
                AI Grammar Check
              </h1>
              <p className="text-muted-foreground">Advanced grammar and spelling correction</p>
            </div>
          </div>
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Input Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text here for grammar checking..."
                  className="min-h-[300px] resize-none"
                />
                <Button
                  onClick={handleGrammarCheck}
                  disabled={isProcessing || !inputText.trim()}
                  className="w-full mt-4"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking Grammar...
                    </>
                  ) : (
                    <>
                      <SpellCheck className="h-4 w-4 mr-2" />
                      Check Grammar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            {issues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {GRAMMAR_CATEGORIES.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? category.color as any : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="text-xs"
                      >
                        {category.label}
                        {category.id === 'all' && ` (${issues.length})`}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center Panel - Issues */}
          {filteredIssues.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Issues Found ({stats.total})
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={applyAllCorrections}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Apply All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {filteredIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-start gap-3">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getSeverityColor(issue.severity) as any}>
                                  {issue.severity}
                                </Badge>
                                <span className="text-sm font-medium">{issue.category}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded border-l-4 border-red-500">
                                  <div className="font-mono text-sm">"{issue.text}"</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded border-l-4 border-green-500">
                                  <div className="font-mono text-sm">"{issue.suggestion}"</div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {issue.explanation}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => applyCorrection(issue.id, true)}
                                  className="flex-1"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Apply
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => applyCorrection(issue.id, false)}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Right Panel - Corrected Output */}
          {correctedText && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Corrected Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap">
                    {correctedText}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={handleCopyText}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleApplyToDocument}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply to Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Issues</span>
                      <Badge variant="outline">{stats.total}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Errors</span>
                      <Badge variant="destructive">{stats.errors}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Warnings</span>
                      <Badge variant="secondary">{stats.warnings}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Suggestions</span>
                      <Badge variant="outline">{stats.suggestions}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
