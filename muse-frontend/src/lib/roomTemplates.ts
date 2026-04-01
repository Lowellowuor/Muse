import { RoomTemplate } from '../types';

export const roomTemplates: RoomTemplate[] = [
  {
    name: 'Idea Vault',
    description: 'Capture and develop creative concepts',
    icon: '💡',
    type: 'vault',
    suggestedTags: ['ideas', 'brainstorming', 'creativity']
  },
  {
    name: 'Mood Board',
    description: 'Visual inspiration and aesthetics',
    icon: '🎨',
    type: 'gallery',
    suggestedTags: ['inspiration', 'visual', 'design']
  },
  {
    name: 'Research Archive',
    description: 'Store and organize research materials',
    icon: '📚',
    type: 'archive',
    suggestedTags: ['research', 'learning', 'reference']
  },
  {
    name: 'Project Studio',
    description: 'Active project workspace',
    icon: '⚡',
    type: 'studio',
    suggestedTags: ['project', 'active', 'workflow']
  },
  {
    name: 'Reflection Space',
    description: 'Personal journaling and reflection',
    icon: '🪞',
    type: 'vault',
    suggestedTags: ['journal', 'reflection', 'personal']
  }
];