import { ProjectResponse } from '@oxygen-admin/shared/dto';
import { createContext } from 'react';

export interface ProjectContextType {
  project: ProjectResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export default ProjectContext;
