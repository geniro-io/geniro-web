import axios from 'axios';

import { API_URL } from '../../config';

// --- Enums ---

export enum GitHubAuthMethod {
  GitHubApp = 'github_app',
}

// --- Types ---

export interface GitHubAppInstallationDto {
  id: string;
  installationId: number;
  accountLogin: string;
  accountType: string;
  isActive: boolean;
  createdAt: string;
}

export interface LinkInstallationResponseDto {
  linked: boolean;
  accountLogin: string;
  accountType: string;
}

export interface SetupInfoResponseDto {
  installUrl: string;
  configured: boolean;
  callbackPath: string;
  newInstallationUrl: string;
  reconfigureUrlTemplate?: string;
}

export interface GitRepositoryDto {
  id: string;
  owner: string;
  repo: string;
  url: string;
  provider: string;
  defaultBranch: string;
  installationId: number | null;
}

// --- API Service ---

const BASE = `${API_URL}/api/v1/git-auth/github`;

interface ListInstallationsResponse {
  installations: GitHubAppInstallationDto[];
}

// --- System Settings ---

export interface SystemSettingsDto {
  githubAppEnabled: boolean;
  litellmManagementEnabled: boolean;
  isAdmin: boolean;
}

export const systemSettingsApi = {
  getSettings: () =>
    axios.get<SystemSettingsDto>(`${API_URL}/api/v1/system/settings`),
};

export const githubAppInstallationsApi = {
  getSetupInfo: () => axios.get<SetupInfoResponseDto>(`${BASE}/setup`),

  list: () => axios.get<ListInstallationsResponse>(`${BASE}/installations`),

  linkViaOAuthCode: (code: string, installationId?: number) =>
    axios.post<LinkInstallationResponseDto>(`${BASE}/oauth/link`, {
      code,
      installationId,
    }),

  disconnect: (installationId: number) =>
    axios.delete(`${BASE}/installations/${installationId}`),

  disconnectAll: () => axios.delete(`${BASE}/disconnect`),

  syncRepos: () =>
    axios.post<{ synced: number; removed: number; total: number }>(
      `${API_URL}/api/v1/git-repositories/sync`,
    ),

  listReposByInstallation: (installationId: number) =>
    axios.get<GitRepositoryDto[]>(`${API_URL}/api/v1/git-repositories`, {
      params: { installationId },
    }),
};
