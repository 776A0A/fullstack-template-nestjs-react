import { CreateProjectRequestType, projectApi } from '@/api/project';
import { Button, Form } from '@/common/components/ui';
import { LexileResponse, TagResponse } from '@oxygen-admin/shared/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import LexileSelect from './LexileSelect';
import ProjectNameInput from './ProjectNameInput';
import TagSelector from './TagSelector';

interface CreateProjectFormProps {
  form: UseFormReturn<CreateProjectRequestType>;
  lexiles: LexileResponse[];
  tags: TagResponse[];
  onClose: () => void;
}

function CreateProjectForm({
  form,
  lexiles,
  tags,
  onClose,
}: CreateProjectFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['projectList'] });
      onClose();
      navigate(`/projects/${id}`);
    },
  });

  const onSubmit = (values: CreateProjectRequestType) => {
    createProject(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-4"
      >
        <ProjectNameInput form={form} />
        <LexileSelect form={form} lexiles={lexiles} />
        <TagSelector form={form} tags={tags} />
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-sm h-8 sm:h-9"
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="text-sm h-8 sm:h-9"
          >
            {isPending ? '创建中...' : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProjectForm;
