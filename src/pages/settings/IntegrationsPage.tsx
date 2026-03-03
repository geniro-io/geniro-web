import { Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useSystemSettings } from '../../hooks/useSystemSettings';
import { GitHubAppInstallationsSection } from '../github-app/list';

export const IntegrationsPage = () => {
  const { settings, loading } = useSystemSettings();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Integrations
      </h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-foreground">
          GitHub App Integration
        </h2>
        <GitHubAppInstallationsSection
          githubAppEnabled={settings.githubAppEnabled}
        />
      </div>

      {!loading && !settings.githubAppEnabled && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>GitHub App integration is not available</AlertTitle>
          <AlertDescription>
            Contact your administrator to enable this feature by configuring the
            required environment variables.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
