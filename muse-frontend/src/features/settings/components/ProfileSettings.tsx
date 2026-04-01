import { useState, useRef } from 'react';
import { User, Mail, MapPin, Link as LinkIcon, Twitter, Github, Camera } from 'lucide-react';
import { ProfileSettings as ProfileSettingsType } from '../types';

interface Props {
  profile: ProfileSettingsType;
  onUpdate: (updates: Partial<ProfileSettingsType>) => void;
}

export default function ProfileSettings({ profile, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleChange = (key: keyof ProfileSettingsType, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-white" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Profile Information</h3>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-3 py-1 text-xs bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">{profile.displayName.charAt(0)}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1 bg-white rounded-full text-black opacity-0 group-hover:opacity-100 transition"
            >
              <Camera size={10} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Profile Picture</p>
            <p className="text-[10px] text-gray-500">Click the camera icon to upload</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Display Name</label>
            <input
              type="text"
              value={isEditing ? formData.displayName : profile.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Username</label>
            <input
              type="text"
              value={isEditing ? formData.username : profile.username}
              onChange={(e) => handleChange('username', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={isEditing ? formData.email : profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Location</label>
            <input
              type="text"
              value={isEditing ? formData.location : profile.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400 block mb-1">Bio</label>
            <textarea
              value={isEditing ? formData.bio : profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Website</label>
            <input
              type="text"
              value={isEditing ? formData.website : profile.website}
              onChange={(e) => handleChange('website', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Twitter</label>
            <input
              type="text"
              value={isEditing ? formData.twitter : profile.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
              disabled={!isEditing}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}