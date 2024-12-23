import { useContext } from 'react';
import ProjectContext, { type ProjectContextType } from './ProjectContext';

export function useProject(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export function useProjectId(): string {
  const {
    project: { id: projectId },
  } = useProject();
  return projectId;
}
