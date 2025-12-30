import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Check,
  X,
  Settings,
  Archive,
  Trash2,
  Star,
  AlertCircle,
  Info,
  CheckCircle,
  TrendingUp,
  FileText,
  MessageSquare,
  Users,
  Zap,
  Crown,
  Gift,
  Calendar,
  Download,
  Upload,
  Shield,
  Heart,
  Award,
  Target,
  Search,
  Filter,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    route?: string;
    onClick?: () => void;
  };
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Milestone Reached!',
    message: 'You\'ve created 10 documents this month. Keep up the great work!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    action: {
      label: 'View Stats',
      route: '/dashboard/stats',
    },
    priority: 'medium',
    category: 'Achievements',
  },
  {
    id: '2',
    type: 'system',
    title: 'New Features Available',
    message: 'AI Writing Assistant has been enhanced with better grammar detection.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    action: {
      label: 'Try Now',
      route: '/ai/writing-assistant',
    },
    priority: 'high',
    category: 'System Updates',
  },
  {
    id: '3',
    type: 'social',
    title: 'New Collaboration Request',
    message: 'John Doe invited you to collaborate on "Q4 Report 2024"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    action: {
      label: 'View Invitation',
      route: '/collaborations/john-doe-q4-report',
    },
    priority: 'medium',
    category: 'Collaborations',
  },
  {
    id: '4',
    type: 'info',
    title: 'Document Auto-saved',
    message: 'Your document "Project Proposal" was automatically saved.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    priority: 'low',
    category: 'Documents',
  },
  {
    id: '5',
    type: 'success',
    title: 'Export Completed',
    message: 'Your document has been successfully exported to PDF format.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
    action: {
      label: 'Download',
      onClick: () => toast.success('Download started!'),
    },
    priority: 'low',
    category: 'Exports',
  },
];

const CATEGORIES = ['All', 'Achievements', 'System Updates', 'Collaborations', 'Documents', 'Exports'];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { theme } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'social':
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.action?.route) {
      navigate(notification.action.route);
    } else if (notification.action?.onClick) {
      notification.action.onClick();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'All' || notification.category === selectedCategory;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <Bell className="h-6 w-6 text-primary" />
                All Notifications
              </h1>
              <p className="text-muted-foreground">Manage your notifications and updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Mark All Read
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/notifications/settings')}
              className="gap-2"
            >
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
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{unreadCount}</div>
                  <div className="text-sm text-muted-foreground">Unread</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {notifications.filter(n => n.type === 'achievement').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {notifications.filter(n => n.priority === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
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
                    placeholder="Search notifications..."
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
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notifications ({filteredNotifications.length})</span>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-medium text-muted-foreground">No notifications found</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {searchQuery || selectedCategory !== 'All' 
                      ? 'Try adjusting your filters' 
                      : 'You\'re all caught up!'}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md',
                        !notification.read && 'bg-primary/5 border-primary/20',
                        notification.read && 'bg-card'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-primary rounded-full" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                {notification.action && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationClick(notification);
                                    }}
                                  >
                                    {notification.action.label}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
