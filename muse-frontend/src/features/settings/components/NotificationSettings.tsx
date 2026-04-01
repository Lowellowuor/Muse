import { Bell, Mail, Smartphone, MessageCircle, Heart, UserPlus, Award, Newspaper, Zap } from 'lucide-react';
import { NotificationSettings as NotificationSettingsType } from '../types';

interface Props {
  notifications: NotificationSettingsType;
  onUpdate: (updates: Partial<NotificationSettingsType>) => void;
}

const notificationOptions = [
  { key: 'notifyOnReply', label: 'New replies to my threads', icon: MessageCircle },
  { key: 'notifyOnLike', label: 'Likes on my content', icon: Heart },
  { key: 'notifyOnFollow', label: 'New followers', icon: UserPlus },
  { key: 'notifyOnAchievement', label: 'Achievement unlocks', icon: Award },
  { key: 'weeklyDigest', label: 'Weekly digest', icon: Newspaper },
  { key: 'productUpdates', label: 'Product updates', icon: Zap },
];

export default function NotificationSettings({ notifications, onUpdate }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Notifications</h3>
      </div>

      <div className="space-y-4">
        {/* Global Toggles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Email Notifications</span>
            </div>
            <button
              onClick={() => onUpdate({ emailNotifications: !notifications.emailNotifications })}
              className={`w-10 h-5 rounded-full transition ${notifications.emailNotifications ? 'bg-white' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Push Notifications</span>
            </div>
            <button
              onClick={() => onUpdate({ pushNotifications: !notifications.pushNotifications })}
              className={`w-10 h-5 rounded-full transition ${notifications.pushNotifications ? 'bg-white' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${notifications.pushNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">In-App Notifications</span>
            </div>
            <button
              onClick={() => onUpdate({ inAppNotifications: !notifications.inAppNotifications })}
              className={`w-10 h-5 rounded-full transition ${notifications.inAppNotifications ? 'bg-white' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${notifications.inAppNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-gray-400 mb-3">Notify me about:</p>
          <div className="space-y-2">
            {notificationOptions.map(option => {
              const Icon = option.icon;
              const isEnabled = notifications[option.key as keyof NotificationSettingsType] as boolean;
              return (
                <div key={option.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-300">{option.label}</span>
                  </div>
                  <button
                    onClick={() => onUpdate({ [option.key]: !isEnabled })}
                    className={`w-8 h-4 rounded-full transition ${isEnabled ? 'bg-white' : 'bg-white/20'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-black transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}