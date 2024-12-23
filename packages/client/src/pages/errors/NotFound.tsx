import { Button } from '@/common/components/ui';
import { Link, useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-dvh min-h-dvh flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-4 sm:space-y-6">
        <h1 className="text-5xl sm:text-6xl font-bold text-primary">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
          页面未找到
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          抱歉，您访问的页面不存在或已被移除
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Button className="w-full sm:w-auto text-sm h-9" asChild>
            <Link to="#" onClick={() => navigate(-1)}>
              返回上一页
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto text-sm h-9"
            asChild
          >
            <Link to="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
