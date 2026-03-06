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
  const [removingInstallationId, setRemovingInstallationId] = useState<
    number | null
  >(null);
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

  const hasInstallations = installations.length > 0;

  const [disconnectingAll, setDisconnectingAll] = useState(false);

  const handleRemoveInstallation = useCallback(
    async (installationId: number) => {
      setRemovingInstallationId(installationId);
      try {
        await githubAppInstallationsApi.disconnect(installationId);
        await fetchData();
      } catch (e: unknown) {
        const errorMessage = extractApiErrorMessage(
          e,
          'Failed to remove installation',
        );
        setError(errorMessage);
      } finally {
        setRemovingInstallationId(null);
      }
    },
    [fetchData],
  );

  const handleDisconnectAll = useCallback(async () => {
    if (installations.length === 0) return;
    setDisconnectingAll(true);
    try {
      await githubAppInstallationsApi.disconnectAll();
      await fetchData();
    } catch (e: unknown) {
      const errorMessage = extractApiErrorMessage(
        e,
        'Failed to disconnect GitHub App',
      );
      setError(errorMessage);
    } finally {
      setDisconnectingAll(false);
    }
  }, [fetchData, installations]);

  const callbackUrl = setupInfo?.callbackPath
    ? `${window.location.origin}${setupInfo.callbackPath}`
    : null;

  const installHref = (() => {
    if (!setupInfo?.installUrl) return undefined;
    try {
      const parsed = new URL(setupInfo.installUrl);
      if (parsed.hostname !== 'github.com') return undefined;
    } catch {
      return undefined;
    }
    if (!callbackUrl) return setupInfo.installUrl;
    const url = new URL(setupInfo.installUrl);
    url.searchParams.set('redirect_uri', callbackUrl);
    return url.toString();
  })();

  const addOrgHref = (() => {
    if (!setupInfo?.newInstallationUrl) return undefined;
    try {
      const parsed = new URL(setupInfo.newInstallationUrl);
      if (parsed.hostname !== 'github.com') return undefined;
    } catch {
      return undefined;
    }
    return setupInfo.newInstallationUrl;
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
            installHref={setupInfo?.configured ? installHref : undefined}
            callbackUrl={callbackUrl}
            installations={installations}
            onRemoveInstallation={handleRemoveInstallation}
            removingInstallationId={removingInstallationId}
            onDisconnect={handleDisconnectAll}
            disconnecting={disconnectingAll}
            addOrgHref={setupInfo?.configured ? addOrgHref : undefined}
            syncHref={setupInfo?.configured ? installHref : undefined}
          />
        </div>
      )}
    </div>
  );
};
