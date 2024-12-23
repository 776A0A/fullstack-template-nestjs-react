import { IconButton } from '@/common/components';
import IconImageMultiple from '~icons/mdi/image-multiple';
import IconImageRefresh from '~icons/mdi/image-refresh';
import { T2I_CONSTANTS } from '../constants';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isBatch?: boolean;
  size?: keyof typeof T2I_CONSTANTS.BUTTON_SIZES;
  className?: string;
}

export function GenerateButton({
  onClick,
  disabled,
  isBatch,
  size = 'MEDIUM',
  className,
}: GenerateButtonProps) {
  const Icon = isBatch ? IconImageMultiple : IconImageRefresh;

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      icon={<Icon className={T2I_CONSTANTS.COMMON_STYLES.ICON} />}
      className={`${T2I_CONSTANTS.BUTTON_SIZES[size]} ${className}`}
    />
  );
}
