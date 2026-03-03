import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Github,
  Info,
  Loader2,
  Unplug,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type GitHubConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'loading';

export interface GitHubIntegrationCardProps {
  state: GitHubConnectionState;
  accountLogin?: string | null;
  accountType?: string | null;
  installHref?: string;
  callbackUrl?: string | null;
  onInstall?: () => void;
  onDisconnect?: () => void;
  disconnecting?: boolean;
}

function StatusBadge({
  state,
  accountLogin,
}: {
  state: GitHubConnectionState;
  accountLogin?: string | null;
}) {
  if (state === 'loading') {
    return (
      <Badge variant="outline" className="gap-1.5 text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Loading...
      </Badge>
    );
  }
  if (state === 'connected') {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {accountLogin ? `Connected: ${accountLogin}` : 'Connected'}
      </Badge>
    );
  }
  if (state === 'connecting') {
    return (
      <Badge variant="outline" className="gap-1.5 text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Connecting...
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
      <Circle className="w-3.5 h-3.5" />
      Not connected
    </Badge>
  );
}

export function GitHubIntegrationCard({
  state,
  accountLogin,
  accountType,
  installHref,
  callbackUrl,
  onInstall,
  onDisconnect,
  disconnecting,
}: GitHubIntegrationCardProps) {
  return (
    <div className="border border-border rounded-lg bg-card">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Github className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">GitHub App</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Connect your GitHub account to enable repository access,
                      pull request reviews, and automated code analysis
                      workflows.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Repository access &amp; pull request automation
            </p>
          </div>
        </div>
        <StatusBadge state={state} accountLogin={accountLogin} />
      </div>

      {/* Connected account info */}
      {state === 'connected' && accountLogin && (
        <div className="px-5 py-3 bg-muted/40 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Connected as</span>
            <a
              href={`https://github.com/${accountLogin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium hover:underline">
              {accountLogin}
              <ExternalLink className="w-3 h-3" />
            </a>
            {accountType && (
              <>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <span className="text-xs text-muted-foreground">
                  {accountType}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Card footer / actions */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-xs text-muted-foreground max-w-sm">
          {state === 'connected'
            ? 'GitHub App is active. Geniro can access your repositories and manage pull requests.'
            : 'Install the Geniro GitHub App to allow repository access and workflow automation.'}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {state === 'connected' ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5"
              disabled={disconnecting}
              onClick={onDisconnect}>
              {disconnecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Unplug className="w-3.5 h-3.5" />
              )}
              Disconnect
            </Button>
          ) : installHref ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="gap-1.5"
                disabled={state === 'connecting'}
                asChild>
                <a href={installHref}>
                  {state === 'connecting' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Github className="w-3.5 h-3.5" />
                  )}
                  {state === 'connecting'
                    ? 'Connecting...'
                    : 'Install GitHub App'}
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
            </div>
          ) : (
            <Button
              size="sm"
              className="gap-1.5"
              disabled={state === 'connecting' || state === 'loading'}
              onClick={onInstall}>
              {state === 'connecting' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Github className="w-3.5 h-3.5" />
              )}
              {state === 'connecting' ? 'Connecting...' : 'Install GitHub App'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
