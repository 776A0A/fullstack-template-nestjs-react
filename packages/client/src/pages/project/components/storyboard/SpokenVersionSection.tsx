import { storyboardApi } from '@/api/storyboard';
import { EmptyUI, ErrorRetryBoundary } from '@/common/components';
import { useQuery } from '@tanstack/react-query';
import IconScriptText from '~icons/mdi/script-text-outline';
import { useProjectId, useStory } from '../../context';
import { Section } from '../Section';
import { Characters } from './Characters';
import SpokenVersion from './SpokenVersion';
import { Storyboards } from './Storyboards';

export function SpokenVersionSection() {
  const projectId = useProjectId();
  const { story, isLoading: isStoryLoading } = useStory();

  const {
    data: spokenVersion,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['spokenVersion', projectId],
    queryFn: () => storyboardApi.getSpokenVersionByProjectId(projectId),
    retry: false,
  });

  return (
    <Section title="分镜">
      {isStoryLoading ? (
        <SpokenVersion.Skeleton />
      ) : !story?.writtenVersion ? (
        <EmptyUI
          icon={
            <IconScriptText className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/60" />
          }
          text="请先完成书面版故事生成"
        />
      ) : isError ? (
        <ErrorRetryBoundary
          retry={refetch}
          text="口语版加载失败"
          error={error}
        />
      ) : (
        <div className="space-y-4 md:space-y-6">
          <SpokenVersion spokenVersion={spokenVersion} />
          {spokenVersion && (
            <>
              <Characters
                spokenId={spokenVersion.id}
                characters={spokenVersion.characters}
              />
              {spokenVersion.characters?.length > 0 && (
                <Storyboards
                  spokenId={spokenVersion.id}
                  storyboards={spokenVersion.storyboards}
                  characters={spokenVersion.characters}
                  characterStoryboards={spokenVersion.characterStoryboards}
                />
              )}
            </>
          )}
        </div>
      )}
    </Section>
  );
}
