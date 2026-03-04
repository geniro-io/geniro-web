import {
  BookOpen,
  ChevronLeft,
  FolderGit2,
  Folders,
  Gauge,
  Layers,
  LogOut,
  MessageSquare,
  Network,
  Settings,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';

import { useAuth, useAuthModule } from '../../auth/AuthModuleContext';
import { STORYBOOK_ENABLED } from '../../config';
import { useCurrentProject } from '../../hooks/useCurrentProject';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { PickerTrigger } from '../ui/picker-trigger';

const getInitials = (value: string) => {
  if (!value) return 'U';
  const [first = '', second = ''] = value.trim().split(' ');
  const initials = `${first.charAt(0)}${second.charAt(0)}`.trim();
  return initials.toUpperCase() || value.charAt(0).toUpperCase() || 'U';
};

function resolvePageTitle(
  pathname: string,
  projectId: string | undefined,
): { label: string; backLink?: { href: string; label: string } } {
  if (projectId && pathname.startsWith(`/projects/${projectId}/graphs/`)) {
    return {
      label: 'Editor',
      backLink: {
        href: `/projects/${projectId}/graphs`,
        label: 'Graphs',
      },
    };
  }
  if (pathname.startsWith('/settings')) return { label: 'Settings' };
  if (pathname.startsWith('/dashboard')) return { label: 'Dashboard' };
  if (pathname === '/projects') return { label: 'Projects' };
  if (projectId && pathname.startsWith(`/projects/${projectId}/graphs`)) {
    return { label: 'Graphs' };
  }
  if (projectId && pathname.startsWith(`/projects/${projectId}/chats`)) {
    return {
      label: 'Chats',
      backLink: {
        href: `/projects/${projectId}/graphs`,
        label: 'Graphs',
      },
    };
  }
  if (projectId && pathname.startsWith(`/projects/${projectId}/repositories`))
    return { label: 'Repositories' };
  if (projectId && pathname.startsWith(`/projects/${projectId}/knowledge`))
    return { label: 'Knowledge' };
  if (pathname.startsWith('/storybook')) return { label: 'Storybook' };
  return { label: 'Dashboard' };
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, currentProject, projects } = useCurrentProject();
  const { userInfo } = useAuth();
  const { createAuthProvider } = useAuthModule();

  const { label: currentPage, backLink } = resolvePageTitle(
    location.pathname,
    projectId,
  );

  const displayName = userInfo.name ?? 'User';
  const displayEmail = userInfo.email ?? '';

  const navItems = useMemo(() => {
    const base = [
      { path: '/dashboard', icon: Gauge, label: 'Dashboard' },
      { path: '/projects', icon: Folders, label: 'Projects' },
    ];

    if (projectId) {
      base.push(
        {
          path: `/projects/${projectId}/graphs`,
          icon: Network,
          label: 'Graphs',
        },
        {
          path: `/projects/${projectId}/chats`,
          icon: MessageSquare,
          label: 'Chats',
        },
        {
          path: `/projects/${projectId}/repositories`,
          icon: FolderGit2,
          label: 'Repositories',
        },
        {
          path: `/projects/${projectId}/knowledge`,
          icon: BookOpen,
          label: 'Knowledge',
        },
      );
    }

    if (STORYBOOK_ENABLED) {
      base.push({ path: '/storybook', icon: Layers, label: 'Storybook' });
    }

    return base;
  }, [projectId]);

  const isActive = (path: string) =>
    path === '/projects'
      ? location.pathname === '/projects'
      : location.pathname.startsWith(path);

  const handleLogout = async () => {
    const authProvider = createAuthProvider();
    try {
      const result = await authProvider.logout({});
      if (!result.success) {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  };

  const handleProjectSwitch = (targetProjectId: string) => {
    const sectionMatch = location.pathname.match(
      /\/projects\/[^/]+\/(graphs|chats|knowledge|repositories)(.*)/,
    );
    const section = sectionMatch
      ? `${sectionMatch[1]}${sectionMatch[2]}`
      : 'graphs';
    navigate(`/projects/${targetProjectId}/${section}`);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Full-width header row */}
      <div className="flex border-b border-border bg-card flex-shrink-0">
        {/* Logo cell */}
        <div className="w-52 flex-shrink-0 border-r border-border flex items-center justify-center px-4 py-4">
          <img src="/logo.png" alt="Geniro" className="h-10" />
        </div>

        {/* Header content */}
        <div className="flex-1 flex items-center justify-between px-6 py-4">
          {/* Left: back link + project picker + breadcrumb */}
          <div className="flex items-center gap-3">
            {backLink && (
              <>
                <Link
                  to={backLink.href}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  {backLink.label}
                </Link>
                <span className="text-border">/</span>
              </>
            )}
            {projects.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PickerTrigger>
                    {currentProject?.icon && (
                      <span className="text-lg">{currentProject.icon}</span>
                    )}
                    <span className="text-sm text-foreground">
                      {currentProject?.name ?? 'Select Project'}
                    </span>
                  </PickerTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 p-2">
                  {projects.map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() => handleProjectSwitch(project.id)}
                      className="relative flex items-center gap-3 px-3 py-2.5 cursor-pointer overflow-hidden">
                      {project.color && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      {project.icon && (
                        <span className="text-base leading-none flex-shrink-0">
                          {project.icon}
                        </span>
                      )}
                      <span className="font-medium text-foreground truncate">
                        {project.name}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => navigate('/projects')}>
                    <Folders className="w-4 h-4" />
                    <span>Manage Projects</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{currentPage}</span>
          </div>

          {/* Right: user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none cursor-pointer rounded-lg px-2 py-1 -mr-2 hover:bg-muted transition-colors">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {displayName}
                </p>
                {displayEmail && (
                  <p className="text-xs text-muted-foreground leading-tight">
                    {displayEmail}
                  </p>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                {getInitials(displayName)}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body row */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-52 bg-card border-r border-border flex flex-col flex-shrink-0">
          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}>
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <NavLink
              to="/settings/integrations"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full ${
                isActive('/settings')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}>
              <Settings className="w-4.5 h-4.5" />
              <span className="text-sm">Settings</span>
            </NavLink>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
