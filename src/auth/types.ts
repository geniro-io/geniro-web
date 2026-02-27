import { AuthProvider } from '@refinedev/core';
import { ReactNode } from 'react';

export interface AuthConfig {
  provider: 'keycloak' | 'zitadel';
  issuer: string;
  clientId: string;
}

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
