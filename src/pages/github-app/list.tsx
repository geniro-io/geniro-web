import {
  DisconnectOutlined,
  GithubOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { extractApiErrorMessage } from '../../utils/errors';
import type { GitHubAppInstallationDto, SetupInfoResponseDto } from './types';
import { githubAppInstallationsApi } from './types';

const { Text } = Typography;

interface GitHubAppInstallationsSectionProps {
  githubAppEnabled: boolean;
}

export const GitHubAppInstallationsSection = ({
  githubAppEnabled,
}: GitHubAppInstallationsSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [installations, setInstallations] = useState<
    GitHubAppInstallationDto[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [setupInfo, setSetupInfo] = useState<SetupInfoResponseDto | null>(null);

  const fetchData = useCallback(async () => {
    if (!githubAppEnabled) {
      setLoading(false);
      return;
    }

    try {
      const [installationsResponse, setupResponse] = await Promise.all([
        githubAppInstallationsApi.list(),
        githubAppInstallationsApi.getSetupInfo().catch((e: unknown) => {
          console.warn('Failed to fetch GitHub App setup info:', e);
          return null;
        }),
      ]);

      setInstallations(installationsResponse.data.installations || []);

      if (setupResponse) {
        setSetupInfo(setupResponse.data);
      }
    } catch (e: unknown) {
      console.error('Error fetching installations:', e);
      const errorMessage = extractApiErrorMessage(
        e,
        'Failed to load installations',
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [githubAppEnabled]);

  const activeInstallation = installations.find((i) => i.isActive);

  const handleDisconnect = useCallback(async () => {
    if (!activeInstallation) return;
    setDisconnecting(true);
    try {
      await githubAppInstallationsApi.disconnect(
        activeInstallation.installationId,
      );
      await fetchData();
    } catch (e: unknown) {
      const errorMessage = extractApiErrorMessage(e, 'Failed to disconnect');
      setError(errorMessage);
    } finally {
      setDisconnecting(false);
    }
  }, [activeInstallation, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!githubAppEnabled) {
    return null;
  }

  if (error) {
    return (
      <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
        {error}
      </Text>
    );
  }

  const connectedAccountLogin = activeInstallation?.accountLogin;
  const hasInstallations = installations.length > 0;

  const renderStatusTag = () => {
    if (loading) {
      return <Spin size="small" />;
    }

    if (hasInstallations) {
      return (
        <Tag color="success">
          {connectedAccountLogin
            ? `Connected: ${connectedAccountLogin}`
            : 'Connected'}
        </Tag>
      );
    }

    return <Tag color="default">Not connected</Tag>;
  };

  const callbackUrl = setupInfo?.callbackPath
    ? `${window.location.origin}${setupInfo.callbackPath}`
    : null;

  const installHref = (() => {
    if (!setupInfo?.installUrl) return '';
    if (!callbackUrl) return setupInfo.installUrl;
    const url = new URL(setupInfo.installUrl);
    url.searchParams.set('redirect_uri', callbackUrl);
    return url.toString();
  })();

  return (
    <Space size="middle" align="center">
      {renderStatusTag()}
      {setupInfo?.configured && (
        <>
          {hasInstallations ? (
            <Button
              danger
              icon={<DisconnectOutlined />}
              size="middle"
              loading={disconnecting}
              onClick={handleDisconnect}>
              Disconnect
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                icon={<GithubOutlined />}
                size="middle"
                href={installHref}>
                Install GitHub App
              </Button>
              {callbackUrl && (
                <Tooltip
                  title={
                    <>
                      Add <code>{callbackUrl}</code> as a <b>Callback URL</b> in
                      your GitHub App settings and set{' '}
                      <b>GITHUB_APP_CLIENT_ID</b> env var.
                    </>
                  }>
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', cursor: 'help' }}
                  />
                </Tooltip>
              )}
            </>
          )}
        </>
      )}
    </Space>
  );
};
