import { DownOutlined, LeftOutlined, ProjectOutlined } from '@ant-design/icons';
import type { RefineThemedLayoutHeaderProps } from '@refinedev/antd';
import { useBreadcrumb, useGetIdentity, useLogout } from '@refinedev/core';
import type { MenuProps } from 'antd';
import {
  Avatar,
  Button,
  Dropdown,
  Layout as AntdLayout,
  theme,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useCurrentProject } from '../../hooks/useCurrentProject';

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  email?: string;
  avatar: string;
};

const getInitials = (value: string) => {
  if (!value) return 'U';
  const [first = '', second = ''] = value.trim().split(' ');
  const initials = `${first.charAt(0)}${second.charAt(0)}`.trim();
  return initials.toUpperCase() || value.charAt(0).toUpperCase() || 'U';
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { breadcrumbs } = useBreadcrumb();
  const { mutate: logout } = useLogout();
  const [profileHover, setProfileHover] = useState(false);
  const [projectHover, setProjectHover] = useState(false);
  const location = useLocation();
  const { pathname, search } = location;
  const navigate = useNavigate();
  const { projectId, currentProject, projects } = useCurrentProject();

  const pageTitle = useMemo(
    () =>
      breadcrumbs.length
        ? (breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Dashboard')
        : 'Dashboard',
    [breadcrumbs],
  );

  const displayName = user?.name ?? 'Demo User';
  const displayEmail = user?.email ?? 'demo@example.com';
  const profileMenuItems: MenuProps['items'] = [
    { key: 'logout', label: 'Logout' },
  ];

  const handleProfileMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
    }
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 20px',
    height: '64px',
    borderBottom: '1px solid var(--app-border-color, #E5E7EB)',
  };

  if (sticky) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const projectMenuItems: MenuProps['items'] = useMemo(
    () => [
      ...projects.map((p) => ({
        key: p.id,
        label: `${p.icon ?? ''} ${p.name}`.trim(),
        onClick: () => {
          const sectionMatch = pathname.match(
            /\/projects\/[^/]+\/(graphs|chats|knowledge|repositories)(.*)/,
          );
          const section = sectionMatch
            ? `${sectionMatch[1]}${sectionMatch[2]}`
            : 'graphs';
          navigate(`/projects/${p.id}/${section}`);
        },
      })),
      { type: 'divider' as const },
      {
        key: 'manage',
        label: 'Manage Projects',
        icon: <ProjectOutlined />,
        onClick: () => navigate('/projects'),
      },
    ],
    [projects, navigate, pathname],
  );

  const hardcodedBackTarget = useMemo((): string | undefined => {
    // Project-scoped graph routes
    if (projectId) {
      if (pathname === `/projects/${projectId}/graphs`) {
        return `/projects`;
      }
      if (pathname.startsWith(`/projects/${projectId}/graphs/`)) {
        return `/projects/${projectId}/graphs`;
      }
      if (pathname === `/projects/${projectId}/chats`) {
        const params = new URLSearchParams(search);
        const graphId = params.get('graphId') ?? undefined;
        return graphId
          ? `/projects/${projectId}/graphs/${graphId}`
          : `/projects/${projectId}/graphs`;
      }
    }

    // Legacy fallback
    if (pathname === '/graphs') return '/projects';
    if (pathname.startsWith('/graphs/')) return '/graphs';

    if (pathname === '/chats') {
      const params = new URLSearchParams(search);
      const graphId = params.get('graphId') ?? undefined;
      return graphId ? `/graphs/${graphId}` : '/graphs';
    }

    return undefined;
  }, [pathname, search, projectId]);

  return (
    <AntdLayout.Header style={headerStyles}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {breadcrumbs.length > 1 && (
            <Button
              type="text"
              shape="circle"
              icon={<LeftOutlined />}
              aria-label="Go back"
              style={{
                color: token.colorTextSecondary,
              }}
              onClick={() => {
                if (hardcodedBackTarget) {
                  navigate(hardcodedBackTarget, { replace: true });
                  return;
                }

                navigate('/', { replace: true });
              }}
            />
          )}

          {projects.length > 0 && (
            <Dropdown
              menu={{ items: projectMenuItems }}
              trigger={['click']}
              placement="bottomLeft">
              <div
                onMouseEnter={() => setProjectHover(true)}
                onMouseLeave={() => setProjectHover(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 8,
                  backgroundColor: projectHover
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.2s ease',
                  height: 32,
                }}>
                {currentProject?.icon && (
                  <span style={{ fontSize: 14, lineHeight: 1 }}>
                    {currentProject.icon}
                  </span>
                )}
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: token.colorText,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}>
                  {currentProject?.name ?? 'Select Project'}
                </Text>
                <DownOutlined
                  style={{
                    fontSize: 10,
                    color: token.colorTextTertiary,
                  }}
                />
              </div>
            </Dropdown>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: token.colorText,
                lineHeight: '18px',
              }}>
              {pageTitle}
            </Text>
            {breadcrumbs.length > 1 && (
              <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                {breadcrumbs
                  .map((crumb) => crumb.label)
                  .filter(Boolean)
                  .join(' / ')}
              </Text>
            )}
          </div>
        </div>

        <Dropdown
          menu={{ items: profileMenuItems, onClick: handleProfileMenuClick }}
          placement="bottomRight"
          arrow={true}
          overlayStyle={{ lineHeight: 'normal' }}
          trigger={['click']}>
          <div
            onMouseEnter={() => setProfileHover(true)}
            onMouseLeave={() => setProfileHover(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 48,
              padding: '0 12px',
              borderRadius: 10,
              transition: 'background-color 0.2s ease',
              backgroundColor: profileHover
                ? 'rgba(15, 23, 42, 0.06)'
                : 'transparent',
              cursor: 'pointer',
              userSelect: 'none',
            }}>
            <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
              <Text strong style={{ display: 'block' }}>
                {displayName}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {displayEmail}
              </Text>
            </div>
            <Avatar src={user?.avatar} alt={displayName} size={40}>
              {!user?.avatar && getInitials(displayName)}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </AntdLayout.Header>
  );
};
