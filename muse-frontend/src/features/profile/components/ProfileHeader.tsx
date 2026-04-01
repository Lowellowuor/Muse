import { useState, useRef } from 'react';
import { Camera, MapPin, Calendar, Link as LinkIcon, Twitter, Github } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateAvatar: (avatar: string) => void;
}

export default function ProfileHeader({ profile, onUpdateProfile, onUpdateAvatar }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(profile.bio);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBio = () => {
    onUpdateProfile({ bio: editBio });
    setIsEditing(false);
  };

  const joinDate = new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-32 md:h-48 rounded-2xl bg-gradient-to-r from-white/10 to-white/5" />
      
      {/* Avatar Section */}
      <div className="relative px-6">
        <div className="absolute -top-12 left-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border-4 border-black flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{profile.name.charAt(0)}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full text-black opacity-0 group-hover:opacity-100 transition"
            >
              <Camera size={12} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>
        
        {/* Edit Profile Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-1.5 text-sm bg-white/10 border border-white/10 rounded-xl text-white hover:bg-white/20 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 mt-4">
        <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
        <p className="text-sm text-gray-400">{profile.username}</p>
        
        {isEditing ? (
          <div className="mt-3 space-y-3">
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Write your bio..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/40"
            />
            <button
              onClick={handleSaveBio}
              className="px-4 py-1.5 text-sm bg-white text-black rounded-xl font-medium hover:bg-white/90 transition"
            >
              Save Bio
            </button>
          </div>
        ) : (
          <p className="text-gray-300 text-sm mt-3 max-w-2xl">{profile.bio}</p>
        )}
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Joined {joinDate}</span>
          </div>
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition">
              <LinkIcon size={14} />
              <span>Website</span>
            </a>
          )}
          {profile.twitter && (
            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition">
              <Twitter size={14} />
              <span>Twitter</span>
            </a>
          )}
          {profile.github && (
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition">
              <Github size={14} />
              <span>GitHub</span>
            </a>
          )}
        </div>
        
        {/* Creative Statement */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 border-l-2 border-cyan-400">
          <p className="text-xs text-cyan-400 italic">"{profile.creativeStatement}"</p>
        </div>
      </div>
    </div>
  );
}