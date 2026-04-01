import { Brain, Sparkles, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  threadId: string;
  aiSummary?: string;
  sentiment?: { score: number; label: string; confidence: number };
  onGenerateSummary: () => Promise<void>;
  onAnalyzeSentiment: () => Promise<void>;
}

export default function ThreadInsights({ 
  threadId, 
  aiSummary, 
  sentiment, 
  onGenerateSummary, 
  onAnalyzeSentiment 
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    await onGenerateSummary();
    setIsGenerating(false);
  };

  const handleAnalyzeSentiment = async () => {
    setIsAnalyzing(true);
    await onAnalyzeSentiment();
    setIsAnalyzing(false);
  };

  const getSentimentColor = () => {
    if (!sentiment) return 'text-gray-400';
    if (sentiment.label === 'positive') return 'text-emerald-400';
    if (sentiment.label === 'negative') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentBadgeColor = () => {
    if (!sentiment) return 'bg-gray-500/20';
    if (sentiment.label === 'positive') return 'bg-emerald-500/20 border-emerald-500/30';
    if (sentiment.label === 'negative') return 'bg-red-500/20 border-red-500/30';
    return 'bg-yellow-500/20 border-yellow-500/30';
  };

  return (
    <div className="space-y-4">
      {/* AI Summary */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-white" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">AI Summary</h3>
          </div>
          {!aiSummary && (
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              <Sparkles size={12} />
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          )}
        </div>
        {aiSummary ? (
          <div>
            <p className="text-sm text-gray-300 leading-relaxed">{aiSummary}</p>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="mt-2 text-[10px] text-gray-500 hover:text-white transition"
            >
              Regenerate
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Click generate to get an AI-powered summary of this discussion.</p>
        )}
      </div>
      
      {/* Sentiment Analysis */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-white" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Sentiment Analysis</h3>
          </div>
          {!sentiment && (
            <button
              onClick={handleAnalyzeSentiment}
              disabled={isAnalyzing}
              className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              <Sparkles size={12} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          )}
        </div>
        {sentiment ? (
          <div className="space-y-3">
            <div className={`px-2 py-1 rounded-full text-center ${getSentimentBadgeColor()} border`}>
              <span className={`text-xs font-medium ${getSentimentColor()} capitalize`}>
                {sentiment.label} Sentiment
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Confidence Score</span>
              <span className="text-sm text-white">{Math.round(sentiment.confidence * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  sentiment.label === 'positive' ? 'bg-emerald-500' : 
                  sentiment.label === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${sentiment.confidence * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Sentiment Score</span>
              <span className={`text-sm font-medium ${getSentimentColor()}`}>
                {sentiment.score > 0 ? '+' : ''}{sentiment.score.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Analyze the sentiment of this discussion to see community tone.</p>
        )}
      </div>
    </div>
  );
}