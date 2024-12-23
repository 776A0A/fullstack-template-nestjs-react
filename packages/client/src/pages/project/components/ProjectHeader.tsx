import { IconButton } from '@/common/components';
import { Badge } from '@/common/components/ui';
import IconParkOutlineEnglish from '~icons/icon-park-outline/english';
import IconDownload from '~icons/mdi/download';
import { useProject } from '../context';
import { downloadStoryboard } from '../utils';

function ProjectHeader() {
  const { project } = useProject();

  const handleDownload = async () => {
    await downloadStoryboard(project.id);
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <Badge
            variant="outline"
            className="mt-1 ml-2 flex items-center gap-1 text-sm"
          >
            <IconParkOutlineEnglish className="w-4 h-4" />
            <span>{project.lexileLevel}</span>
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-4 bg-primary/10 text-primary rounded-sm text-sm"
            >
              {tag.value}
            </span>
          ))}
        </div>
      </div>
      <IconButton
        icon={<IconDownload className="w-3 h-3 md:w-4 md:h-4" />}
        onClick={handleDownload}
        className="ml-4 self-center"
        aria-label="下载项目数据"
      />
    </div>
  );
}

export default ProjectHeader;
