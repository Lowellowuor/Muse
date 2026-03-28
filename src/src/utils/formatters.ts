// Date formatting
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};

export const formatTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return ${mins}m ago;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return ${hours}h ago;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return ${days}d ago;
  return formatDate(timestamp);
};

// Word count
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Reading time
export const getReadingTime = (wordCount: number): number => {
  return Math.max(1, Math.ceil(wordCount / 200));
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};