import copy from 'copy-text-to-clipboard';
import { toast } from 'sonner';
import IconParkOutlineCopy from '~icons/icon-park-outline/copy';
import { IconButton } from './IconButton';

interface CopyIconButtonProps {
  content: string;
}

export function CopyIconButton({ content }: CopyIconButtonProps) {
  const handleCopy = () => {
    if (copy(content)) return toast.success('复制成功');
    return toast.error('复制失败');
  };

  return (
    <IconButton
      icon={<IconParkOutlineCopy className="w-3 h-3" />}
      onClick={handleCopy}
      aria-label="复制内容"
      className="text-foreground w-6 h-6 md:w-6 md:h-6"
    />
  );
}
