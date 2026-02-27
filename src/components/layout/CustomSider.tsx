import {
  BookOutlined,
  FolderOutlined,
  MessageOutlined,
  NodeIndexOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  type RefineThemedLayoutSiderProps,
  ThemedSider,
} from '@refinedev/antd';
import { Menu } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';

import { useCurrentProject } from '../../hooks/useCurrentProject';

const SIDEBAR_WIDTH = {
  expanded: 200,
  collapsed: 80,
} as const;

const SiderBorderOverlay = ({ collapsed }: { collapsed?: boolean }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 991px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  if (typeof document === 'undefined' || isMobile) {
    return null;
  }

  const borderStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: '1px',
    backgroundColor: 'var(--app-border-color)',
    left: `${collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded}px`,
    zIndex: 101,
    pointerEvents: 'none',
  };

  return createPortal(<div style={borderStyle} />, document.body);
};

const ProjectScopedNav = ({ collapsed }: { collapsed?: boolean }) => {
  const { projectId } = useCurrentProject();
  const navigate = useNavigate();
  const location = useLocation();

  const projectNavItems = projectId
    ? [
        {
          key: `/projects/${projectId}/graphs`,
          icon: <NodeIndexOutlined />,
          label: collapsed ? null : 'Graphs',
        },
        {
          key: `/projects/${projectId}/chats`,
          icon: <MessageOutlined />,
          label: collapsed ? null : 'Chats',
        },
        {
          key: `/projects/${projectId}/repositories`,
          icon: <FolderOutlined />,
          label: collapsed ? null : 'Repositories',
        },
        {
          key: `/projects/${projectId}/knowledge`,
          icon: <BookOutlined />,
          label: collapsed ? null : 'Knowledge',
        },
      ]
    : [];

  const settingsItem = {
    key: '/settings',
    icon: <SettingOutlined />,
    label: collapsed ? null : 'Settings',
    children: [
      {
        key: '/settings/integrations',
        label: 'Integrations',
      },
    ],
  };

  const navItems = [...projectNavItems, settingsItem];

  const selectedKey = [...projectNavItems, ...settingsItem.children].find(
    (item) => location.pathname.startsWith(item.key),
  )?.key;

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedKey ? [selectedKey] : []}
      inlineCollapsed={collapsed}
      items={navItems}
      onClick={({ key }) => navigate(key)}
      style={{ border: 'none', background: 'transparent' }}
    />
  );
};

export const CustomSider = (props: RefineThemedLayoutSiderProps) => {
  return (
    <ThemedSider
      {...props}
      fixed
      render={({ items, collapsed }) => (
        <>
          <SiderBorderOverlay collapsed={collapsed} />
          {items}
          <ProjectScopedNav collapsed={collapsed} />
        </>
      )}
    />
  );
};
