import { useEffect, useState } from 'react';
import { Brain, Sparkles, BarChart3, Lightbulb, Target, RefreshCw, Clock } from 'lucide-react';
import { useCreateStore, templates } from '../store/useCreateStore';
import WritingAnalytics from '../components/WritingAnalytics';
import MoodTrendChart from '../components/MoodTrendChart';
import PatternRecognition from '../components/PatternRecognition';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import ProgressTracker from '../components/ProgressTracker';
import CreativityScore from '../components/CreativityScore';
import WeeklyDigest from '../components/WeeklyDigest';
import ActionableTips from '../components/ActionableTips';
import { motion } from 'framer-motion';

type Tab = 'overview' | 'patterns' | 'recommendations' | 'progress';

export default function Insights() {
  const { 
    writingAnalytics, 
    moodTrends, 
    patterns, 
    recommendations, 
    progressMetrics,
    weeklyDigest,
    creativityScore,
    actionableTips,
    isLoading,
    lastUpdated,
    fetchAllInsights,
    refreshInsights,
    markTipCompleted,
    getCreativityTrend
  } = useInsightsStore();

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetchAllInsights();
  }, []);

  const trend = getCreativityTrend();

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Sparkles },
    { id: 'patterns' as Tab, label: 'Patterns', icon: BarChart3 },
    { id: 'recommendations' as Tab, label: 'Recommendations', icon: Lightbulb },
    { id: 'progress' as Tab, label: 'Progress', icon: Target },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Brain size={48} className="text-white/20 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Analyzing your creative patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={28} className="text-white" />
              <h1 className="text-4xl font-bold text-white">AI Insights</h1>
            </div>
            <p className="text-gray-400">Neural analysis of your creative patterns</p>
          </div>
          <button
            onClick={refreshInsights}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Insights
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Clock size={12} className="text-gray-600" />
          <span className="text-xs text-gray-600">Last updated: {new Date(lastUpdated || '').toLocaleString()}</span>
        </div>
      </div>

      {/* Creativity Score */}
      {creativityScore && (
        <div className="mb-8">
          <CreativityScore score={creativityScore} trend={trend} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {weeklyDigest && <WeeklyDigest digest={weeklyDigest} />}
          {writingAnalytics && <WritingAnalytics analytics={writingAnalytics} />}
          {moodTrends && <MoodTrendChart trends={moodTrends} />}
        </motion.div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {patterns && <PatternRecognition patterns={patterns} />}
        </motion.div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {recommendations && <PersonalizedRecommendations recommendations={recommendations} />}
        </motion.div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {progressMetrics && <ProgressTracker metrics={progressMetrics} />}
          {actionableTips && (
            <ActionableTips tips={actionableTips} onComplete={markTipCompleted} />
          )}
        </motion.div>
      )}
    </div>
  );
}