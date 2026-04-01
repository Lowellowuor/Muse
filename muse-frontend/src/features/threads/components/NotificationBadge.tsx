import { useState, useEffect, useRef } from 'react';
import { Bell, MessageCircle, Heart, CheckCircle, AtSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead?: () => void;
  onNavigate: (path: string) => void;
}

export default function NotificationBadge({ 
  notifications, 
  unreadCount, 
  onMarkRead, 
  onMarkAllRead,
  onNavigate 
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <MessageCircle size={14} className="text-cyan-400" />;
      case 'like':
        return <Heart size={14} className="text-red-400" />;
      case 'answer':
        return <CheckCircle size={14} className="text-emerald-400" />;
      case 'mention':
        return <AtSign size={14} className="text-purple-400" />;
      default:
        return <Bell size={14} className="text-gray-400" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'reply':
        return `${notification.fromUser.name} replied to "${notification.threadTitle}"`;
      case 'like':
        return `${notification.fromUser.name} liked your thread "${notification.threadTitle}"`;
      case 'answer':
        return `Your question "${notification.threadTitle}" has an accepted answer`;
      case 'mention':
        return `${notification.fromUser.name} mentioned you in "${notification.threadTitle}"`;
      default:
        return `New activity in "${notification.threadTitle}"`;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onMarkRead(notification.id);
    onNavigate(`/threads/${notification.threadId}`);
    setIsOpen(false);
  };

  const timeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
      >
        <Bell size={18} className="text-gray-400 hover:text-white transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-[#111318] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-white" />
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full text-[10px] font-medium">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-600 mt-1">When someone interacts with your threads, you'll see it here</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification, index) => (
                    <motion.button
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-4 hover:bg-white/5 transition group ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            !notification.read ? 'bg-white/10' : 'bg-white/5'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                            {getNotificationMessage(notification)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-500">
                              {timeAgo(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 bg-white/5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('/notifications');
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-white transition"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}