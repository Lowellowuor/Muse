import { motion } from 'framer-motion';
import { Achievement } from '../types';
import { getAchievementIcon } from '../store/useProfileStore';

interface Props {
  achievements: Achievement[];
}

export default function AchievementsGrid({ achievements }: Props) {
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Achievements</h3>
        <span className="text-xs text-gray-400">{unlocked.length} / {achievements.length} unlocked</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {achievements.map((achievement, index) => {
          const Icon = getAchievementIcon(achievement.icon);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-xl text-center transition ${
                achievement.unlockedAt
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/5 border border-white/10 opacity-50'
              }`}
            >
              <Icon size={24} className="text-white mx-auto mb-2" />
              <p className="text-xs font-medium text-white">{achievement.title}</p>
              <p className="text-[9px] text-gray-500 mt-1 line-clamp-2">{achievement.description}</p>
              
              {achievement.progress < achievement.target && (
                <div className="mt-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-[8px] text-gray-600 mt-1">
                    {achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()}
                  </p>
                </div>
              )}
              
              {achievement.unlockedAt && (
                <p className="text-[8px] text-green-400 mt-1">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}