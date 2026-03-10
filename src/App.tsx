import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';

import type { AuthModule } from './auth/types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { Card } from './components/ui/card';
import { STORYBOOK_ENABLED } from './config';
import { ProjectProvider, useProjectContext } from './contexts/ProjectContext';
import { ChatsPage } from './pages/chats/page';
import { GitHubAppCallbackPage } from './pages/github-app/components/GitHubAppCallbackPage';
import { GraphPage } from './pages/graphs/details';
import { GraphsListPage } from './pages/graphs/list';
import { KnowledgeListPage } from './pages/knowledge/list';
import { MainPage } from './pages/main/page';
import { CreateProjectPage } from './pages/projects/create';
import { ProjectsListPage } from './pages/projects/list';
import { RepositoriesListPage } from './pages/repositories/list';
import { IntegrationsPage } from './pages/settings/IntegrationsPage';
import { ModelsPage } from './pages/settings/ModelsPage';
import { SettingsLayout } from './pages/settings/SettingsLayout';
import { StorybookPage } from './pages/storybook/page';

// Login page: redirects to the SSO provider
const LoginPage = ({ authModule }: { authModule: AuthModule }) => {
  const { token } = authModule.useAuth();
  const authProvider = useMemo(
    () => authModule.createAuthProvider(),
    [authModule],
  );

  useEffect(() => {
    if (!token) {
      authProvider.login({});
    }
  }, [token, authProvider]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-80 flex flex-col items-center gap-4 p-8">
        <img src="/logo.png" alt="Geniro" className="h-10" />
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Card>
    </div>
  );
};

// Guard: require authentication
const RequireAuth = ({
  children,
  authModule,
}: {
  children: React.ReactNode;
  authModule: AuthModule;
}) => {
  const { token, initialized } = authModule.useAuth();

  // Set Axios Authorization header synchronously so child components
  // (like ProjectProvider) have the header set before their effects run
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Guard: if user has no projects, redirect to /onboarding
const RequireProject = ({ children }: { children: React.ReactNode }) => {
  const { projects, loading } = useProjectContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

function App({ authModule }: { authModule: AuthModule }) {
  const { initialized } = authModule.useAuth();

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Authenticated + project context */}
        <Route
          element={
            <RequireAuth authModule={authModule}>
              <ProjectProvider>
                <Outlet />
              </ProjectProvider>
            </RequireAuth>
          }>
          {/* Group 1: Layout (sidebar + header) — all pages require at least one project */}
          <Route
            element={
              <ErrorBoundary>
                <Layout>
                  <RequireProject>
                    <Outlet />
                  </RequireProject>
                </Layout>
              </ErrorBoundary>
            }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<MainPage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route
              path="/projects/:projectId/graphs"
              element={<GraphsListPage />}
            />
            <Route
              path="/projects/:projectId/graphs/:id"
              element={<GraphPage />}
            />
            <Route path="/projects/:projectId/chats" element={<ChatsPage />} />
            <Route
              path="/projects/:projectId/repositories"
              element={<RepositoriesListPage />}
            />
            <Route
              path="/projects/:projectId/knowledge"
              element={<KnowledgeListPage />}
            />
            {/* Legacy route redirects */}
            <Route
              path="/graphs"
              element={<Navigate to="/projects" replace />}
            />
            <Route
              path="/graphs/:id"
              element={<Navigate to="/projects" replace />}
            />
            <Route
              path="/chats"
              element={<Navigate to="/projects" replace />}
            />
            <Route
              path="/repositories"
              element={<Navigate to="/projects" replace />}
            />
            <Route
              path="/knowledge"
              element={<Navigate to="/projects" replace />}
            />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="integrations" replace />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="models" element={<ModelsPage />} />
            </Route>
            <Route
              path="/github-app/callback"
              element={<GitHubAppCallbackPage />}
            />
            {STORYBOOK_ENABLED && (
              <Route path="/storybook" element={<StorybookPage />} />
            )}
            <Route
              path="*"
              element={
                <div className="p-8 text-destructive">Page not found</div>
              }
            />
          </Route>

          {/* Group 2: Full-screen (no layout) */}
          <Route path="/onboarding" element={<CreateProjectPage />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<LoginPage authModule={authModule} />} />
        <Route
          path="/callback"
          element={
            <div className="flex h-screen items-center justify-center bg-background">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
        />
        <Route path="/silent-renew" element={<div />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
