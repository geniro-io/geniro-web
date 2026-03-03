import { Info } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  type GitHubConnectionState,
  GitHubIntegrationCard,
} from '@/components/ui/github-integration-card';

import { useSystemSettings } from '../../hooks/useSystemSettings';
import { extractApiErrorMessage } from '../../utils/errors';
import type {
  GitHubAppInstallationDto,
  SetupInfoResponseDto,
} from '../github-app/types';
import { githubAppInstallationsApi } from '../github-app/types';

export const IntegrationsPage = () => {
  const { settings, loading: settingsLoading } = useSystemSettings();
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [installations, setInstallations] = useState<
    GitHubAppInstallationDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [setupInfo, setSetupInfo] = useState<SetupInfoResponseDto | null>(null);

  const fetchData = useCallback(async () => {
    if (!settings.githubAppEnabled) {
      setLoading(false);
      return;
    }

    try {
      const [installationsResponse, setupResponse] = await Promise.all([
        githubAppInstallationsApi.list(),
        githubAppInstallationsApi.getSetupInfo().catch((e: unknown) => {
          console.warn('Failed to fetch GitHub App setup info:', e);
          return null;
        }),
      ]);

      setInstallations(installationsResponse.data.installations || []);

      if (setupResponse) {
        setSetupInfo(setupResponse.data);
      }
    } catch (e: unknown) {
      console.error('Error fetching installations:', e);
      const errorMessage = extractApiErrorMessage(
        e,
        'Failed to load installations',
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [settings.githubAppEnabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeInstallation = installations.find((i) => i.isActive);
  const hasInstallations = installations.length > 0;

  const handleDisconnect = useCallback(async () => {
    if (!activeInstallation) return;
    setDisconnecting(true);
    try {
      await githubAppInstallationsApi.disconnect(
        activeInstallation.installationId,
      );
      await fetchData();
    } catch (e: unknown) {
      const errorMessage = extractApiErrorMessage(e, 'Failed to disconnect');
      setError(errorMessage);
    } finally {
      setDisconnecting(false);
    }
  }, [activeInstallation, fetchData]);

  const callbackUrl = setupInfo?.callbackPath
    ? `${window.location.origin}${setupInfo.callbackPath}`
    : null;

  const installHref = (() => {
    if (!setupInfo?.installUrl) return undefined;
    if (!callbackUrl) return setupInfo.installUrl;
    const url = new URL(setupInfo.installUrl);
    url.searchParams.set('redirect_uri', callbackUrl);
    return url.toString();
  })();

  let connectionState: GitHubConnectionState = 'disconnected';
  if (loading) {
    connectionState = 'loading';
  } else if (hasInstallations) {
    connectionState = 'connected';
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect external services to extend Geniro's capabilities.
        </p>
      </div>

      {!settingsLoading && !settings.githubAppEnabled && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>GitHub App integration is not available</AlertTitle>
          <AlertDescription>
            Contact your administrator to enable this feature by configuring the
            required environment variables.
          </AlertDescription>
        </Alert>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {settings.githubAppEnabled && (
        <div className="space-y-3">
          <GitHubIntegrationCard
            state={connectionState}
            accountLogin={activeInstallation?.accountLogin}
            accountType={activeInstallation?.accountType}
            installHref={setupInfo?.configured ? installHref : undefined}
            callbackUrl={callbackUrl}
            onDisconnect={handleDisconnect}
            disconnecting={disconnecting}
          />
        </div>
      )}
    </div>
  );
};
