import { projectApi } from '@/api/project';
import { ErrorRetryBoundary } from '@/common/components';
import { Skeleton } from '@/common/components/ui';
import { cn } from '@/common/utils';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteProjectButton, EditProjectButton } from './components';

interface ProjectsProps {
  onNavigate?: () => void;
}

function Projects({ onNavigate }: ProjectsProps) {
  const navigate = useNavigate();
  const { id: currentProjectId } = useParams<{ id: string }>();

  const {
    data: projects,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['projectList'],
    queryFn: projectApi.getProjectList,
    retry: false,
  });

  if (isError)
    return (
      <ErrorRetryBoundary
        retry={refetch}
        error={error}
        className="mt-6 md:mt-8"
      />
    );
  if (isLoading) return <Projects.Skeleton />;

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    onNavigate?.();
  };

  return (
    <div className="space-y-1 p-2 overflow-x-hidden">
      {(projects || []).map((project) => (
        <div
          key={project.id}
          className={cn(
            'group px-3 py-2.5 cursor-pointer rounded-lg',
            'hover:bg-secondary/50 transition-all duration-200',
            'h-10 md:h-12',
            project.id === currentProjectId &&
              'bg-secondary/80 hover:bg-secondary/80 shadow-sm',
          )}
          onClick={() => handleProjectClick(project.id)}
        >
          <div className="flex items-center h-full">
            <div className="flex justify-between items-center w-full gap-2">
              <h3
                className={cn(
                  'font-medium text-sm text-muted-foreground truncate',
                  project.id === currentProjectId && 'text-foreground',
                )}
              >
                {project.name}
              </h3>
              {project.id === currentProjectId && (
                <div className="flex items-center gap-2 shrink-0">
                  <EditProjectButton
                    project={{ id: project.id, name: project.name }}
                  />
                  <DeleteProjectButton projectId={project.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Projects.Skeleton = function ProjectsSkeleton() {
  return (
    <div className="p-2 md:p-4 space-y-2">
      <Skeleton className="h-10 md:h-12 w-full rounded-lg bg-secondary/20" />
      <Skeleton className="h-10 md:h-12 w-full rounded-lg bg-secondary/20" />
      <Skeleton className="h-10 md:h-12 w-full rounded-lg bg-secondary/20" />
    </div>
  );
};

export default Projects;
