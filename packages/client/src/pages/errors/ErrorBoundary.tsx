import { Button } from '@/common/components/ui';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error): void {
    console.error('错误边界捕获到错误:', error);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-dvh min-h-dvh flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-4 text-center">
            <h2 className="text-2xl font-bold text-destructive">
              糟糕！出现了一些问题
            </h2>
            <p className="text-muted-foreground">
              应用程序遇到了意外错误。您可以尝试重新加载页面。
            </p>
            <div className="text-sm text-left p-4 bg-secondary/30 rounded-md overflow-auto">
              <pre>{this.state.error?.message}</pre>
            </div>
            <Button onClick={this.handleReload}>重新加载</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
