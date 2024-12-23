import { Card, CardContent } from '@/common/components/ui';
import MdiFilmOpenEdit from '~icons/mdi/film-open-edit';

function ProjectWelcome() {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <MdiFilmOpenEdit className="w-12 h-12 text-primary/80" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            选择一个项目开始
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            从侧边栏选择一个项目，或者点击"+"创建新项目
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProjectWelcome;
