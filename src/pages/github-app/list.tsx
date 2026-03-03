import { Github, Info, Loader2, Unplug } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { extractApiErrorMessage } from '../../utils/errors';
import type { GitHubAppInstallationDto, SetupInfoResponseDto } from './types';
import { githubAppInstallationsApi } from './types';

interface GitHubAppInstallationsSectionProps {
  githubAppEnabled: boolean;
}

export const GitHubAppInstallationsSection = ({
  githubAppEnabled,
}: GitHubAppInstallationsSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [installations, setInstallations] = useState<
    GitHubAppInstallationDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [setupInfo, setSetupInfo] = useState<SetupInfoResponseDto | null>(null);

  const fetchData = useCallback(async () => {
    if (!githubAppEnabled) {
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
  }, [githubAppEnabled]);

  const activeInstallation = installations.find((i) => i.isActive);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!githubAppEnabled) {
    return null;
  }

  if (error) {
    return <p className="text-destructive text-sm mb-4">{error}</p>;
  }

  const connectedAccountLogin = activeInstallation?.accountLogin;
  const hasInstallations = installations.length > 0;

  const renderStatusBadge = () => {
    if (loading) {
      return (
        <Badge variant="outline" className="gap-1.5 text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Loading...
        </Badge>
      );
    }

    if (hasInstallations) {
      return (
        <Badge
          variant="outline"
          className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
          {connectedAccountLogin
            ? `Connected: ${connectedAccountLogin}`
            : 'Connected'}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="gap-1.5 text-muted-foreground">
        Not connected
      </Badge>
    );
  };

  const callbackUrl = setupInfo?.callbackPath
    ? `${window.location.origin}${setupInfo.callbackPath}`
    : null;

  const installHref = (() => {
    if (!setupInfo?.installUrl) return '';
    if (!callbackUrl) return setupInfo.installUrl;
    const url = new URL(setupInfo.installUrl);
    url.searchParams.set('redirect_uri', callbackUrl);
    return url.toString();
  })();

  return (
    <div className="flex items-center gap-3">
      {renderStatusBadge()}
      {setupInfo?.configured && (
        <>
          {hasInstallations ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5"
              disabled={disconnecting}
              onClick={handleDisconnect}>
              {disconnecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Unplug className="w-3.5 h-3.5" />
              )}
              Disconnect
            </Button>
          ) : (
            <>
              <Button size="sm" className="gap-1.5" asChild>
                <a href={installHref}>
                  <Github className="w-3.5 h-3.5" />
                  Install GitHub App
                </a>
              </Button>
              {callbackUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="text-xs">
                        Add <code>{callbackUrl}</code> as a{' '}
                        <strong>Callback URL</strong> in your GitHub App
                        settings and set <strong>GITHUB_APP_CLIENT_ID</strong>{' '}
                        env var.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
