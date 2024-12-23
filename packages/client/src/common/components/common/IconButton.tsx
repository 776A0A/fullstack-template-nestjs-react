import { Button } from '@/common/components/ui';
import { cn } from '@/common/utils';
import { forwardRef } from 'react';

interface IconButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, icon, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'flex-shrink-0 rounded-md flex items-center justify-center p-0 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all w-7 h-7 md:w-8 md:h-8 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100 disabled:pointer-events-none',
          className,
        )}
        variant="outline"
        {...props}
      >
        {icon}
      </Button>
    );
  },
);

IconButton.displayName = 'IconButton';
