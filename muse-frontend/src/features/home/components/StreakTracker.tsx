// src/features/home/components/StreakTracker.tsx
import { Flame, Calendar, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  streak: number;
  longestStreak: number;
  weeklyProgress: number;
  weeklyGoal: number;
}

export default function StreakTracker({ streak, longestStreak, weeklyProgress, weeklyGoal }: Props) {
  const progressPercentage = (weeklyProgress / weeklyGoal) * 100;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [true, true, true, false, true, true, false];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-orange-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Your Streak</h3>
      </div>
      
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <Flame size={32} className="text-orange-400" />
          <p className="text-4xl font-bold text-white">{streak}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1">Current streak • Longest: {longestStreak} days</p>
      </div>
      
      <div className="flex justify-between mb-4">
        {days.map((day, i) => (
          <div key={day} className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
              activeDays[i] ? 'bg-white text-black' : 'bg-white/10 text-gray-500'
            }`}>
              {day}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400 flex items-center gap-1">
            <Target size={14} /> Weekly Goal
          </span>
          <span className="text-white">{weeklyProgress.toLocaleString()} / {weeklyGoal.toLocaleString()} words</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full"
          />
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <TrendingUp size={10} /> {Math.round(progressPercentage)}% complete
          </span>
        </div>
      </div>
    </div>
  );
}