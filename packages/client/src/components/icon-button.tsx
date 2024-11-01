import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

interface IconButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactNode;
  className?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, icon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        className={cn(
          'flex-shrink-0 rounded-md flex items-center justify-center p-0 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all w-8 h-8 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100',
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
