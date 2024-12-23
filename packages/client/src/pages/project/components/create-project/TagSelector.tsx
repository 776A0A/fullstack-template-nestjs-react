import { CreateProjectRequestType, projectApi } from '@/api/project';
import {
  Badge,
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/common/components/ui';
import { cn } from '@/common/utils';
import { TagResponse } from '@oxygen-admin/shared/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import IconChevronUpDown from '~icons/ph/caret-up-down-bold';
import IconCheck from '~icons/ph/check-bold';
import IconClose from '~icons/ph/x-bold';

interface TagSelectorProps {
  form: UseFormReturn<CreateProjectRequestType>;
  tags: TagResponse[];
}

// TODO: bug 删除字符时，不显示下拉选项
function TagSelector({ form, tags }: TagSelectorProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedTags = form.watch('tags') ?? [];

  // 使用正则表达式进行匹配，增加对特殊字符的支持
  const isExactMatch = tags.some(
    (tag) => tag.value.trim() === searchValue.trim(),
  );

  const filteredTags = tags.filter((tag) =>
    tag.value.trim().includes(searchValue.trim()),
  );

  const { mutate: createTag } = useMutation({
    mutationFn: projectApi.createTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, newTag.id]);
      setSearchValue('');
    },
  });

  const handleRemoveTag = useCallback(
    (tagId: string) => {
      const newTags = selectedTags.filter((id: string) => id !== tagId);
      form.setValue('tags', newTags);
    },
    [form, selectedTags],
  );

  const handleSelectTag = useCallback(
    (tagId: string) => {
      const newTags = selectedTags.includes(tagId)
        ? selectedTags.filter((id: string) => id !== tagId)
        : [...selectedTags, tagId];
      form.setValue('tags', newTags, { shouldValidate: true });
      setSearchValue('');
      setOpen(false);
    },
    [form, selectedTags],
  );

  return (
    <FormField
      control={form.control}
      name="tags"
      render={() => (
        <FormItem>
          <FormLabel className="text-sm font-medium">标签</FormLabel>
          <FormControl>
            <div className="space-y-1.5 sm:space-y-2">
              <SelectedTags
                selectedTags={selectedTags}
                tags={tags}
                onRemove={handleRemoveTag}
              />
              <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between text-sm h-8 sm:h-9"
                  >
                    添加标签
                    <IconChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-w-[90vw]">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="搜索标签..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                      className="text-sm h-9"
                    />
                    <CommandList className="max-h-44 md:max-h-75">
                      <CommandGroup>
                        {filteredTags.map((tag) => (
                          <TagItem
                            key={tag.id}
                            tag={tag}
                            isSelected={selectedTags.includes(tag.id)}
                            onSelect={() => handleSelectTag(tag.id)}
                          />
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {!isExactMatch && searchValue && (
                      <CreateTagButton
                        searchValue={searchValue}
                        onCreate={() => {
                          createTag({ value: searchValue });
                          setOpen(false);
                        }}
                      />
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default TagSelector;

// 已选择标签组件
const SelectedTags = ({
  selectedTags,
  tags,
  onRemove,
}: {
  selectedTags: string[];
  tags: TagResponse[];
  onRemove: (tagId: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {selectedTags.map((tagId: string) => {
      const tag = tags.find((t) => t.id === tagId);
      if (!tag) return null;
      return (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 text-xs py-0.5"
        >
          {tag.value}
          <IconClose
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove(tag.id)}
          />
        </Badge>
      );
    })}
  </div>
);

// 标签列表项组件
const TagItem = ({
  tag,
  isSelected,
  onSelect,
}: {
  tag: TagResponse;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <CommandItem onSelect={onSelect} className="text-sm py-1.5">
    <IconCheck
      className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
    />
    {tag.value}
  </CommandItem>
);

// 创建新标签按钮组件
const CreateTagButton = ({
  searchValue,
  onCreate,
}: {
  searchValue: string;
  onCreate: () => void;
}) => (
  <div className="p-2 border-t">
    <Button size="sm" onClick={onCreate} className="w-full text-xs h-8">
      创建新标签：{searchValue}
    </Button>
  </div>
);
