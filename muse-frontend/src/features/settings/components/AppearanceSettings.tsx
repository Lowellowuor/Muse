import { Monitor, Sun, Moon, Type, Minus, Plus, Layout, Sparkles, Eye } from 'lucide-react';
import { AppearanceSettings as AppearanceSettingsType } from '../types';

interface Props {
  appearance: AppearanceSettingsType;
  onUpdate: (updates: Partial<AppearanceSettingsType>) => void;
}

const accentColors = [
  { name: 'cyan', class: 'bg-cyan-400' },
  { name: 'blue', class: 'bg-blue-400' },
  { name: 'purple', class: 'bg-purple-400' },
  { name: 'pink', class: 'bg-pink-400' },
  { name: 'green', class: 'bg-green-400' },
  { name: 'yellow', class: 'bg-yellow-400' },
  { name: 'red', class: 'bg-red-400' },
  { name: 'white', class: 'bg-white' },
];

export default function AppearanceSettings({ appearance, onUpdate }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Layout size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Appearance</h3>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Theme</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ theme: 'light' })}
              className={`flex-1 p-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                appearance.theme === 'light' ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <Sun size={16} /> Light
            </button>
            <button
              onClick={() => onUpdate({ theme: 'dark' })}
              className={`flex-1 p-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                appearance.theme === 'dark' ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <Moon size={16} /> Dark
            </button>
            <button
              onClick={() => onUpdate({ theme: 'system' })}
              className={`flex-1 p-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                appearance.theme === 'system' ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <Monitor size={16} /> System
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Accent Color</label>
          <div className="flex gap-2 flex-wrap">
            {accentColors.map(color => (
              <button
                key={color.name}
                onClick={() => onUpdate({ accentColor: color.name })}
                className={`w-8 h-8 rounded-full ${color.class} ${
                  appearance.accentColor === color.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Font Size</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ fontSize: 'small' })}
              className={`flex-1 p-2 rounded-xl text-sm ${
                appearance.fontSize === 'small' ? 'bg-white text-black' : 'bg-white/10'
              }`}
            >
              <Type size={14} className="inline mr-1" /> Small
            </button>
            <button
              onClick={() => onUpdate({ fontSize: 'medium' })}
              className={`flex-1 p-2 rounded-xl text-base ${
                appearance.fontSize === 'medium' ? 'bg-white text-black' : 'bg-white/10'
              }`}
            >
              <Type size={16} className="inline mr-1" /> Medium
            </button>
            <button
              onClick={() => onUpdate({ fontSize: 'large' })}
              className={`flex-1 p-2 rounded-xl text-lg ${
                appearance.fontSize === 'large' ? 'bg-white text-black' : 'bg-white/10'
              }`}
            >
              <Type size={18} className="inline mr-1" /> Large
            </button>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Compact Mode</span>
            </div>
            <button
              onClick={() => onUpdate({ compactMode: !appearance.compactMode })}
              className={`w-10 h-5 rounded-full transition ${appearance.compactMode ? 'bg-white' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${appearance.compactMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Animations</span>
            </div>
            <button
              onClick={() => onUpdate({ animations: !appearance.animations })}
              className={`w-10 h-5 rounded-full transition ${appearance.animations ? 'bg-white' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${appearance.animations ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}