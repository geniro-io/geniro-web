import { Cpu, Database, Plug } from 'lucide-react';
import { useMemo } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/components/ui/utils';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface SettingsNavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BASE_NAV_ITEMS: SettingsNavItem[] = [
  { path: '/settings/integrations', label: 'Integrations', icon: Plug },
  { path: '/settings/models', label: 'Model Preferences', icon: Cpu },
];

export const SettingsLayout = () => {
  const location = useLocation();
  const { settings } = useSystemSettings();

  const showLlmAdmin = settings.litellmManagementEnabled && settings.isAdmin;

  const navItems = useMemo<SettingsNavItem[]>(() => {
    const items = [...BASE_NAV_ITEMS];
    if (showLlmAdmin) {
      items.push({
        path: '/settings/llm-models',
        label: 'LLM Models',
        icon: Database,
      });
    }
    return items;
  }, [showLlmAdmin]);

  const isLlmModelsRoute = location.pathname.startsWith('/settings/llm-models');
  if (isLlmModelsRoute && !showLlmAdmin) {
    return <Navigate to="/settings/integrations" replace />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-1 gap-8 px-8 py-6 min-h-0">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Divider */}
        <Separator orientation="vertical" className="flex-shrink-0" />

        {/* Section content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
