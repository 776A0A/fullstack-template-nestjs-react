import { CreateProjectRequestType } from '@/api/project';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/common/components/ui';
import { UseFormReturn } from 'react-hook-form';

interface ProjectNameInputProps {
  form: UseFormReturn<CreateProjectRequestType>;
}

function ProjectNameInput({ form }: ProjectNameInputProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">项目名称</FormLabel>
          <FormControl>
            <Input
              placeholder="请输入项目名称"
              {...field}
              className="w-full px-3 py-1.5 text-sm"
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default ProjectNameInput;
