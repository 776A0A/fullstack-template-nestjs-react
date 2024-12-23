import { StoryResponse } from '@oxygen-admin/shared/dto';
import { ReactNode, useMemo } from 'react';
import StoryContext from './StoryContext';

interface StoryProviderProps {
  story: Nullable<StoryResponse>;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  children: ReactNode;
}

function StoryProvider({
  story,
  isLoading,
  isError,
  refetch,
  children,
}: StoryProviderProps) {
  const contextValue = useMemo(
    () => ({ story, isLoading, isError, refetch }),
    [story, isLoading, isError, refetch],
  );

  return (
    <StoryContext.Provider value={contextValue}>
      {children}
    </StoryContext.Provider>
  );
}

export default StoryProvider;
