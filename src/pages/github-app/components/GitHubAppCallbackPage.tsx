import { Loader2, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { extractApiErrorMessage } from '../../../utils/errors';
import { githubAppInstallationsApi } from '../types';

type CallbackState =
  | { status: 'linking' }
  | { status: 'error'; message: string }
  | { status: 'request-pending' }
  | { status: 'installation-detected' };

const resolveInitialState = (
  setupAction: string | null,
  code: string | null,
  installationId: string | null,
): CallbackState => {
  if (setupAction === 'request') {
    return { status: 'request-pending' };
  }

  if (code) {
    return { status: 'linking' };
  }

  if (installationId) {
    return { status: 'installation-detected' };
  }

  return {
    status: 'error',
    message:
      'No authorization code received from GitHub. Please try again or link manually.',
  };
};

export const GitHubAppCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const installationId = searchParams.get('installation_id');
  const setupAction = searchParams.get('setup_action');
  const code = searchParams.get('code');

  const [state, setState] = useState<CallbackState>(() =>
    resolveInitialState(setupAction, code, installationId),
  );
  const hasRun = useRef(false);

  // Handle OAuth code flow
  useEffect(() => {
    if (hasRun.current) return;
    if (state.status !== 'linking') return;
    if (!code) return;
    hasRun.current = true;

    const linkViaOAuth = async () => {
      try {
        await githubAppInstallationsApi.linkViaOAuthCode(code);
        toast.success('GitHub organization linked successfully.');
        navigate('/settings/integrations', { replace: true });
      } catch (e: unknown) {
        const errorMessage = extractApiErrorMessage(
          e,
          'Failed to link installation',
        );
        if (errorMessage.includes('NO_INSTALLATIONS_FOUND')) {
          toast.error('No GitHub organizations were linked. Please try again.');
          navigate('/settings/integrations', { replace: true });
        } else {
          setState({ status: 'error', message: errorMessage });
        }
      }
    };

    linkViaOAuth();
  }, [code, state.status, navigate]);

  // Handle installation-only callback (no OAuth code) — auto-redirect to OAuth authorize URL
  useEffect(() => {
    if (state.status !== 'installation-detected') return;

    const redirectToOAuth = async () => {
      try {
        const response = await githubAppInstallationsApi.getSetupInfo();
        const { installUrl, callbackPath } = response.data;
        if (!installUrl) {
          throw new Error('No install URL available');
        }
        const callbackUrl = `${window.location.origin}${callbackPath}`;
        const url = new URL(installUrl);
        url.searchParams.set('redirect_uri', callbackUrl);
        window.location.href = url.toString();
      } catch {
        toast.info(
          'GitHub App installed. Redirecting to settings to complete linking.',
        );
        navigate('/settings/integrations', { replace: true });
      }
    };

    redirectToOAuth();
  }, [state.status, navigate]);

  // Handle request-pending callback — redirect to settings
  useEffect(() => {
    if (state.status !== 'request-pending') return;
    const timer = setTimeout(() => {
      navigate('/settings/integrations', { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [state.status, navigate]);

  if (state.status === 'linking') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-9 h-9 text-primary animate-spin" />
        <p className="text-muted-foreground">
          Linking GitHub App installation...
        </p>
      </div>
    );
  }

  if (state.status === 'installation-detected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-lg mx-auto">
        <Loader2 className="w-9 h-9 text-primary animate-spin" />
        <p className="text-muted-foreground">Completing installation...</p>
      </div>
    );
  }

  if (state.status === 'request-pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Installation Request Pending
        </h2>
        <p className="text-muted-foreground">
          Your request to install the GitHub App has been sent to the
          organization admin. Once approved, the installation will appear here
          automatically.
        </p>
        <Button
          onClick={() => navigate('/settings/integrations', { replace: true })}>
          Go to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-lg mx-auto">
      <XCircle className="w-16 h-16 text-destructive" />
      <h2 className="text-2xl font-semibold text-foreground">
        Installation Failed
      </h2>
      <p className="text-muted-foreground">{state.message}</p>
      <Button
        onClick={() => navigate('/settings/integrations', { replace: true })}>
        Go to Settings
      </Button>
    </div>
  );
};
