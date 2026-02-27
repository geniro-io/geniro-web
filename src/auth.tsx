import { useKeycloak } from '@react-keycloak/web';
import { AuthProvider } from '@refinedev/core';
import axios from 'axios';
import Keycloak from 'keycloak-js';

import { KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, KEYCLOAK_URL } from './config';
import { GraphStorageService } from './services/GraphStorageService';

// Initialize Keycloak
export const keycloak = new Keycloak({
  clientId: KEYCLOAK_CLIENT_ID,
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
});

// Hook to access Keycloak instance and initialized state
export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();
  return { keycloak, initialized };
};

// Auth provider for Refine
export const createAuthProvider = (keycloak: Keycloak): AuthProvider => {
  return {
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
        // Clear all graph states from localStorage on logout
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
  };
};
