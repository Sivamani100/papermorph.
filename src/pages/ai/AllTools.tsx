import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  PenTool,
  CheckCircle,
  Languages,
  FileText,
  Brain,
  Zap,
  MessageSquare,
  Image,
  TrendingUp,
  BarChart3,
  Mic,
  Video,
  Headphones,
  Globe,
  BookOpen,
  Lightbulb,
  Target,
  Rocket,
  Star,
  Search,
  Filter,
  ArrowLeft,
  Crown,
  Lock,
  Play,
  Clock,
  Users,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  route: string;
  badge?: string;
  live: boolean;
  premium?: boolean;
  beta?: boolean;
  usageCount?: number;
  rating?: number;
  features: string[];
}

const AI_TOOLS: AITool[] = [
  {
    id: 'writing-assistant',
    name: 'Writing Assistant',
    description: 'AI-powered writing help with style suggestions and improvements',
    category: 'Writing',
    icon: PenTool,
    route: '/ai/writing-assistant',
    badge: 'Popular',
    live: true,
    usageCount: 15234,
    rating: 4.8,
    features: ['Style suggestions', 'Grammar check', 'Tone adjustment', 'Content improvement'],
  },
  {
    id: 'grammar-check',
    name: 'Grammar Check',
    description: 'Advanced grammar and spelling correction with explanations',
    category: 'Writing',
    icon: CheckCircle,
    route: '/ai/grammar-check',
    badge: 'Essential',
    live: true,
    usageCount: 28456,
    rating: 4.9,
    features: ['Grammar correction', 'Spelling check', 'Punctuation', 'Style suggestions'],
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'Multi-language translation with context awareness',
    category: 'Writing',
    icon: Languages,
    route: '/ai/translation',
    badge: 'New',
    live: true,
    beta: true,
    usageCount: 8921,
    rating: 4.6,
    features: ['50+ languages', 'Context aware', 'Idiom detection', 'Formal/informal tones'],
  },
  {
    id: 'summarization',
    name: 'Text Summarization',
    description: 'Condense long texts into concise summaries',
    category: 'Writing',
    icon: FileText,
    route: '/ai/summarization',
    live: true,
    usageCount: 12456,
    rating: 4.7,
    features: ['Key point extraction', 'Length control', 'Bullet points', 'Abstract generation'],
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze emotions and sentiment in text',
    category: 'Analysis',
    icon: Brain,
    route: '/ai/sentiment-analysis',
    live: true,
    usageCount: 6789,
    rating: 4.5,
    features: ['Emotion detection', 'Sentiment scoring', 'Tone analysis', 'Confidence metrics'],
  },
  {
    id: 'keyword-extraction',
    name: 'Keyword Extraction',
    description: 'Extract important keywords and topics from text',
    category: 'Analysis',
    icon: Target,
    route: '/ai/keyword-extraction',
    live: false,
    usageCount: 0,
    rating: 0,
    features: ['Keyword ranking', 'Topic modeling', 'Relevance scoring', 'Frequency analysis'],
  },
  {
    id: 'text-analytics',
    name: 'Text Analytics',
    description: 'Comprehensive text analysis and insights',
    category: 'Analysis',
    icon: BarChart3,
    route: '/ai/text-analytics',
    badge: 'Pro',
    live: true,
    premium: true,
    usageCount: 3456,
    rating: 4.8,
    features: ['Readability score', 'Complexity analysis', 'Word frequency', 'Time to read'],
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Generate new content based on prompts and templates',
    category: 'Content',
    icon: Sparkles,
    route: '/ai/content-generator',
    badge: 'Popular',
    live: true,
    usageCount: 19876,
    rating: 4.7,
    features: ['Blog posts', 'Social media', 'Email templates', 'Product descriptions'],
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'Create AI-generated images from text descriptions',
    category: 'Content',
    icon: Image,
    route: '/ai/image-generator',
    badge: 'Coming Soon',
    live: false,
    usageCount: 0,
    rating: 0,
    features: ['Text to image', 'Style control', 'High resolution', 'Batch generation'],
  },
  {
    id: 'idea-generator',
    name: 'Idea Generator',
    description: 'Brainstorm creative ideas and concepts',
    category: 'Content',
    icon: Lightbulb,
    route: '/ai/idea-generator',
    live: true,
    usageCount: 9876,
    rating: 4.6,
    features: ['Creative prompts', 'Mind mapping', 'Concept expansion', 'Trending topics'],
  },
  {
    id: 'chat-assistant',
    name: 'Chat Assistant',
    description: 'AI conversation partner for help and guidance',
    category: 'Communication',
    icon: MessageSquare,
    route: '/ai/chat-assistant',
    badge: 'Live',
    live: true,
    usageCount: 25678,
    rating: 4.9,
    features: ['24/7 availability', 'Context memory', 'Multi-turn conversation', 'File analysis'],
  },
  {
    id: 'voice-assistant',
    name: 'Voice Assistant',
    description: 'Voice-powered AI assistant with speech recognition',
    category: 'Communication',
    icon: Mic,
    route: '/ai/voice-assistant',
    live: false,
    usageCount: 0,
    rating: 0,
    features: ['Speech to text', 'Voice commands', 'Natural conversation', 'Accent support'],
  },
  {
    id: 'meeting-assistant',
    name: 'Meeting Assistant',
    description: 'AI for meeting notes, summaries, and action items',
    category: 'Communication',
    icon: Video,
    route: '/ai/meeting-assistant',
    badge: 'Coming Soon',
    live: false,
    usageCount: 0,
    rating: 0,
    features: ['Meeting transcription', 'Action items', 'Summary generation', 'Speaker identification'],
  },
];

const CATEGORIES = ['All', 'Writing', 'Analysis', 'Content', 'Communication'];
const FILTERS = ['All Tools', 'Live Only', 'Popular', 'New', 'Premium'];

export default function AllAIToolsPage() {
  const navigate = useNavigate();
  const { theme } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All Tools');

  const filteredTools = AI_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    
    let matchesFilter = true;
    if (selectedFilter === 'Live Only') matchesFilter = tool.live;
    if (selectedFilter === 'Popular') matchesFilter = tool.badge === 'Popular';
    if (selectedFilter === 'New') matchesFilter = tool.badge === 'New';
    if (selectedFilter === 'Premium') matchesFilter = tool.premium;
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const handleToolClick = (tool: AITool) => {
    if (tool.live) {
      navigate(tool.route);
    } else {
      toast.info('This tool is coming soon! Stay tuned for updates.');
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Popular': return 'default';
      case 'New': return 'secondary';
      case 'Pro': return 'destructive';
      case 'Live': return 'default';
      case 'Coming Soon': return 'outline';
      default: return 'outline';
    }
  };

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
                <Rocket className="h-6 w-6 text-primary" />
                All AI Tools
              </h1>
              <p className="text-muted-foreground">Complete collection of AI-powered tools</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {AI_TOOLS.filter(t => t.live).length} Live Tools
            </Badge>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{AI_TOOLS.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tools</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Play className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{AI_TOOLS.filter(t => t.live).length}</div>
                  <div className="text-sm text-muted-foreground">Live Tools</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{AI_TOOLS.filter(t => t.premium).length}</div>
                  <div className="text-sm text-muted-foreground">Premium Tools</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {AI_TOOLS.reduce((sum, t) => sum + (t.usageCount || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Uses</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search AI tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                {FILTERS.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className={cn(
                  'transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02]',
                  !tool.live && 'opacity-60',
                  tool.live && 'hover:border-primary/50'
                )}
                onClick={() => handleToolClick(tool)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-12 w-12 rounded-lg flex items-center justify-center',
                        tool.live ? 'bg-primary/10' : 'bg-gray-100'
                      )}>
                        <Icon className={cn(
                          'h-6 w-6',
                          tool.live ? 'text-primary' : 'text-gray-400'
                        )} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {tool.name}
                          {tool.live && (
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                          {tool.premium && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          {tool.beta && (
                            <Badge variant="secondary" className="text-xs">Beta</Badge>
                          )}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">{tool.category}</div>
                      </div>
                    </div>
                    {tool.badge && (
                      <Badge variant={getBadgeColor(tool.badge) as any} className="text-xs">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  
                  {tool.features.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {tool.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {tool.usageCount && tool.usageCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {tool.usageCount.toLocaleString()}
                        </div>
                      )}
                      {tool.rating && tool.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {tool.rating}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!tool.live && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Lock className="h-3 w-3" />
                          Coming Soon
                        </Badge>
                      )}
                      {tool.live && (
                        <Button size="sm" className="gap-1">
                          {tool.live ? (
                            <>
                              <Play className="h-3 w-3" />
                              Launch
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              Coming Soon
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-lg font-medium text-muted-foreground">No tools found</div>
            <div className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
