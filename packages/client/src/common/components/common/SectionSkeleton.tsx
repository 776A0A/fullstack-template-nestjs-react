import { cn } from '@/common/utils';
import { Skeleton } from '../ui';

interface SectionSkeletonProps {
  className?: string;
  title: string;
}

export function SectionSkeleton({ title, className }: SectionSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-xl', className)}>
      <Skeleton className="bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60 z-10 rounded-t-xl border-b border-border/50">
        <h2 className="text-xl md:text-2xl font-bold py-3 md:py-4 px-4 md:px-6 text-foreground">
          {title}
        </h2>
      </Skeleton>
      <div className="p-3 md:p-6">
        <Skeleton className="w-full h-36 md:h-41 rounded-lg" />
      </div>
    </div>
  );
}
