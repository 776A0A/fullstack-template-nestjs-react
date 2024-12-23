import { ImageViewerProvider } from '@/common/hooks';
import { MainLayout } from '@/layouts/MainLayout';
import { NotFound } from '@/pages/errors';
import { Project, ProjectWelcome } from '@/pages/project';
import { Signin } from '@/pages/user';
import { useUserStore } from '@/store';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ImageViewerProvider>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="projects" element={<ProjectWelcome />} />
            <Route path="projects/:id" element={<Project />} />
            <Route index element={<Navigate to="/projects" replace />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ImageViewerProvider>
    </BrowserRouter>
  );
}

export default App;

function ProtectedRoute({ children }: ReactBasicProps) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
