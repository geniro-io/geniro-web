import { ReactNode } from 'react';

export interface AuthConfig {
  provider: 'keycloak' | 'zitadel';
  issuer: string;
  clientId: string;
}

/**
 * Auth action response returned by login/logout/register/etc.
 * Structurally identical to Refine's AuthActionResponse.
 */
export type AuthActionResponse = {
  success: boolean;
  redirectTo?: string;
  error?: Error;
  [key: string]: unknown;
};

export type CheckResponse = {
  authenticated: boolean;
  redirectTo?: string;
  logout?: boolean;
  error?: Error | { message: string; name: string };
};

export type OnErrorResponse = {
  redirectTo?: string;
  logout?: boolean;
  error?: Error;
};

/**
 * Local AuthProvider interface — structurally identical to Refine's AuthProvider.
 * Decoupled so we can remove Refine dependency progressively.
 */
export type AuthProvider = {
  login: (params: unknown) => Promise<AuthActionResponse>;
  logout: (params: unknown) => Promise<AuthActionResponse>;
  check: (params?: unknown) => Promise<CheckResponse>;
  onError: (error: unknown) => Promise<OnErrorResponse>;
  getPermissions?: (params?: Record<string, unknown>) => Promise<unknown>;
  getIdentity?: (params?: unknown) => Promise<unknown>;
};

export interface AuthModule {
  AuthProviderWrapper: React.ComponentType<{ children: ReactNode }>;
  useAuth: () => {
    token: string | undefined;
    initialized: boolean;
    userInfo: {
      name?: string;
      email?: string;
      avatar?: string;
      sub?: string;
    };
  };
  createAuthProvider: () => AuthProvider;
}
