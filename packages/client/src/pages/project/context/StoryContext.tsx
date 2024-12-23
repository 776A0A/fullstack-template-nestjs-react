import { StoryResponse } from '@oxygen-admin/shared/dto';
import { createContext } from 'react';

export interface StoryContextType {
  story: Nullable<StoryResponse>;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const StoryContext = createContext<StoryContextType | null>(null);

export default StoryContext;
