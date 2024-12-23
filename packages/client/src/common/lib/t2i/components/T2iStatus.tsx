import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/components/ui';
import { cn } from '@/common/utils';
import IconLoading from '~icons/mdi/loading';
import IconSignal from '~icons/mdi/signal';
import IconSignalOff from '~icons/mdi/signal-off';
import { useT2iStore } from '../use-t2i.store';

export function T2iStatus() {
  const connect = useT2iStore((state) => state.connect);
  const isConnectedToServer = useT2iStore((state) => state.isConnectedToServer);
  const isWebSocketPending = useT2iStore((state) => state.isWebSocketPending);

  const renderIcon = () => {
    if (isWebSocketPending) {
      return <IconLoading className="h-4 w-4 animate-spin" />;
    }
    if (isConnectedToServer) {
      return <IconSignal className="h-4 w-4 text-success" />;
    }
    return <IconSignalOff className="h-4 w-4 text-destructive" />;
  };

  const getTooltipText = () => {
    if (isWebSocketPending) {
      return '正在连接...';
    }
    if (isConnectedToServer) {
      return '已连接';
    }
    return '点击连接';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', isWebSocketPending && 'cursor-wait')}
            onClick={!isConnectedToServer ? connect : undefined}
          >
            {renderIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
