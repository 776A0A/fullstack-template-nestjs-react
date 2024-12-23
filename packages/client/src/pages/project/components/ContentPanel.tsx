import { CopyIconButton } from '@/common/components';
import { Badge, Skeleton } from '@/common/components/ui';
import { cn } from '@/common/utils';
import { ReactNode } from 'react';

interface ContentPanelProps {
  title: string;
  version: number | string;
  content: string;
  children?: ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'destructive';
  className?: string;
  isDashed?: boolean;
}

export function ContentPanel({
  title,
  version,
  content,
  children,
  variant = 'secondary',
  className = '',
  isDashed = false,
}: ContentPanelProps) {
  return (
    <div
      className={cn(
        `space-y-3 md:space-y-4 px-4 py-2 md:px-6 md:py-4 rounded-lg max-h-100 md:max-h-[37.5rem] overflow-y-auto`,
        isDashed ? 'border-2 border-dashed' : 'border',
        className,
      )}
    >
      <div className="flex justify-between items-center sticky -top-2 md:-top-4 bg-background z-10 py-2 md:py-4 -mt-2 md:-mt-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mx-4 md:-mx-6 px-4 md:px-6">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <Badge variant={variant}>v{version}</Badge>
          <CopyIconButton content={content} />
        </div>
      </div>
      {children || (
        <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );
}

ContentPanel.Skeleton = function ContentPanelSkeleton() {
  return (
    <div className="space-y-3 md:space-y-4 p-4 md:p-6 border rounded-lg">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 md:h-8 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};
