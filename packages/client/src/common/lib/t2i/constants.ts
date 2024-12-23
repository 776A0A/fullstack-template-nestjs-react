export const T2I_CONSTANTS = {
  BUTTON_SIZES: {
    SMALL: '!w-6 !h-6 md:!w-7 md:!h-7',
    MEDIUM: '!w-8 !h-8 md:!w-10 md:!h-10',
    LARGE: '!w-22 !h-6 md:!w-32 md:!h-9',
  },
  COMMON_STYLES: {
    BACKDROP:
      'bg-background/70 dark:bg-background/80 hover:bg-background/80 dark:hover:bg-background/90 border-0 backdrop-blur-[1px] transition-colors',
    ICON: 'w-3 h-3 md:w-4 md:h-4',
  },
};

export interface ImageGenerationState {
  previewUrl?: string;
  resultUrl?: string;
  status: 'idle' | 'generating' | 'completed' | 'error';
  progress: number;
  promptId?: string;
}
