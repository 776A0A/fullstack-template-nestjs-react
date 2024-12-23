import { useContext } from 'react';
import StoryContext, { type StoryContextType } from './StoryContext';

export function useStory(): StoryContextType {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}
