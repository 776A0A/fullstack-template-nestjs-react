import { CreateProjectRequestSchema, projectApi } from '@/api/project';
import { CustomDialog } from '@/common/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import CreateProjectForm from './CreateProjectForm';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateProjectDialog({ isOpen, onClose }: CreateProjectModalProps) {
  const { data: lexiles = [] } = useQuery({
    queryKey: ['lexiles'],
    queryFn: projectApi.getAllLexiles,
    retry: false,
    throwOnError: true,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: projectApi.getAllTags,
    retry: false,
    throwOnError: true,
  });

  const form = useForm<z.infer<typeof CreateProjectRequestSchema>>({
    resolver: zodResolver(CreateProjectRequestSchema),
    defaultValues: { name: '', lexileLevelId: '', tags: [] },
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <CustomDialog title="创建项目" open={isOpen} onOpenChange={handleClose}>
      <CreateProjectForm
        form={form}
        lexiles={lexiles}
        tags={tags}
        onClose={handleClose}
      />
    </CustomDialog>
  );
}

export default CreateProjectDialog;
