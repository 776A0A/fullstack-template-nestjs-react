import { CreateProjectRequestType } from '@/api/project';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui';
import { LexileResponse } from '@oxygen-admin/shared/dto';
import { UseFormReturn } from 'react-hook-form';

interface LexileSelectProps {
  form: UseFormReturn<CreateProjectRequestType>;
  lexiles: LexileResponse[];
}

function LexileSelect({ form, lexiles }: LexileSelectProps) {
  return (
    <FormField
      control={form.control}
      name="lexileLevelId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">蓝思值</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-full px-3 py-1.5 text-sm">
                <SelectValue placeholder="选择蓝思值" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {lexiles.map((lexile) => (
                <SelectItem
                  key={lexile.id}
                  value={lexile.id}
                  className="text-sm"
                >
                  {lexile.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default LexileSelect;
