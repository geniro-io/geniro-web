import { Alert, Typography } from 'antd';

import { useSystemSettings } from '../../hooks/useSystemSettings';
import { GitHubAppInstallationsSection } from '../github-app/list';

const { Title } = Typography;

export const IntegrationsPage = () => {
  const { settings, loading } = useSystemSettings();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginTop: 0 }}>
        Integrations
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          GitHub App Integration
        </Title>
        <GitHubAppInstallationsSection
          githubAppEnabled={settings.githubAppEnabled}
        />
      </div>

      {!loading && !settings.githubAppEnabled && (
        <Alert
          type="info"
          showIcon
          message="GitHub App integration is not available"
          description="Contact your administrator to enable this feature by configuring the required environment variables."
          style={{ marginBottom: 16 }}
        />
      )}
    </div>
  );
};
