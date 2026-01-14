import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Zap, 
  Copy, 
  Download, 
  RefreshCw,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

const Summarization = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryLength, setSummaryLength] = useState<'brief' | 'medium' | 'detailed'>('medium');
  const [summaryStyle, setSummaryStyle] = useState<'professional' | 'casual' | 'academic'>('professional');

  const handleGenerateSummary = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock summary generation
      const mockSummary = generateMockSummary(inputText, summaryLength, summaryStyle);
      setSummary(mockSummary);
      toast.success('Summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockSummary = (text: string, length: string, style: string) => {
    const words = text.split(' ').length;
    let summaryLength = words * 0.3; // Default to 30% of original
    
    if (length === 'brief') summaryLength = words * 0.15;
    if (length === 'detailed') summaryLength = words * 0.5;

    const stylePrefix = style === 'academic' ? 'Research indicates that ' : 
                       style === 'professional' ? 'The analysis shows that ' : 
                       'Basically, ';
    
    return `${stylePrefix}the provided text discusses key concepts and main ideas. The content covers approximately ${words} words and has been processed to create a concise summary of about ${Math.round(summaryLength)} words. This summary captures the essential information while maintaining the core message and important details from the original text.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard');
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Text Summarization</h1>
          <p className="text-muted-foreground mt-2">
            Transform lengthy documents into concise, readable summaries
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Zap className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Original Text
            </CardTitle>
            <CardDescription>
              Paste or type the text you want to summarize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text here... (minimum 50 words for best results)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{inputText.split(' ').filter(word => word).length} words</span>
              <span>{inputText.length} characters</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Summary Length</label>
                <div className="flex gap-2">
                  {(['brief', 'medium', 'detailed'] as const).map((length) => (
                    <Button
                      key={length}
                      variant={summaryLength === length ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSummaryLength(length)}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Summary Style</label>
                <div className="flex gap-2">
                  {(['professional', 'casual', 'academic'] as const).map((style) => (
                    <Button
                      key={style}
                      variant={summaryStyle === style ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSummaryStyle(style)}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateSummary}
              disabled={!inputText.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Generated Summary
              </div>
              {summary && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadSummary}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              AI-generated summary of your text
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-4">
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {summary}
                  </div>
                </ScrollArea>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{summary.split(' ').filter(word => word).length} words</span>
                  <span>{Math.round((summary.split(' ').filter(word => word).length / inputText.split(' ').filter(word => word).length) * 100)}% of original</span>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <BookOpen className="w-12 h-12 mx-auto opacity-50" />
                  <p>Your summary will appear here</p>
                  <p className="text-sm">Enter text and click generate to begin</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Features & Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium">Intelligent Analysis</h4>
                <p className="text-sm text-muted-foreground">AI identifies key concepts and main ideas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium">Time Saving</h4>
                <p className="text-sm text-muted-foreground">Reduce reading time by up to 85%</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Customizable Output</h4>
                <p className="text-sm text-muted-foreground">Choose length and style preferences</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summarization;