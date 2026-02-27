import { createContext, useContext } from 'react';

import type { AuthModule } from './types';

const AuthModuleContext = createContext<AuthModule | null>(null);

export function AuthModuleProvider({
  module,
  children,
}: {
  module: AuthModule;
  children: React.ReactNode;
}) {
  return (
    <AuthModuleContext.Provider value={module}>
      {children}
    </AuthModuleContext.Provider>
  );
}

export function useAuthModule(): AuthModule {
  const ctx = useContext(AuthModuleContext);
  if (!ctx) {
    throw new Error('useAuthModule must be used within AuthModuleProvider');
  }
  return ctx;
}

export function useAuth() {
  const { useAuth: authHook } = useAuthModule();
  return authHook();
}
