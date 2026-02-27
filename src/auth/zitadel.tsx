import { AuthProvider as RefineAuthProvider } from '@refinedev/core';
import { createZitadelAuth, ZitadelConfig } from '@zitadel/react';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';

import { GraphStorageService } from '../services/GraphStorageService';
import type { AuthModule } from './types';

export function createZitadelModule({
  issuer,
  clientId,
}: {
  issuer: string;
  clientId: string;
}): AuthModule {
  const origin = window.location.origin;
  const zitadelConfig: ZitadelConfig = {
    authority: issuer,
    client_id: clientId,
    redirect_uri: `${origin}/callback`,
    post_logout_redirect_uri: origin,
    silent_redirect_uri: `${origin}/silent-renew`,
  };

  const zitadelAuth = createZitadelAuth(zitadelConfig);

  const useAuth = () => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [initialized, setInitialized] = useState(false);
    const [userInfo, setUserInfo] = useState<{
      name?: string;
      email?: string;
      avatar?: string;
      sub?: string;
    }>({});

    useEffect(() => {
      const handleAuth = async () => {
        try {
          // On the callback URL, exchange the auth code for tokens
          if (window.location.pathname === '/callback') {
            await zitadelAuth.userManager.signinRedirectCallback();
            // Redirect to app root; the stored session will be picked up on reload
            window.location.replace('/');
            return;
          }

          // On the silent-renew URL, process the silent token renewal
          if (window.location.pathname === '/silent-renew') {
            await zitadelAuth.userManager.signinSilentCallback();
            return;
          }

          // Normal flow — check for an existing session
          const user = await zitadelAuth.userManager.getUser();
          if (user?.access_token && !user.expired) {
            setToken(user.access_token);
            setUserInfo({
              name: user.profile?.name,
              email: user.profile?.email,
              avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.profile?.name}`,
              sub: user.profile?.sub,
            });
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
        }
        setInitialized(true);
      };

      handleAuth();
    }, []);

    return { token, initialized, userInfo };
  };

  const createAuthProvider = (): RefineAuthProvider => ({
    login: async () => {
      await zitadelAuth.authorize();
      return { success: false, error: new Error('Login failed') };
    },
    logout: async () => {
      try {
        GraphStorageService.clearAllDrafts();
        await zitadelAuth.signout();
        return { success: true, redirectTo: '/login' };
      } catch {
        return { success: false, error: new Error('Logout failed') };
      }
    },
    onError: async (error: unknown) => {
      console.error(error);
      return {
        error: error instanceof Error ? error : new Error(String(error)),
      };
    },
    check: async () => {
      const user = await zitadelAuth.userManager.getUser();
      if (user?.access_token && !user.expired) {
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${user.access_token}`;
        return { authenticated: true };
      }
      return {
        authenticated: false,
        logout: true,
        redirectTo: '/login',
        error: { message: 'Check failed', name: 'Token not found' },
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = await zitadelAuth.userManager.getUser();
      if (!user) return null;
      return {
        name: user.profile?.name,
        email: user.profile?.email,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.profile?.name}`,
      };
    },
  });

  const AuthProviderWrapper = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );

  return { AuthProviderWrapper, useAuth, createAuthProvider };
}
