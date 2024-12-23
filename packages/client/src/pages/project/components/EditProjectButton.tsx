import { projectApi, UpdateProjectRequestSchema } from '@/api/project';
import { CustomDialog, IconButton } from '@/common/components';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/common/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import IconEdit from '~icons/mdi/pencil';

interface EditProjectButtonProps {
  project: { id: string; name: string };
}

type UpdateProjectRequest = typeof UpdateProjectRequestSchema;

function EditProjectButton({ project }: EditProjectButtonProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<UpdateProjectRequest>>({
    resolver: zodResolver(UpdateProjectRequestSchema),
    defaultValues: { name: project.name },
  });

  const { mutate: updateProject, isPending } = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      projectApi.updateProject(data.id, { name: data.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectList'] });
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      setOpen(false);
    },
  });

  const onSubmit = (values: z.infer<UpdateProjectRequest>) => {
    updateProject({ id: project.id, name: values.name });
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <CustomDialog
      title="编辑项目"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <IconButton
          icon={<IconEdit />}
          className="border-0 bg-secondary/50 hover:bg-primary/10"
        />
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>项目名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入项目名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleClose}
            >
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '更新中...' : '更新'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default EditProjectButton;
