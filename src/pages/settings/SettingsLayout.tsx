import { Plug } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';

import { cn } from '@/components/ui/utils';

interface SettingsNavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  { path: '/settings/integrations', label: 'Integrations', icon: Plug },
];

export const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-1 gap-8 px-8 py-6 min-h-0">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {SETTINGS_NAV_ITEMS.map((item) => {
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
        <div className="w-px bg-border flex-shrink-0" />

        {/* Section content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
