import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants';
import {
  FileText,
  Sparkles,
  Layout,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Check,
  Play,
} from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Writing',
      description:
        'Generate content, rewrite text, fix grammar, and more with advanced AI assistance.',
    },
    {
      icon: Layout,
      title: 'Professional Templates',
      description:
        'Choose from 50+ professionally designed templates for any document type.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Real-time editing with instant AI responses and seamless collaboration.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Your documents are encrypted and never used for AI training.',
    },
    {
      icon: Globe,
      title: 'Work Anywhere',
      description:
        'Access your documents from any device, anytime, anywhere.',
    },
    {
      icon: FileText,
      title: 'Export Options',
      description:
        'Export to DOCX, PDF, or PowerPoint with perfect formatting.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">{APP_NAME}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Document Editor
            </div>
            <h1 className="text-heading-main text-foreground mb-6 leading-tight">
              Write Better Documents{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-orange-500">
                with AI
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {APP_NAME} combines the power of a professional document editor with
              advanced AI to help you write faster, clearer, and more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="xl" className="gap-2 w-full sm:w-auto">
                  Start Writing Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="xl" variant="outline" className="gap-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative aspect-[16/10] rounded-2xl bg-gradient-to-br from-card to-muted border border-border shadow-elevated overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="absolute inset-4 rounded-xl bg-card border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Editor Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-heading-section text-foreground mb-4">
              Everything you need to write amazing documents
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create professional documents in
              minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const gradients = [
                'bg-gradient-to-br from-red-600 via-rose-500 to-orange-500',
                'bg-gradient-to-br from-blue-500 to-cyan-500',
                'bg-gradient-to-br from-purple-500 to-pink-500',
                'bg-gradient-to-br from-green-500 to-emerald-500',
                'bg-gradient-to-br from-blue-500 to-cyan-500',
                'bg-gradient-to-br from-purple-500 to-pink-500',
              ];
              return (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-soft transition-all"
              >
                  <div className={`h-12 w-12 rounded-xl ${gradients[index]} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                </div>
                  <h3 className="text-heading-card text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-3xl p-12 border border-border text-center">
            <h2 className="text-heading-section text-foreground mb-4">
              Ready to transform your writing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of professionals who use {APP_NAME} to create better
              documents in less time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {['No credit card required', 'Free forever plan', 'Cancel anytime'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
