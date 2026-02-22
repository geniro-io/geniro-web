import axios from 'axios';

import { API_URL } from '../../config';

// --- Enums ---

export enum GitHubAuthMethod {
  Pat = 'pat',
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
}

// --- API Service ---

const BASE = `${API_URL}/api/v1/github-app`;

interface ListInstallationsResponse {
  installations: GitHubAppInstallationDto[];
}

// --- System Settings ---

export interface SystemSettingsDto {
  githubAppEnabled: boolean;
}

export const systemSettingsApi = {
  getSettings: () =>
    axios.get<SystemSettingsDto>(`${API_URL}/api/v1/system/settings`),
};

export const githubAppInstallationsApi = {
  getSetupInfo: () => axios.get<SetupInfoResponseDto>(`${BASE}/setup`),

  list: () => axios.get<ListInstallationsResponse>(`${BASE}/installations`),

  link: (installationId: number) =>
    axios.post<LinkInstallationResponseDto>(
      `${BASE}/installations/${installationId}/link`,
    ),

  linkViaOAuthCode: (code: string) =>
    axios.post<LinkInstallationResponseDto>(`${BASE}/oauth/link`, { code }),

  disconnect: (installationId: number) =>
    axios.delete(`${BASE}/installations/${installationId}`),
};
