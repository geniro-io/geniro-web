import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';

export interface JsonViewerProps {
  value: object;
  collapsed?: number | boolean;
  fontSize?: string;
}

export function JsonViewer({
  value,
  collapsed,
  fontSize = '12px',
}: JsonViewerProps) {
  return (
    <JsonView
      value={value}
      style={{ ...lightTheme, fontSize, fontFamily: 'monospace' }}
      collapsed={collapsed}
    />
  );
}
