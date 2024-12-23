import { CreateStoryRequestSchema } from '@/api/story';
import {
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
import { ContentStyleResponse } from '@oxygen-admin/shared/dto';
import { memo, useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import IconChevronUpDown from '~icons/ph/caret-up-down-bold';
import IconCheck from '~icons/ph/check-bold';

type CreateStoryRequestType = z.infer<typeof CreateStoryRequestSchema>;

interface ContentStyleSelectorProps {
  form: UseFormReturn<CreateStoryRequestType>;
  contentStyles: ContentStyleResponse[];
}

function ContentStyleSelector({
  form,
  contentStyles,
}: ContentStyleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedStyles = form.watch('contentStyleIds') ?? [];
  const filteredStyles = contentStyles.filter((style) =>
    style.value.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSelectStyle = useCallback(
    (styleId: string) => {
      const newStyles = selectedStyles.includes(styleId)
        ? selectedStyles.filter((id: string) => id !== styleId)
        : [...selectedStyles, styleId];
      form.setValue('contentStyleIds', newStyles, { shouldValidate: true });
      setSearchValue('');
      if (newStyles.length > 0) {
        setOpen(false);
      }
    },
    [form, selectedStyles],
  );

  return (
    <FormField
      control={form.control}
      name="contentStyleIds"
      render={() => (
        <FormItem>
          <FormLabel className="text-sm font-medium">内容风格</FormLabel>
          <FormControl>
            <div className="space-y-1.5 sm:space-y-2">
              <SelectedStyles
                selectedStyles={selectedStyles}
                contentStyles={contentStyles}
              />
              <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between text-sm h-8 sm:h-9"
                  >
                    选择内容风格
                    <IconChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="搜索内容风格..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                      className="text-sm h-9"
                    />
                    <CommandList className="max-h-44 md:max-h-75">
                      <CommandGroup>
                        {filteredStyles.map((style) => (
                          <StyleItem
                            key={style.id}
                            style={style}
                            isSelected={selectedStyles.includes(style.id)}
                            onSelect={() => handleSelectStyle(style.id)}
                          />
                        ))}
                      </CommandGroup>
                    </CommandList>
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

export default ContentStyleSelector;

const SelectedStyles = memo(
  ({
    selectedStyles,
    contentStyles,
  }: {
    selectedStyles: string[];
    contentStyles: ContentStyleResponse[];
  }) => (
    <div className="flex flex-wrap gap-1.5">
      {selectedStyles.map((styleId: string) => {
        const style = contentStyles.find((s) => s.id === styleId);
        if (!style) return null;
        return (
          <div
            key={style.id}
            className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-md text-xs"
          >
            {style.value}
          </div>
        );
      })}
    </div>
  ),
);

const StyleItem = memo(
  ({
    style,
    isSelected,
    onSelect,
  }: {
    style: ContentStyleResponse;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <CommandItem onSelect={onSelect} className="text-sm py-1.5">
      <IconCheck
        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {style.value}
    </CommandItem>
  ),
);
