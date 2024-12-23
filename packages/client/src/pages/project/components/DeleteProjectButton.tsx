import { projectApi } from '@/api/project';
import { IconButton } from '@/common/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import IconDelete from '~icons/mdi/delete';

interface DeleteProjectButtonProps {
  projectId: string;
}

function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: () => projectApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectList'] });
      toast.success('项目删除成功');
      navigate('/projects');
    },
  });

  const handleDelete = () => {
    if (window.confirm('确定要删除此项目吗？')) deleteProject();
  };

  return (
    <IconButton
      icon={<IconDelete />}
      onClick={handleDelete}
      disabled={isPending}
      className="border-0 bg-secondary/50 text-destructive hover:text-destructive hover:bg-destructive/10"
    />
  );
}

export default DeleteProjectButton;
