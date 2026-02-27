import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { AuthProvider } from '@refinedev/core';
import axios from 'axios';
import Keycloak from 'keycloak-js';
import { ReactNode } from 'react';

import { GraphStorageService } from '../services/GraphStorageService';
import type { AuthModule } from './types';

export function createKeycloakModule({
  issuer,
  clientId,
}: {
  issuer: string;
  clientId: string;
}): AuthModule {
  const keycloak = new Keycloak({
    clientId,
    oidcProvider: issuer,
  });

  const useAuth = () => {
    const { keycloak: kc, initialized } = useKeycloak();
    return {
      token: kc.token,
      initialized,
      userInfo: {
        name: (kc.tokenParsed as { name?: string } | undefined)?.name,
        email: (kc.tokenParsed as { email?: string } | undefined)?.email,
        avatar: (kc.tokenParsed as { picture?: string } | undefined)?.picture,
        sub: kc.tokenParsed?.sub,
      },
    };
  };

  const createAuthProvider = (): AuthProvider => ({
    login: async () => {
      await keycloak.login({
        redirectUri: window.location.origin,
      });

      return {
        success: false,
        error: new Error('Login failed'),
      };
    },
    logout: async () => {
      try {
        GraphStorageService.clearAllDrafts();

        await keycloak.logout({
          redirectUri: window.location.origin,
        });

        return {
          success: true,
          redirectTo: '/login',
        };
      } catch (_error) {
        return {
          success: false,
          error: new Error('Logout failed'),
        };
      }
    },
    onError: async (error: unknown) => {
      console.error(error);
      return {
        error: error instanceof Error ? error : new Error(String(error)),
      };
    },
    check: async () => {
      try {
        const { token } = keycloak;

        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return {
            authenticated: true,
          };
        } else {
          return {
            authenticated: false,
            logout: true,
            redirectTo: '/login',
            error: {
              message: 'Check failed',
              name: 'Token not found',
            },
          };
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        return {
          authenticated: false,
          logout: true,
          redirectTo: '/login',
          error: {
            message: 'Check failed',
            name: 'Token not found',
          },
        };
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      if (keycloak?.tokenParsed) {
        const tokenParsed = keycloak.tokenParsed as {
          name?: string;
          email?: string;
          picture?: string;
        };
        return {
          name: tokenParsed.name,
          email: tokenParsed.email,
          avatar:
            tokenParsed.picture ||
            `https://api.dicebear.com/7.x/pixel-art/svg?seed=${tokenParsed.name}`,
        };
      }
      return null;
    },
  });

  const AuthProviderWrapper = ({ children }: { children: ReactNode }) => (
    <ReactKeycloakProvider authClient={keycloak} autoRefreshToken>
      {children}
    </ReactKeycloakProvider>
  );

  return { AuthProviderWrapper, useAuth, createAuthProvider };
}
