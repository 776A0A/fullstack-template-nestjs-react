import { storyboardApi } from '@/api/storyboard';
import { EmptyUIBase } from '@/common/components';
import { Button } from '@/common/components/ui';
import { SpokenVersionResponse } from '@oxygen-admin/shared/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IconSpokenVersion from '~icons/mdi/microphone';
import { useProjectId, useStory } from '../../context';
import { ContentPanel } from '../ContentPanel';

interface SpokenVersionProps {
  spokenVersion: Nullable<SpokenVersionResponse>;
}

function SpokenVersion({ spokenVersion }: SpokenVersionProps) {
  const projectId = useProjectId();
  const { story } = useStory();
  const queryClient = useQueryClient();

  const { mutate: createSpokenVersion, isPending } = useMutation({
    mutationFn: storyboardApi.createSpokenVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spokenVersion', projectId] });
    },
  });

  const handleCreateSpokenVersion = () => {
    if (!story?.id || !story.writtenVersion?.id) return;
    createSpokenVersion({
      storyId: story.id,
      writtenId: story.writtenVersion.id,
    });
  };

  if (!spokenVersion) {
    return (
      <EmptyUIBase>
        <Button
          onClick={handleCreateSpokenVersion}
          disabled={isPending}
          className="gap-1.5 md:gap-2"
        >
          <IconSpokenVersion className="w-4 h-4 md:w-5 md:h-5" />
          {isPending ? '生成中...' : '生成口语版'}
        </Button>
      </EmptyUIBase>
    );
  }

  return (
    <ContentPanel
      title={spokenVersion.title}
      version={spokenVersion.version}
      content={spokenVersion.content}
    >
      <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed md:columns-3 md:gap-6 md:column-rule md:column-rule-border">
        {spokenVersion.content}
      </p>
    </ContentPanel>
  );
}

SpokenVersion.Skeleton = function SpokenVersionSkeleton() {
  return <ContentPanel.Skeleton />;
};

export default SpokenVersion;
