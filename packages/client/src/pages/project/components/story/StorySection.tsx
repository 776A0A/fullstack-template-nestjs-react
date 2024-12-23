import { EmptyUI, ErrorRetryBoundary } from '@/common/components';
import { Button } from '@/common/components/ui';
import { useState } from 'react';
import IconPlus from '~icons/mdi/plus';
import { useStory } from '../../context';
import { Section } from '../Section';
import { CreateStoryDialog } from './CreateStoryDialog';
import { Story } from './Story';

export function StorySection() {
  const { story, isLoading, isError, refetch } = useStory();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <Section title="故事" badges={story?.contentStyles}>
      {isLoading ? (
        <Story.Skeleton />
      ) : story ? (
        <Story story={story} />
      ) : isError ? (
        <ErrorRetryBoundary retry={refetch} text="故事加载失败" />
      ) : (
        <EmptyUI
          action={
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-1.5 md:gap-2"
            >
              <IconPlus className="w-4 h-4 md:w-5 md:h-5" />
              添加故事
            </Button>
          }
        />
      )}
      <CreateStoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </Section>
  );
}
