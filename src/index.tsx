import './styles/global.css';

import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';

import { systemApi } from './api';
import App from './App';
import { resolveAuthModule } from './auth';
import { AuthModuleProvider } from './auth/AuthModuleContext';
import type { AuthModule } from './auth/types';

// Some dependencies (e.g. json-schema-ref-parser) expect Buffer in the browser.
// Vite doesn't polyfill Node globals by default.
if (!(globalThis as unknown as { Buffer?: unknown }).Buffer) {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const _error = console.error;

console.error = function (msg: unknown, ...args: unknown[]) {
  if (!`${msg}`.includes('is deprecated')) {
    _error.apply(console, [msg, ...args]);
  }
};

function renderLoading() {
  root.render(
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        color: '#666',
      }}>
      Loading...
    </div>,
  );
}

function renderError(message: string) {
  root.render(
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        gap: 16,
      }}>
      <div style={{ color: '#ff4d4f', fontSize: 16 }}>{message}</div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: '8px 24px',
          fontSize: 14,
          cursor: 'pointer',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          background: '#fff',
        }}>
        Reload
      </button>
    </div>,
  );
}

function renderApp(authModule: AuthModule) {
  root.render(
    <AuthModuleProvider module={authModule}>
      <authModule.AuthProviderWrapper>
        <App authModule={authModule} />
      </authModule.AuthProviderWrapper>
    </AuthModuleProvider>,
  );
}

async function bootstrap() {
  renderLoading();

  try {
    const { data } = await systemApi.getAuthConfig();
    const authModule = resolveAuthModule({
      provider: data.provider,
      issuer: data.issuer,
      clientId: data.clientId,
    });
    renderApp(authModule);
  } catch (error) {
    console.error('Failed to load auth configuration:', error);
    renderError(
      'Failed to load authentication configuration. Please check that the API server is running.',
    );
  }
}

bootstrap();
