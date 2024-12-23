import { ProjectResponse } from '@oxygen-admin/shared/dto';
import { ReactNode, useMemo } from 'react';
import ProjectContext from './ProjectContext';

interface ProjectProviderProps {
  project: ProjectResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  children: ReactNode;
}

function ProjectProvider({
  project,
  isLoading,
  isError,
  refetch,
  children,
}: ProjectProviderProps) {
  const contextValue = useMemo(
    () => ({ project, isLoading, isError, refetch }),
    [project, isLoading, isError, refetch],
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectProvider;
