import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui';

interface CustomDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

export function CustomDialog({
  title,
  open,
  onOpenChange,
  children,
  trigger,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-106 p-3 sm:p-6 w-[calc(100%-1rem)] rounded-sm sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-xl font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
