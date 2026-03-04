/**
 * Configuration index file
 *
 * This file exports the appropriate configuration based on the current environment.
 * It uses the NODE_ENV environment variable to determine which configuration to use.
 *
 * Runtime config (window.__CONFIG__) is injected by docker-entrypoint.sh via envsubst
 * and takes precedence over static build-time config when available.
 */

import * as developmentConfig from './development';
import * as productionConfig from './production';

// Determine which configuration to use based on the environment
const staticConfig =
  import.meta.env.MODE === 'production' ? productionConfig : developmentConfig;

// Runtime config injected by docker-entrypoint.sh (envsubst)
// Falls back to static build-time config if not available
interface RuntimeConfig {
  API_URL?: string;
  WEBSITE_URL?: string;
}

const runtimeConfig = (window as unknown as { __CONFIG__?: RuntimeConfig })
  .__CONFIG__;

export const API_URL = runtimeConfig?.API_URL || staticConfig.API_URL;
export const WEBSITE_URL =
  runtimeConfig?.WEBSITE_URL || staticConfig.WEBSITE_URL;
export const { PROJECT_ID, STORYBOOK_ENABLED } = staticConfig;
