import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { extractApiErrorMessage } from '../../../utils/errors';
import { githubAppInstallationsApi } from '../types';

type CallbackState =
  | { status: 'linking' }
  | { status: 'success'; accountLogin: string }
  | { status: 'error'; message: string }
  | { status: 'request-pending' };

const resolveInitialState = (
  installationId: string | null,
  setupAction: string | null,
  code: string | null,
): CallbackState => {
  if (setupAction === 'request') {
    return { status: 'request-pending' };
  }

  // Either installation_id (direct install) or code (OAuth flow) is valid
  if (installationId) {
    const numericId = Number(installationId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return {
        status: 'error',
        message: `Invalid installation ID: ${installationId}`,
      };
    }
    return { status: 'linking' };
  }

  if (code) {
    return { status: 'linking' };
  }

  return {
    status: 'error',
    message:
      'No installation ID or authorization code received from GitHub. Please try again or link manually.',
  };
};

export const GitHubAppCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const installationId = searchParams.get('installation_id');
  const setupAction = searchParams.get('setup_action');
  const code = searchParams.get('code');

  const [state, setState] = useState<CallbackState>(() =>
    resolveInitialState(installationId, setupAction, code),
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (state.status !== 'linking') return;

    const linkInstallation = async () => {
      try {
        let response;

        if (installationId) {
          // Direct install flow: link by installation ID
          response = await githubAppInstallationsApi.link(
            Number(installationId),
          );
        } else if (code) {
          // OAuth flow: exchange code and link
          response = await githubAppInstallationsApi.linkViaOAuthCode(code);
        } else {
          setState({ status: 'error', message: 'Missing parameters' });
          return;
        }

        setState({
          status: 'success',
          accountLogin: response.data.accountLogin,
        });
      } catch (e: unknown) {
        const errorMessage = extractApiErrorMessage(
          e,
          'Failed to link installation',
        );
        setState({ status: 'error', message: errorMessage });
      }
    };

    linkInstallation();
  }, [installationId, code, state.status]);

  const goToInstallations = () => {
    navigate('/settings/integrations', { replace: true });
  };

  if (state.status === 'linking') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          tip="Linking GitHub App installation..."
          size="large">
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="GitHub App Installed Successfully"
        subTitle={`Installation linked to ${state.accountLogin}.`}
        extra={[
          <Button type="primary" key="go" onClick={goToInstallations}>
            Go to Settings
          </Button>,
        ]}
      />
    );
  }

  if (state.status === 'request-pending') {
    return (
      <Result
        title="Installation Request Pending"
        subTitle="Your request to install the GitHub App has been sent to the organization admin. Once approved, the installation will appear here automatically."
        extra={[
          <Button type="primary" key="go" onClick={goToInstallations}>
            Go to Settings
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
      status="error"
      title="Installation Failed"
      subTitle={state.message}
      extra={[
        <Button
          type="primary"
          key="retry"
          onClick={() => navigate('/settings/integrations', { replace: true })}>
          Go to Settings
        </Button>,
      ]}
    />
  );
};
