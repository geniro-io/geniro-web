import '@uiw/react-md-editor/markdown-editor.css';

import type { MDEditorProps } from '@uiw/react-md-editor';
import MDEditor from '@uiw/react-md-editor';

export interface MdEditorProps {
  value: string;
  onChange?: (value: string) => void;
  height?: number;
  /** 'live' = split (default), 'edit' = editor only, 'preview' = preview only */
  preview?: MDEditorProps['preview'];
  readOnly?: boolean;
  placeholder?: string;
}

export const MdEditor = ({
  value,
  onChange,
  height = 400,
  preview = 'live',
  readOnly = false,
  placeholder,
}: MdEditorProps) => (
  <div data-color-mode="light">
    <MDEditor
      value={value}
      onChange={(v) => {
        onChange?.(v ?? '');
      }}
      height={height}
      preview={readOnly ? 'preview' : preview}
      hideToolbar={readOnly}
      textareaProps={{ placeholder }}
    />
  </div>
);
