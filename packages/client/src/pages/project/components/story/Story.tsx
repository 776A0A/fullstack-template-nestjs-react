import { storyApi } from '@/api/story';
import { Button } from '@/common/components/ui';
import { StoryResponse } from '@oxygen-admin/shared/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IconTranslate from '~icons/mdi/translate';
import { ContentPanel } from '../ContentPanel';

interface StoryProps {
  story: StoryResponse;
}

function Story({ story }: StoryProps) {
  const queryClient = useQueryClient();

  const { mutate: translate, isPending } = useMutation({
    mutationFn: () => storyApi.translateStory(story.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story', story.projectId] });
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <ContentPanel
        title={story.title}
        version={story.version}
        content={story.content}
      />

      {story.writtenVersion ? (
        <ContentPanel
          title={story.writtenVersion.title}
          version={story.writtenVersion.storyVersion}
          content={story.writtenVersion.content}
          variant={
            story.writtenVersion.storyVersion === story.version
              ? 'success'
              : 'destructive'
          }
        />
      ) : (
        <ContentPanel title="" version="" content="" isDashed>
          <div className="flex justify-center items-center min-h-48 md:h-full">
            <Button
              onClick={() => translate()}
              disabled={isPending}
              className="gap-2"
            >
              <IconTranslate className="w-4 h-4 md:w-5 md:h-5" />
              {isPending ? '生成中...' : '生成书面版'}
            </Button>
          </div>
        </ContentPanel>
      )}
    </div>
  );
}

Story.Skeleton = function StorySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <ContentPanel.Skeleton />
      <ContentPanel.Skeleton />
    </div>
  );
};

export { Story };
