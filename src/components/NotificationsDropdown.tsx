import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Milestone Reached!',
    message: 'You\'ve created 10 documents this month. Keep up the great work!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    action: {
      label: 'View Stats',
      route: '/dashboard/stats',
    },
    priority: 'medium',
  },
  {
    id: '2',
    type: 'system',
    title: 'New Features Available',
    message: 'AI Writing Assistant has been enhanced with better grammar detection.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    action: {
      label: 'Try Now',
      route: '/ai/writing-assistant',
    },
    priority: 'high',
  },
  {
    id: '3',
    type: 'social',
    title: 'New Collaboration Request',
    message: 'John Doe invited you to collaborate on "Q4 Report 2024"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    action: {
      label: 'View Invitation',
      route: '/collaborations/john-doe-q4-report',
    },
    priority: 'medium',
  },
  {
    id: '4',
    type: 'info',
    title: 'Document Auto-saved',
    message: 'Your document "Project Proposal" was automatically saved.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: 'low',
  },
  {
    id: '5',
    type: 'success',
    title: 'Export Completed',
    message: 'Your document has been successfully exported to PDF format.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    action: {
      label: 'Download',
      onClick: () => toast.success('Download started!'),
    },
    priority: 'low',
  },
];

export function NotificationsDropdown() {
  const navigate = useNavigate();
  const { theme } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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

  return (
    <DropdownMenu onOpenChange={setIsOpening}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            'gap-2 h-8 px-2.5 transition-all duration-200 group relative',
            theme === 'dark' 
              ? 'hover:bg-gray-800 text-white' 
              : 'hover:bg-gray-100 text-gray-900'
          )}
          title="Notifications"
        >
          <Bell className={cn(
            'h-6 w-6 transition-transform duration-200',
            isOpening && 'rotate-12'
          )} />
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
          {unreadCount > 0 && (
            <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-96 overflow-y-auto"
        sideOffset={8}
      >
        <div className="px-2 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium text-sm">Notifications</div>
                <div className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 px-2 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications/settings')}
                className="h-7 w-7 p-0"
                title="Notification settings"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">No notifications</div>
              <div className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={cn(
                    'gap-3 py-3 px-3 cursor-pointer transition-colors',
                    !notification.read && 'bg-primary/5',
                    'hover:bg-muted/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </div>
                        {notification.action && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary hover:text-primary/80 mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
                {notification.id !== notifications[notifications.length - 1].id && (
                  <DropdownMenuSeparator />
                )}
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigate('/notifications')}
          className="gap-3 py-2 px-3 cursor-pointer hover:bg-muted/50"
        >
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <Archive className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">View All Notifications</div>
            <div className="text-xs text-muted-foreground">See your complete notification history</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
