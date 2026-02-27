import { createKeycloakModule } from './keycloak';
import type { AuthConfig, AuthModule } from './types';
import { createZitadelModule } from './zitadel';

export type { AuthConfig, AuthModule };

export function resolveAuthModule(config: AuthConfig): AuthModule {
  switch (config.provider) {
    case 'keycloak':
      return createKeycloakModule({
        issuer: config.issuer,
        clientId: config.clientId,
      });
    case 'zitadel':
      return createZitadelModule({
        issuer: config.issuer,
        clientId: config.clientId,
      });
    default:
      throw new Error(
        `Unknown auth provider: ${(config as { provider: string }).provider}`,
      );
  }
}
