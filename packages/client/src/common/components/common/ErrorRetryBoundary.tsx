import { cn } from '@/common/utils';
import IconAlertCircle from '~icons/mdi/alert-circle';
import IconRefresh from '~icons/mdi/refresh';

export function ErrorRetryBoundary({
  retry,
  className,
  style,
  error,
  text = '加载失败',
}: ReactBasicProps & { retry: VoidFunction; text?: string; error?: Error }) {
  if (error) console.error(error);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-6 text-destructive',
        className,
      )}
      style={style}
    >
      <IconAlertCircle className="w-6 h-6" />
      <span className="text-sm">{text}</span>
      <button
        onClick={retry}
        className="flex items-center gap-1.5 px-3 py-1.5 mt-2 text-sm rounded-md 
      bg-destructive/10 hover:bg-destructive/20 transition-colors
      text-destructive"
      >
        <IconRefresh className="w-4 h-4" />
        重试
      </button>
    </div>
  );
}
