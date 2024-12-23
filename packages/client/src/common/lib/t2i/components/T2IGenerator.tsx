import { IconButton } from '@/common/components';
import { useOssStore } from '@/store';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import IconAlertCircle from '~icons/mdi/alert-circle';
import IconMagnify from '~icons/mdi/magnify';
import IconTrashCan from '~icons/mdi/trash-can-outline';
import { ImageGenerationState, T2I_CONSTANTS } from '../constants';
import { T2IEventType, type T2IEventHandler } from '../events';
import { useT2iStore } from '../use-t2i.store';
import { GenerateButton } from './GenerateButton';

interface T2iGeneratorProps {
  prompt: string;
  existingImageUrl?: string | null;
  onImageClick?: (url: string) => void;
  onImageGenerated?: (url: string) => void;
  onImageDelete?: () => void;
}

export interface T2iGeneratorRef {
  generate: () => Promise<string>;
}

export const T2iGenerator = forwardRef<T2iGeneratorRef, T2iGeneratorProps>(
  (
    { prompt, existingImageUrl, onImageClick, onImageGenerated, onImageDelete },
    ref,
  ) => {
    const [state, setState] = useState<ImageGenerationState>(() => ({
      status: existingImageUrl ? 'completed' : 'idle',
      progress: 0,
      resultUrl: existingImageUrl || undefined,
      previewUrl: undefined,
      promptId: undefined,
    }));

    const oss = useOssStore();
    const t2i = useT2iStore();

    useEffect(() => {
      const handlePreview: T2IEventHandler<T2IEventType.Preview> = (data) => {
        if (data.promptId !== state.promptId) return;
        setState((prev) => ({
          ...prev,
          previewUrl: data.imageUrl,
          status: 'generating',
        }));
      };

      const handleProgress: T2IEventHandler<T2IEventType.Progress> = (data) => {
        if (state.status !== 'generating' || data.promptId !== state.promptId)
          return;
        setState((prev) => ({
          ...prev,
          progress: (data.value / data.max) * 100,
        }));
      };

      const handleComplete: T2IEventHandler<
        T2IEventType.ExecutionComplete
      > = async (data) => {
        if (data.promptId !== state.promptId) return;

        try {
          const promptState = t2i.getPromptState(data.promptId);
          if (promptState && promptState.resultUrls.length > 0) {
            const imageUrl = promptState.resultUrls[0];
            if (!imageUrl) return;

            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const ossUrl = await oss.uploadImage(blob);
            onImageGenerated?.(ossUrl);

            setState((prev) => ({
              ...prev,
              status: 'completed',
              resultUrl: ossUrl,
              previewUrl: undefined,
            }));
          }
        } catch (error) {
          console.error('获取或上传结果图片失败:', error);
          setState((prev) => ({ ...prev, status: 'error' }));
        }
      };

      const handleError = () => {
        if (state.status !== 'generating') return;
        setState((prev) => ({ ...prev, status: 'error' }));
      };

      t2i.on(T2IEventType.Preview, handlePreview);
      t2i.on(T2IEventType.Progress, handleProgress);
      t2i.on(T2IEventType.ExecutionComplete, handleComplete);
      t2i.on(T2IEventType.Error, handleError);
      t2i.on(T2IEventType.PromptTimeout, handleError);

      return () => {
        t2i.off(T2IEventType.Preview, handlePreview);
        t2i.off(T2IEventType.Progress, handleProgress);
        t2i.off(T2IEventType.ExecutionComplete, handleComplete);
        t2i.off(T2IEventType.Error, handleError);
        t2i.off(T2IEventType.PromptTimeout, handleError);
      };
    }, [onImageGenerated, oss, state.promptId, t2i]);

    useEffect(() => {
      return () => {
        if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
      };
    }, [state.previewUrl, state.resultUrl]);

    useEffect(() => {
      if (existingImageUrl) {
        setState((prev) => ({
          ...prev,
          status: 'completed',
          resultUrl: existingImageUrl,
          previewUrl: undefined,
        }));
      } else if (state.status === 'completed') {
        setState({
          status: 'idle',
          progress: 0,
          resultUrl: undefined,
          previewUrl: undefined,
          promptId: undefined,
        });
      }
    }, [existingImageUrl]);

    const handleGenerate = async () => {
      try {
        if (!t2i.isConnectedToServer) await t2i.connect();

        setState((prev) => ({
          ...prev,
          status: 'generating',
          progress: 0,
          resultUrl: undefined,
          promptId: undefined,
        }));

        const promptId = await t2i.prompt({ prompt });
        setState((prev) => ({
          ...prev,
          promptId,
        }));
        return promptId;
      } catch (error) {
        console.error('生成图片失败:', error);
        setState((prev) => ({
          ...prev,
          status: 'error',
          progress: 0,
        }));
        throw error;
      }
    };

    useImperativeHandle(ref, () => ({
      generate: handleGenerate,
    }));

    return (
      <div className="flex flex-col items-center gap-2 relative">
        {state.previewUrl || state.resultUrl ? (
          <div className="relative w-48 h-48 group flex flex-col items-center">
            <img
              src={state.resultUrl || state.previewUrl}
              alt="生成图片"
              className="w-full h-full object-cover rounded-lg border border-border/50 bg-muted/20 dark:bg-muted/10"
            />
            {state.status === 'generating' && (
              <div className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs md:text-sm text-foreground/90 font-medium">
                    {state.progress.toFixed(0)}%
                  </span>
                  <div className="w-14 md:w-20 h-1 bg-muted/50 dark:bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/90 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              <GenerateButton
                disabled={state.status === 'generating'}
                onClick={handleGenerate}
                size="SMALL"
                className={T2I_CONSTANTS.COMMON_STYLES.BACKDROP}
              />
              {state.status === 'completed' &&
                state.resultUrl &&
                onImageClick && (
                  <IconButton
                    onClick={() => onImageClick(state.resultUrl!)}
                    icon={
                      <IconMagnify
                        className={T2I_CONSTANTS.COMMON_STYLES.ICON}
                      />
                    }
                    className={`${T2I_CONSTANTS.BUTTON_SIZES.SMALL} ${T2I_CONSTANTS.COMMON_STYLES.BACKDROP}`}
                  />
                )}
            </div>
            {existingImageUrl && onImageDelete && (
              <IconButton
                onClick={onImageDelete}
                icon={<IconTrashCan className="w-3 h-3 md:w-4 md:h-4" />}
                className="absolute top-2 left-2 !w-6 !h-6 md:!w-7 md:!h-7 bg-background/70 dark:bg-background/80 hover:bg-destructive/90 dark:hover:bg-destructive/90 border-0 backdrop-blur-[1px] transition-colors"
              />
            )}
          </div>
        ) : (
          <GenerateButton
            disabled={state.status === 'generating'}
            onClick={handleGenerate}
            className="bg-card border-border"
          />
        )}
        {state.status === 'error' && (
          <div className="flex flex-col items-center gap-1 text-destructive/90 dark:text-destructive absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 md:mt-12 whitespace-nowrap">
            <IconAlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">生成失败</span>
            {state.promptId && (
              <span className="text-xs md:text-sm font-medium whitespace-normal">
                {t2i.getPromptState(state.promptId)?.error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
