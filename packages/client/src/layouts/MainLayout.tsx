import { userApi } from '@/api/user';
import { IconButton, ThemeToggle } from '@/common/components';
import { T2iStatus } from '@/common/lib/t2i';
import { cn } from '@/common/utils';
import { CreateProjectDialog, Projects } from '@/pages/project';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import IconAccount from '~icons/mdi/account-box';
import IconChevronLeft from '~icons/mdi/chevron-left';
import IconChevronRight from '~icons/mdi/chevron-right';
import IconLogout from '~icons/mdi/logout';
import IconPlus from '~icons/mdi/plus';
import IconList from '~icons/mdi/view-list';

export function MainLayout() {
  const [initialized, setInitialized] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleScrollToTop = useCallback(() => {
    document
      .getElementById('main-content')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    setInitialized(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-dvh min-h-dvh bg-background">
      {/* 移动端顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 h-14 bg-background border-b border-border">
          <div className="flex items-center space-x-2 flex-1">
            <IconButton
              icon={isSidebarOpen ? <IconChevronLeft /> : <IconChevronRight />}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            />
            <T2iStatus />
            <h1
              className="text-lg font-semibold flex-1"
              onDoubleClick={handleScrollToTop}
            >
              项目列表
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <IconButton
              icon={showAllProjects ? <IconList /> : <IconAccount />}
              onClick={() => setShowAllProjects(!showAllProjects)}
              className={cn(
                showAllProjects
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : '',
              )}
            />
            <IconButton
              icon={<IconPlus />}
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>
        </div>
      </div>

      {/* 移动端遮罩层 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      {initialized && (
        <aside
          className={cn(
            'fixed md:relative flex flex-col border-r border-border transition-all duration-200 ease-in-out whitespace-nowrap bg-background z-50 h-full',
            isSidebarOpen ? 'w-64' : 'w-0',
          )}
        >
          <div className={cn('w-full h-full flex flex-col overflow-hidden')}>
            {/* 桌面端顶部按钮组 */}
            <div className="hidden md:block p-4 space-y-2 border-b border-border">
              <div className="flex space-x-2 justify-between">
                {/* <IconButton
                  icon={showAllProjects ? <IconList /> : <IconAccount />}
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className={cn(
                    showAllProjects
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : '',
                  )}
                /> */}
                <T2iStatus />
                <IconButton
                  icon={<IconPlus />}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto"
                />
              </div>
            </div>

            {/* 项目列表区域 */}
            <div className="flex-1 overflow-y-auto mt-14 md:mt-0">
              <Projects
                onNavigate={() => {
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
              />
            </div>

            {/* 底部主题切换和展开/收起按钮 */}
            <div className="p-4 mt-auto border-t border-border">
              <div className="flex items-center space-x-2 justify-between">
                <IconButton
                  icon={<IconLogout />}
                  onClick={() => userApi.signout()}
                />
                <ThemeToggle />
              </div>
            </div>
          </div>
          {/* 展开/收起按钮 */}
          <IconButton
            icon={isSidebarOpen ? <IconChevronLeft /> : <IconChevronRight />}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block absolute bottom-6 -translate-y-full right-0 translate-x-full z-10 shadow-md rounded-l-none md:h-10 md:w-6"
          />
        </aside>
      )}

      {/* 主内容区域 */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto p-4 md:p-6 mt-14 md:mt-0 h-[calc(100dvh-3.5rem)] md:h-full"
      >
        <Outlet />
      </main>

      <CreateProjectDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
