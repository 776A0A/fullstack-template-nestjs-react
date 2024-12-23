import { projectApi } from '@/api/project';
import { storyApi } from '@/api/story';
import { ErrorRetryBoundary, SectionSkeleton } from '@/common/components';
import { Skeleton } from '@/common/components/ui';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ProjectHeader } from './components';
import { StorySection } from './components/story';
import { SpokenVersionSection } from './components/storyboard';
import { ProjectProvider, StoryProvider } from './context';

function Project() {
  const { id } = useParams<{ id: string }>();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch: refetchProject,
    error: projectError,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getProject(id!),
    retry: false,
  });

  const {
    data: story,
    isLoading: isStoryLoading,
    isError: isStoryError,
    refetch: refetchStory,
  } = useQuery({
    queryKey: ['story', id],
    queryFn: () => storyApi.getStoryByProjectId(id!),
    retry: false,
  });

  if (isProjectError)
    return (
      <ErrorRetryBoundary
        retry={refetchProject}
        error={projectError}
        className="mt-6 md:mt-8"
      />
    );
  if (isProjectLoading || !project) return <Project.Skeleton />;

  return (
    <ProjectProvider
      project={project}
      isLoading={isProjectLoading}
      isError={isProjectError}
      refetch={refetchProject}
    >
      <StoryProvider
        story={story}
        isLoading={isStoryLoading}
        isError={isStoryError}
        refetch={refetchStory}
      >
        <div className="space-y-6">
          <ProjectHeader />
          <div className="space-y-4 md:space-y-6">
            <StorySection />
            <SpokenVersionSection />
          </div>
        </div>
      </StoryProvider>
    </ProjectProvider>
  );
}

Project.Skeleton = function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20 mt-1 ml-2" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        <SectionSkeleton title="故事" />
        <SectionSkeleton title="分镜" />
      </div>
    </div>
  );
};

export default Project;
