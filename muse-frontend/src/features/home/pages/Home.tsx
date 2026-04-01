import { useState, useEffect } from 'react';
import { useHomeStore } from '../store/useHomeStore';
import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import RecentActivity from '../components/RecentActivity';
import TrendingSection from '../components/TrendingSection';
import AIInsights from '../components/AIInsights';
import StreakTracker from '../components/StreakTracker';
import SmartSuggestions from '../components/SmartSuggestions';
import { motion } from 'framer-motion';

export default function Home() {
  const { stats, recentActivities, trendingItems, fetchHomeData } = useHomeStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <HeroSection greeting={greeting} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 px-6 md:px-16">
        {/* Left Column - Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <StatsCards stats={stats} />
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Right Column - Insights & Tracking */}
        <div className="space-y-6">
          <StreakTracker 
            streak={stats.streak}
            longestStreak={stats.longestStreak}
            weeklyProgress={stats.weeklyProgress}
            weeklyGoal={stats.weeklyGoal}
          />
          <AIInsights stats={{ streak: stats.streak, totalWords: stats.totalWords }} />
        </div>
      </div>

      {/* Bottom Section - Trending & Suggestions */}
      <div className="grid md:grid-cols-2 gap-6 mt-6 px-6 md:px-16 pb-16">
        <TrendingSection items={trendingItems} />
        <SmartSuggestions />
      </div>
    </div>
  );
}