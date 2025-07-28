
import React, { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { NotificationsList } from './NotificationsList';
import { useAuth } from './AuthProvider';
import { Link } from 'react-router-dom';

const LoggedInNotifications = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = React.useState(false);

    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            const unreadIds = notifications?.filter(n => !n.is_read).map(n => n.id) ?? [];
            if(unreadIds.length > 0) {
                setTimeout(() => {
                    markAsRead(unreadIds);
                }, 2000);
            }
        }
    }, [isOpen, unreadCount, notifications, markAsRead]);


    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-600 rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
                <div className="p-3 font-medium text-sm border-b">Notifications</div>
                <NotificationsList />
            </PopoverContent>
        </Popover>
    );
};

export const NotificationsPopover = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Link to="/profile" title="Login to see notifications">
                <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-5 w-5" />
                </Button>
            </Link>
        );
    }

    return <LoggedInNotifications />;
};
