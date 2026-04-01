import { Shield, Eye, Globe, Key} from 'lucide-react';
import { PrivacySecuritySettings } from '../types';

interface Props {
  privacy: PrivacySecuritySettings;
  onUpdate: (updates: Partial<PrivacySecuritySettings>) => void;
}

export default function PrivacySecurity({ privacy, onUpdate }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Privacy & Security</h3>
      </div>

      <div className="space-y-4">
        {/* Account Visibility */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Account Visibility</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {privacy.accountVisibility === 'public' ? 'Anyone can see your profile and content' : 'Only approved followers can see your content'}
            </p>
          </div>
          <button
            onClick={() => onUpdate({ accountVisibility: privacy.accountVisibility === 'public' ? 'private' : 'public' })}
            className={`px-3 py-1 text-xs rounded-lg transition ${
              privacy.accountVisibility === 'public' ? 'bg-white text-black' : 'bg-white/10 text-white'
            }`}
          >
            {privacy.accountVisibility === 'public' ? 'Public' : 'Private'}
          </button>
        </div>

        {/* Show Email */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" />
            <span className="text-sm text-gray-300">Show email on profile</span>
          </div>
          <button
            onClick={() => onUpdate({ showEmailInProfile: !privacy.showEmailInProfile })}
            className={`w-10 h-5 rounded-full transition ${privacy.showEmailInProfile ? 'bg-white' : 'bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-black transition-transform ${privacy.showEmailInProfile ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Search Indexing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-gray-400" />
            <span className="text-sm text-gray-300">Allow search engines to index</span>
          </div>
          <button
            onClick={() => onUpdate({ allowSearchIndexing: !privacy.allowSearchIndexing })}
            className={`w-10 h-5 rounded-full transition ${privacy.allowSearchIndexing ? 'bg-white' : 'bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-black transition-transform ${privacy.allowSearchIndexing ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Two-Factor Auth */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Key size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Two-Factor Authentication</span>
            </div>
            <p className="text-[10px] text-gray-500">Add an extra layer of security</p>
          </div>
          <button
            onClick={() => onUpdate({ twoFactorEnabled: !privacy.twoFactorEnabled })}
            className={`px-3 py-1 text-xs rounded-lg transition ${
              privacy.twoFactorEnabled ? 'bg-green-500 text-white' : 'bg-white/10 text-white'
            }`}
          >
            {privacy.twoFactorEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {/* Change Password Button */}
        <button className="w-full mt-2 py-2 text-sm bg-white/10 border border-white/10 rounded-xl text-white hover:bg-white/20 transition">
          Change Password
        </button>
      </div>
    </div>
  );
}