import { promptApi } from '@/api/prompt';
import { storyboardApi } from '@/api/storyboard';
import {
  CopyIconButton,
  EmptyUIBase,
  ErrorRetryBoundary,
  IconButton,
} from '@/common/components';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/components/ui';
import { useImageViewer } from '@/common/hooks';
import { T2iGenerator } from '@/common/lib/t2i';
import {
  CharacterResponse,
  CharacterStoryboardResponse,
  PromptResponse,
  StoryboardResponse,
  UploadPromptImagesRequest,
} from '@oxygen-admin/shared/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';
import FluentPrompt16Filled from '~icons/fluent/prompt-16-filled';
import IconMovieOpen from '~icons/mdi/movie-open-outline';
import { EditableCell } from './EditableCell';

interface StoryboardsProps {
  spokenId: string;
  storyboards: StoryboardResponse[];
  characters: CharacterResponse[];
  characterStoryboards: CharacterStoryboardResponse[];
}

interface EditingEntry {
  promptId: string;
  value: string;
}

export function Storyboards({
  spokenId,
  storyboards,
  characters,
  characterStoryboards,
}: StoryboardsProps) {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { openImageDialog } = useImageViewer();
  const [editingEntries, setEditingEntries] = useState<EditingEntry[]>([]);

  const {
    mutate: createStoryboards,
    isPending,
    error,
    reset,
    isError,
  } = useMutation({
    mutationFn: () => storyboardApi.createStoryboards(spokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spokenVersion'] });
    },
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', spokenId],
    queryFn: () => promptApi.getPromptsBySpokenId(spokenId),
    enabled: !!storyboards?.length,
    retry: false,
    throwOnError: true,
  });

  const { mutate: createPrompts, isPending: isCreatingPrompts } = useMutation({
    mutationFn: () => promptApi.createPrompts(spokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', spokenId] });
      toast.success('Prompts已生成');
    },
  });

  const { mutate: uploadImages } = useMutation({
    mutationFn: ({
      promptId,
      data,
    }: {
      promptId: string;
      data: UploadPromptImagesRequest;
    }) => promptApi.uploadImages(promptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', spokenId] });
    },
  });

  const { mutate: deleteImage } = useMutation({
    mutationFn: ({
      promptId,
      imageId,
    }: {
      promptId: string;
      imageId: string;
    }) => promptApi.removeImage(promptId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', spokenId] });
    },
  });

  const { mutate: updateImage } = useMutation({
    mutationFn: ({
      promptId,
      imageId,
      url,
    }: {
      promptId: string;
      imageId: string;
      url: string;
    }) => promptApi.updateImage(promptId, imageId, { url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', spokenId] });
    },
  });

  const { mutate: updatePrompt } = useMutation({
    mutationFn: ({
      promptId,
      content,
    }: {
      promptId: string;
      content: string;
    }) => promptApi.updatePrompt(promptId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', spokenId] });
    },
  });

  const getFormattedData = () => {
    return JSON.stringify(
      storyboards?.map((storyboard) => ({
        no: storyboard.no,
        characters: characters
          .filter((char) =>
            characterStoryboards.some(
              (cs) =>
                cs.storyboardId === storyboard.id && cs.characterId === char.id,
            ),
          )
          .map((char) => char.name),
        shot_type: storyboard.cameraShot,
        description: storyboard.description,
        environment: storyboard.environment,
        voiceover: storyboard.voiceover,
      })) ?? [],
      null,
      2,
    );
  };

  const handleEditClick = (promptId: string) => {
    const existingEntry = editingEntries.find(
      (entry) => entry.promptId === promptId,
    );
    if (existingEntry) return;

    const prompt = prompts.find((p) => p.id === promptId);
    setEditingEntries((prev) => [
      ...prev,
      {
        promptId,
        value: prompt?.content || '',
      },
    ]);
  };

  const handleConfirm = async (promptId: string, newValue: string) => {
    await updatePrompt({ promptId, content: newValue });
    setEditingEntries((prev) => prev.filter((e) => e.promptId !== promptId));
  };

  const handleCancel = (promptId: string) => {
    setEditingEntries((prev) => prev.filter((e) => e.promptId !== promptId));
  };

  const handleChange = (promptId: string, value: string) => {
    setEditingEntries((prev) => {
      const newEntries = prev.map((e) => {
        if (e.promptId === promptId) {
          return { ...e, value };
        }
        return e;
      });
      return newEntries;
    });
  };

  const handleImageGenerated = (promptId: string, url: string, no: number) => {
    uploadImages({
      promptId,
      data: {
        images: [{ url, no }],
      },
    });
  };

  const renderImageGenerators = (prompt: PromptResponse) => {
    const existingImages = prompt.promptImages || [];
    const totalSlots = 5;

    const handlePreviewImages = (startIndex: number) => {
      const urls = existingImages.map((img) => img.url);
      openImageDialog({
        images: urls.map((url: string) => ({
          url,
          title: prompt.content,
        })),
        initialIndex: startIndex,
      });
    };

    return (
      <div
        className={`${
          isMobile
            ? 'flex space-x-2 overflow-x-auto flex-nowrap'
            : 'grid grid-cols-5 gap-2'
        } min-h-48`}
      >
        {Array.from({ length: totalSlots }).map((_, index) => {
          const existingImage = existingImages.find((img) => img.no === index);
          return (
            <div
              key={index}
              className="relative flex justify-center items-center min-h-48 aspect-square flex-shrink-0 bg-muted/20 dark:bg-muted/10 rounded-lg border border-border/50 dark:border-border/50"
            >
              <T2iGenerator
                prompt={prompt.content}
                existingImageUrl={existingImage?.url}
                onImageGenerated={(url) => {
                  if (existingImage) {
                    updateImage({
                      promptId: prompt.id,
                      imageId: existingImage.id,
                      url,
                    });
                  } else {
                    handleImageGenerated(prompt.id, url, index);
                  }
                }}
                onImageClick={
                  existingImage
                    ? () =>
                        handlePreviewImages(
                          existingImages.indexOf(existingImage),
                        )
                    : undefined
                }
                onImageDelete={
                  existingImage
                    ? () =>
                        deleteImage({
                          promptId: prompt.id,
                          imageId: existingImage.id,
                        })
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (!storyboards?.length) {
    return (
      <EmptyUIBase>
        {isError ? (
          <ErrorRetryBoundary
            retry={() => {
              reset();
              createStoryboards();
            }}
            text="生成分镜失败"
            error={error}
          />
        ) : (
          <Button
            onClick={() => createStoryboards()}
            disabled={isPending}
            className="gap-1.5 md:gap-2"
          >
            <IconMovieOpen className="w-4 h-4 md:w-5 md:h-5" />
            {isPending ? '生成中...' : '生成分镜'}
          </Button>
        )}
      </EmptyUIBase>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex justify-between items-center px-2 md:px-4">
        <h2 className="text-base md:text-lg font-semibold text-foreground/90">
          分镜表
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                className="text-foreground w-6 h-6 md:w-6 md:h-6 ml-2 mr-auto"
                onClick={() => createPrompts()}
                disabled={isCreatingPrompts}
                icon={<FluentPrompt16Filled className="w-3 h-3" />}
              />
            </TooltipTrigger>
            <TooltipContent>
              <span>生成 Prompts</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CopyIconButton content={getFormattedData()} />
      </div>
      <div className="rounded-lg border border-border dark:border-border overflow-hidden bg-card dark:bg-card/50">
        <div className="overflow-x-auto">
          <Table>
            {!isMobile ? (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 md:w-20 min-w-12 md:min-w-20 text-center border-r border-border dark:border-border">
                      编号
                    </TableHead>
                    <TableHead className="text-center w-24 md:w-40 whitespace-nowrap">
                      角色
                    </TableHead>
                    <TableHead className="w-24 md:w-48 text-center whitespace-nowrap">
                      镜头类型
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      场景描述
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      环境
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      旁白
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storyboards.map((storyboard) => {
                    const prompt = prompts.find((p) => p.no === storyboard.no);
                    return (
                      <Fragment key={storyboard.id}>
                        <TableRow>
                          <TableCell
                            rowSpan={prompt ? 3 : 1}
                            className="font-medium text-sm text-center align-middle border-r border-border dark:border-border"
                          >
                            {storyboard.no}
                          </TableCell>
                          <TableCell className="text-sm text-center whitespace-pre-wrap text-muted-foreground">
                            {characters
                              .filter((char) =>
                                characterStoryboards.some(
                                  (cs) =>
                                    cs.storyboardId === storyboard.id &&
                                    cs.characterId === char.id,
                                ),
                              )
                              .map((char) => char.name)
                              .join(',\n') || '/'}
                          </TableCell>
                          <TableCell className="text-sm text-center text-muted-foreground">
                            {storyboard.cameraShot}
                          </TableCell>
                          <TableCell className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {storyboard.description}
                          </TableCell>
                          <TableCell className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {storyboard.environment}
                          </TableCell>
                          <TableCell className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {storyboard.voiceover}
                          </TableCell>
                        </TableRow>
                        {prompt && (
                          <>
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="whitespace-pre-wrap text-sm text-muted-foreground px-3 py-2 md:px-4 md:py-3"
                              >
                                <EditableCell
                                  position="right-bottom"
                                  itemId={prompt.id}
                                  field="content"
                                  value={
                                    editingEntries.find(
                                      (e) => e.promptId === prompt.id,
                                    )?.value || prompt.content
                                  }
                                  isEditing={
                                    !!editingEntries.find(
                                      (e) => e.promptId === prompt.id,
                                    )
                                  }
                                  onEdit={() => handleEditClick(prompt.id)}
                                  onConfirm={(_, __, value) =>
                                    handleConfirm(prompt.id, value)
                                  }
                                  onCancel={() => handleCancel(prompt.id)}
                                  onChange={(_, __, value) =>
                                    handleChange(prompt.id, value)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={5} className="p-2 md:p-3">
                                {renderImageGenerators(prompt)}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </>
            ) : (
              <TableBody>
                {storyboards.map((storyboard) => {
                  const prompt = prompts.find((p) => p.no === storyboard.no);
                  return (
                    <Fragment key={storyboard.id}>
                      <TableRow>
                        <TableCell
                          className="font-medium text-sm text-center border-r border-border dark:border-border"
                          style={{ width: '7%' }}
                        >
                          {storyboard.no}
                        </TableCell>
                        <TableCell className="w-full p-0">
                          <div className="divide-y divide-border/50 dark:divide-border *:p-2 text-muted-foreground">
                            <div>
                              角色：
                              {characters
                                .filter((char) =>
                                  characterStoryboards.some(
                                    (cs) =>
                                      cs.storyboardId === storyboard.id &&
                                      cs.characterId === char.id,
                                  ),
                                )
                                .map((char) => char.name)
                                .join(', ') || '/'}
                            </div>
                            <div>镜头类型：{storyboard.cameraShot}</div>
                            <div>场景描述：{storyboard.description}</div>
                            <div>环境：{storyboard.environment}</div>
                            <div>旁白：{storyboard.voiceover}</div>
                            {prompt && (
                              <div className="w-[calc(100vw-6.75rem)] md:w-auto">
                                {renderImageGenerators(prompt)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
