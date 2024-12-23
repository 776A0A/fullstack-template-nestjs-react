import { CreateStoryRequestSchema, storyApi } from '@/api/story';
import { CustomDialog } from '@/common/components';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/common/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useProjectId } from '../../context';
import ContentStyleSelector from './ContentStyleSelector';

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CreateStoryRequestType = z.infer<typeof CreateStoryRequestSchema>;

function CreateStoryDialog({ open, onOpenChange }: CreateStoryDialogProps) {
  const projectId = useProjectId();
  const queryClient = useQueryClient();

  const { data: contentStyles = [] } = useQuery({
    queryKey: ['contentStyles'],
    queryFn: storyApi.getAllContentStyles,
    retry: false,
    throwOnError: true,
  });

  const form = useForm<CreateStoryRequestType>({
    resolver: zodResolver(CreateStoryRequestSchema),
    defaultValues: {
      projectId,
      title: '',
      content: '',
      contentStyleIds: [],
    },
  });

  const { mutate: createStory, isPending } = useMutation({
    mutationFn: storyApi.createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story', projectId] });
      onOpenChange(false);
      form.reset();
    },
  });

  const handleClose = () => {
    if (isPending) return;
    onOpenChange(false);
    form.reset();
  };

  return (
    <CustomDialog title="添加故事" open={open} onOpenChange={handleClose}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => createStory(values))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="请输入故事标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ContentStyleSelector form={form} contentStyles={contentStyles} />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>内容</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入故事内容"
                    className="min-h-50 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '创建中...' : '创建'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export { CreateStoryDialog };
