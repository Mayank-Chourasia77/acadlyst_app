
import React from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThumbsUp, Award, Flag, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'new_vote':
            return <ThumbsUp className="h-5 w-5 text-blue-500" />;
        case 'new_badge':
            return <Award className="h-5 w-5 text-yellow-500" />;
        case 'content_flagged':
            return <Flag className="h-5 w-5 text-red-500" />;
        default:
            return <Bell className="h-5 w-5 text-gray-500" />;
    }
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
    let content: React.ReactNode = "You have a new notification.";
    let linkTo = "/profile";

    if (notification.type === 'new_vote' && notification.data && typeof notification.data === 'object' && 'upload_title' in notification.data) {
        const data = notification.data as { upload_title?: string };
        content = <>Someone upvoted your post: <strong>{data.upload_title || 'a post'}</strong></>;
        linkTo = "/notes"; 
    } else if (notification.type === 'new_badge' && notification.data && typeof notification.data === 'object' && 'badge_type' in notification.data) {
        const data = notification.data as { badge_type?: string };
        content = <>You've earned a new badge: <strong>{data.badge_type || 'New Badge'}</strong>!</>;
        linkTo = "/profile";
    } else if (notification.type === 'content_flagged' && notification.data && typeof notification.data === 'object' && 'upload_title' in notification.data) {
        const data = notification.data as { upload_title?: string };
        content = <>Your post "<strong>{data.upload_title || 'a post'}</strong>" was flagged.</>;
        linkTo = "/notes"; 
    }

    return (
        <Link to={linkTo} className="block hover:bg-gray-50">
            <div className={`p-3 flex items-start space-x-4 border-b ${!notification.is_read ? 'bg-blue-50' : 'bg-white'}`}>
                <NotificationIcon type={notification.type} />
                <div className="flex-1">
                    <p className="text-sm text-gray-700">{content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export const NotificationsList = () => {
    const { notifications, isLoading, error } = useNotifications();

    if (isLoading) {
        return <div className="p-4 text-center text-sm text-gray-500">Loading notifications...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-sm text-red-500">Could not load notifications.</div>;
    }

    if (!notifications || notifications.length === 0) {
        return <div className="p-4 text-center text-sm text-gray-500">No notifications yet.</div>;
    }

    return (
        <ScrollArea className="h-80">
            <div className='flex flex-col'>
                {notifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        </ScrollArea>
    );
};
