import { cn } from '@/common/utils';

interface EmptyUIProps extends ReactBasicProps {
  icon?: React.ReactNode;
  text?: string;
  action?: React.ReactNode;
}

export function EmptyUI({ icon, text, action, className }: EmptyUIProps) {
  return (
    <EmptyUIBase className={cn('h-48 md:h-96', className)}>
      {icon && <div className="mb-3">{icon}</div>}
      {text && (
        <div className="text-muted-foreground text-sm text-center px-4">
          {text}
        </div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </EmptyUIBase>
  );
}

export function EmptyUIBase({ children, className }: ReactBasicProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-36 md:h-41 border-2 border-dashed rounded-lg border-border',
        className,
      )}
    >
      {children}
    </div>
  );
}
