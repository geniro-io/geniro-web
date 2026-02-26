import '@refinedev/antd/dist/reset.css';

import {
  ApiOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import {
  ErrorComponent,
  ThemedLayout,
  useNotificationProvider,
} from '@refinedev/antd';
import { Authenticated, AuthProvider, Refine } from '@refinedev/core';
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import dataProvider from '@refinedev/simple-rest';
import { App as AntdApp, Spin } from 'antd';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from 'react-router';

import { createAuthProvider, useAuth } from './auth';
import { Header } from './components/header';
import { CustomSider } from './components/layout/CustomSider';
import { API_URL, PROJECT_ID } from './config';
import { ProjectProvider, useProjectContext } from './contexts/ProjectContext';
import { ChatsPage } from './pages/chats/page';
import { GitHubAppCallbackPage } from './pages/github-app/components/GitHubAppCallbackPage';
import { GraphPage } from './pages/graphs/details';
import { GraphsListPage } from './pages/graphs/list';
import { KnowledgeListPage } from './pages/knowledge/list';
import { CreateProjectPage } from './pages/projects/create';
import { ProjectsListPage } from './pages/projects/list';
import { RepositoriesListPage } from './pages/repositories/list';
import { IntegrationsPage } from './pages/settings/IntegrationsPage';

// Login page component that redirects to Keycloak
const LoginPage = ({ authProvider }: { authProvider: AuthProvider }) => {
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (!keycloak.authenticated) {
      authProvider.login({});
    }
  }, [keycloak, authProvider]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      Redirecting to login...
    </div>
  );
};

// Guard that redirects to /projects/create if no projects exist
const RequireProject = ({ children }: { children: React.ReactNode }) => {
  const { projects, loading } = useProjectContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && projects.length === 0) {
      navigate('/projects/create', { replace: true });
    }
  }, [projects, loading, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  const { keycloak, initialized } = useAuth();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  const authProvider = createAuthProvider(keycloak);

  return (
    <BrowserRouter>
      <AntdApp>
        <Refine
          dataProvider={dataProvider(API_URL)}
          notificationProvider={useNotificationProvider}
          routerProvider={routerBindings}
          authProvider={authProvider}
          resources={[
            {
              name: 'Projects',
              list: '/projects',
              meta: {
                label: 'Projects',
                icon: <ProjectOutlined />,
              },
            },
            {
              name: 'Graphs',
              list: '/projects/:projectId/graphs',
              edit: '/projects/:projectId/graphs/:id',
              meta: {
                label: 'Graphs',
                hide: true,
              },
            },
            {
              name: 'Chats',
              list: '/projects/:projectId/chats',
              meta: {
                label: 'Chats',
                hide: true,
              },
            },
            {
              name: 'Repositories',
              list: '/projects/:projectId/repositories',
              meta: {
                label: 'Repositories',
                hide: true,
              },
            },
            {
              name: 'Knowledge',
              list: '/projects/:projectId/knowledge',
              meta: {
                label: 'Knowledge',
                hide: true,
              },
            },
            {
              name: 'Settings',
              meta: {
                label: 'Settings',
                icon: <SettingOutlined />,
              },
            },
            {
              name: 'Integrations',
              list: '/settings/integrations',
              meta: {
                label: 'Integrations',
                parent: 'Settings',
                icon: <ApiOutlined />,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: PROJECT_ID,
          }}>
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}>
                  <ProjectProvider>
                    <ThemedLayout
                      Header={Header}
                      Title={({ collapsed }: { collapsed: boolean }) => (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: '16px 0',
                          }}>
                          <img
                            src={collapsed ? '/logo.svg' : '/logo-full.svg'}
                            alt="Geniro.io"
                            style={
                              collapsed
                                ? { width: 32, height: 32 }
                                : { height: 32 }
                            }
                          />
                        </div>
                      )}
                      Sider={CustomSider}>
                      <Outlet />
                    </ThemedLayout>
                  </ProjectProvider>
                </Authenticated>
              }>
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/projects/create" element={<CreateProjectPage />} />
              <Route
                path="/projects/:projectId/graphs"
                element={
                  <RequireProject>
                    <GraphsListPage />
                  </RequireProject>
                }
              />
              <Route
                path="/projects/:projectId/graphs/:id"
                element={
                  <RequireProject>
                    <GraphPage />
                  </RequireProject>
                }
              />
              <Route
                path="/projects/:projectId/chats"
                element={
                  <RequireProject>
                    <ChatsPage />
                  </RequireProject>
                }
              />
              <Route
                path="/projects/:projectId/repositories"
                element={
                  <RequireProject>
                    <RepositoriesListPage />
                  </RequireProject>
                }
              />
              <Route
                path="/projects/:projectId/knowledge"
                element={
                  <RequireProject>
                    <KnowledgeListPage />
                  </RequireProject>
                }
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
              <Route path="/settings">
                <Route index element={<Navigate to="integrations" replace />} />
                <Route path="integrations" element={<IntegrationsPage />} />
              </Route>
              <Route
                path="/github-app/callback"
                element={<GitHubAppCallbackPage />}
              />
              <Route path="*" element={<ErrorComponent />} />
            </Route>
            <Route
              path="/login"
              element={<LoginPage authProvider={authProvider} />}
            />
          </Routes>

          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
