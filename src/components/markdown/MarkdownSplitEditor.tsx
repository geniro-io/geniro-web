import React, { useMemo, useState } from 'react';

import { DiffHtmlView } from './DiffHtmlView';
import { MarkdownContent } from './MarkdownContent';

export type MarkdownSplitEditorMode = 'split' | 'edit' | 'preview';

export interface MarkdownSplitEditorProps {
  value: string;
  onChange?: (nextValue: string) => void;
  readOnly?: boolean;
  /**
   * When provided, preview renders this content instead of `value`.
   * Useful for "diff on the left, result on the right" compare mode.
   */
  previewValue?: string;
  height?: number;
  placeholder?: string;
  initialMode?: MarkdownSplitEditorMode;
  editorFontFamily?: string;
  onModeChange?: (nextMode: MarkdownSplitEditorMode) => void;
  shouldChangeMode?: (
    nextMode: MarkdownSplitEditorMode,
    currentMode: MarkdownSplitEditorMode,
  ) => boolean;
}

const MODE_LABELS: Record<MarkdownSplitEditorMode, string> = {
  split: 'Split',
  edit: 'Edit',
  preview: 'Preview',
};

const normalizeMode = (value: unknown): MarkdownSplitEditorMode => {
  if (value === 'edit' || value === 'preview' || value === 'split') {
    return value;
  }
  return 'split';
};

export const MarkdownSplitEditor: React.FC<MarkdownSplitEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  previewValue,
  height = 420,
  placeholder,
  initialMode = 'split',
  editorFontFamily = 'monospace',
  onModeChange,
  shouldChangeMode,
}) => {
  const [mode, setMode] = useState<MarkdownSplitEditorMode>(() =>
    normalizeMode(initialMode),
  );

  const containerHeight = `${height}px`;
  const previewContent = useMemo(
    () => previewValue ?? value ?? '',
    [previewValue, value],
  );

  const fencedDiff = useMemo(() => {
    const raw = value ?? '';
    const match = raw.match(
      /^```(?:diff|patch|gitdiff|unidiff)\n([\s\S]*?)\n```\s*$/i,
    );
    return match?.[1] ?? null;
  }, [value]);

  const handleChange = (nextValue: string) => {
    if (readOnly) return;
    onChange?.(nextValue);
  };

  const tabBar = (
    <div
      role="tablist"
      aria-label="Markdown editor mode"
      className="bg-muted rounded-full p-1 flex gap-1.5 w-fit shrink-0">
      {(Object.keys(MODE_LABELS) as MarkdownSplitEditorMode[]).map((key) => {
        const isActive = mode === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              const shouldSwitch = shouldChangeMode
                ? shouldChangeMode(key, mode)
                : true;
              if (shouldSwitch) {
                setMode(key);
              }
              onModeChange?.(key);
            }}
            className={`border-none px-2.5 py-1 rounded-full font-semibold text-[13px] cursor-pointer transition-all ${
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}>
            {MODE_LABELS[key]}
          </button>
        );
      })}
    </div>
  );

  const editor = readOnly ? (
    <div
      className="h-full overflow-auto border border-border rounded-md bg-background"
      style={{ padding: fencedDiff ? 0 : 12 }}>
      {value.trim().length > 0 ? (
        fencedDiff ? (
          <DiffHtmlView diff={fencedDiff} />
        ) : (
          <MarkdownContent content={value} />
        )
      ) : (
        <span className="text-muted-foreground text-sm">
          Nothing to display.
        </span>
      )}
    </div>
  ) : (
    <textarea
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      readOnly={readOnly}
      rows={10}
      placeholder={placeholder}
      className="flex w-full h-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      style={{ fontFamily: editorFontFamily }}
    />
  );

  const preview = (
    <div className="h-full overflow-auto border border-border rounded-md p-3 bg-background">
      {previewContent.trim().length > 0 ? (
        <MarkdownContent content={previewContent} />
      ) : (
        <span className="text-muted-foreground text-sm">
          Nothing to preview.
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div />
        <div className="flex justify-center">{tabBar}</div>
      </div>

      <div style={{ height: containerHeight, minHeight: 0 }}>
        {mode === 'split' ? (
          <div className="flex gap-3 h-full">
            <div className="flex-1 min-w-0">{editor}</div>
            <div className="flex-1 min-w-0">{preview}</div>
          </div>
        ) : mode === 'edit' ? (
          editor
        ) : (
          preview
        )}
      </div>
    </div>
  );
};
