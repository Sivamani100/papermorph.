import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { FileText } from 'lucide-react';
import { APP_NAME } from '@/constants';
import FeaturesShowcase from '@/components/FeaturesShowcase';

export default function FeaturesGallery() {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">{APP_NAME}</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>

          <div className="h-6 w-px bg-border" />

          <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden md:block text-sm">
                  {user?.name || 'Guest'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="text-heading-section mb-3">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Papermorph Features Gallery
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore all the interactive and animated features we've built to bring your documents to life.
            From custom themes to interactive diagrams, everything is designed for a smooth user experience.
          </p>
        </div>

        {/* Features Showcase */}
        <FeaturesShowcase />

        {/* Call to Action */}
        <div className="mt-12 p-6 rounded-xl border border-border bg-card text-center animate-fade-in">
          <h2 className="text-xl font-semibold mb-3">Ready to Create?</h2>
          <p className="text-muted-foreground mb-4">
            Dive into the editor and experience all these features in action.
          </p>
          <Button onClick={() => navigate('/editor')} size="lg" className="gap-2">
            Go to Editor
          </Button>
        </div>
      </main>
    </div>
  );
}
