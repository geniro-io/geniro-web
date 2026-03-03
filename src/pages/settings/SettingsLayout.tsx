import { Puzzle } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';

import { cn } from '@/components/ui/utils';

interface SettingsNavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  { path: '/settings/integrations', label: 'Integrations', icon: Puzzle },
];

export const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-full">
      {/* Left navigation sidebar */}
      <nav className="w-56 border-r border-border bg-card p-4 overflow-y-auto shrink-0">
        <h2 className="text-sm font-semibold text-foreground mb-4">Settings</h2>
        <ul className="space-y-0.5">
          {SETTINGS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right content area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
