import { IconButton } from '@/common/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui';
import { useCallback, useEffect } from 'react';
import IconChevronLeft from '~icons/mdi/chevron-left';
import IconChevronRight from '~icons/mdi/chevron-right';

interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  images: Array<{
    url: string;
    title: string;
    alt?: string;
  }>;
}

export function ImageViewerDialog({
  open,
  onOpenChange,
  images,
  currentIndex,
  onIndexChange,
}: ImageViewerProps) {
  const currentImage = images[currentIndex];

  const handlePrevious = useCallback(() => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] sm:max-w-[640px] p-2 sm:p-3 gap-0 rounded-sm">
        <DialogHeader className="space-y-0 p-2">
          <DialogTitle className="text-base sm:text-xl font-semibold line-clamp-1">
            {currentImage?.title}
          </DialogTitle>
          <DialogDescription className="h-0 m-0" />
        </DialogHeader>
        {currentImage && (
          <div className="relative w-full aspect-square rounded-sm overflow-hidden">
            <img
              src={currentImage.url}
              alt={currentImage.alt || currentImage.title}
              className="absolute inset-0 w-full h-full object-contain bg-muted/20"
            />
            {images.length > 1 && (
              <>
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  <IconButton
                    onClick={handlePrevious}
                    icon={<IconChevronLeft className="w-3 h-3 md:w-4 md:h-4" />}
                    className="!bg-background/50 dark:!bg-background/70 hover:!bg-background/70 dark:hover:!bg-background/90 !border-0 backdrop-blur-[2px]"
                  />
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconButton
                    onClick={handleNext}
                    icon={
                      <IconChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    }
                    className="!bg-background/50 dark:!bg-background/70 hover:!bg-background/70 dark:hover:!bg-background/90 !border-0 backdrop-blur-[2px]"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
