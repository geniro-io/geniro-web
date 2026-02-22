import '@refinedev/antd/dist/reset.css';

import {
  ApiOutlined,
  BookOutlined,
  FolderOutlined,
  HomeOutlined,
  MessageOutlined,
  NodeIndexOutlined,
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
import { App as AntdApp } from 'antd';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router';

import { createAuthProvider, useAuth } from './auth';
import { Header } from './components/header';
import { CustomSider } from './components/layout/CustomSider';
import { API_URL, PROJECT_ID } from './config';
import { ChatsPage } from './pages/chats/page';
import { GitHubAppCallbackPage } from './pages/github-app/components/GitHubAppCallbackPage';
import { GraphPage } from './pages/graphs/details';
import { GraphsListPage } from './pages/graphs/list';
import { KnowledgeListPage } from './pages/knowledge/list';
import { MainPage } from './pages/main/page';
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
              name: 'Dashboard',
              list: '/',
              meta: {
                label: 'Dashboard',
                icon: <HomeOutlined />,
              },
            },
            {
              name: 'Graphs',
              list: '/graphs',
              edit: '/graphs/:id',
              meta: {
                label: 'Graphs',
                icon: <NodeIndexOutlined />,
              },
            },
            {
              name: 'Chats',
              list: '/chats',
              meta: {
                label: 'Chats',
                icon: <MessageOutlined />,
              },
            },
            {
              name: 'Repositories',
              list: '/repositories',
              meta: {
                label: 'Repositories',
                icon: <FolderOutlined />,
              },
            },
            {
              name: 'Knowledge',
              list: '/knowledge',
              meta: {
                label: 'Knowledge',
                icon: <BookOutlined />,
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
                </Authenticated>
              }>
              <Route index element={<MainPage />} />
              <Route path="/graphs" element={<GraphsListPage />} />
              <Route path="/graphs/:id" element={<GraphPage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/repositories" element={<RepositoriesListPage />} />
              <Route path="/knowledge" element={<KnowledgeListPage />} />
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
