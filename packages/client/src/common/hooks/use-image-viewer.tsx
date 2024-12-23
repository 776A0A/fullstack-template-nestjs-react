import { ImageViewerDialog } from '@/common/components';
import { createContext, useContext, useState } from 'react';

interface ImageItem {
  url: string;
  title: string;
  alt?: string;
}

interface ImageViewerContextProps {
  images: ImageItem[];
  initialIndex?: number;
}

interface ImageViewerContextType {
  openImageDialog: (params: ImageViewerContextProps) => void;
}

const ImageViewerContext = createContext<ImageViewerContextType | null>(null);

export function ImageViewerProvider({ children }: ReactBasicProps) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    images: ImageItem[];
    currentIndex: number;
  }>({
    open: false,
    images: [],
    currentIndex: 0,
  });

  const openImageDialog = ({
    images,
    initialIndex = 0,
  }: ImageViewerContextProps) => {
    setDialogState({
      images,
      currentIndex: initialIndex,
      open: true,
    });
  };

  return (
    <ImageViewerContext.Provider value={{ openImageDialog }}>
      {children}
      <ImageViewerDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        images={dialogState.images}
        currentIndex={dialogState.currentIndex}
        onIndexChange={(index) =>
          setDialogState((prev) => ({ ...prev, currentIndex: index }))
        }
      />
    </ImageViewerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useImageViewer() {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error('useImageViewer must be used within ImageViewerProvider');
  }
  return context;
}
