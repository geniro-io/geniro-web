import 'diff2html/bundles/css/diff2html.min.css';

import * as Diff2Html from 'diff2html';
import React, { useMemo } from 'react';

export interface DiffHtmlViewProps {
  diff: string;
  style?: React.CSSProperties;
  className?: string;
  /** When true, wraps long lines instead of allowing horizontal scroll. */
  wrapLines?: boolean;
}

export const DiffHtmlView: React.FC<DiffHtmlViewProps> = ({
  diff,
  style,
  className,
  wrapLines = false,
}) => {
  const html = useMemo(() => {
    const normalized = (diff ?? '').trimEnd();
    if (!normalized) return '';

    return Diff2Html.html(normalized, {
      drawFileList: false,
      matching: 'lines',
      outputFormat: 'line-by-line',
    });
  }, [diff]);

  if (!html) {
    return null;
  }

  return (
    <div className={['ai-diff-view', className].filter(Boolean).join(' ')}>
      <style>
        {`
          /* Hide file header (AI Suggestion, etc.) */
          .ai-diff-view .d2h-file-header,
          .ai-diff-view .d2h-file-name-wrapper {
            display: none !important;
          }
          
          /* Hide line number columns in unified diff view */
          .ai-diff-view .d2h-code-linenumber {
            display: none !important;
          }
          
          /* Add some left padding to the content column once numbers are gone */
          .ai-diff-view .d2h-code-line {
            padding-left: 12px !important;
          }
          
          /* Remove borders */
          .ai-diff-view .d2h-wrapper,
          .ai-diff-view .d2h-file-wrapper,
          .ai-diff-view .d2h-diff-table,
          .ai-diff-view .d2h-diff-tbody,
          .ai-diff-view tr,
          .ai-diff-view td,
          .ai-diff-view th {
            border: none !important;
          }
          
          /* Remove margins and padding from wrapper elements */
          .ai-diff-view .d2h-wrapper,
          .ai-diff-view .d2h-file-wrapper,
          .ai-diff-view .d2h-diff-table {
            margin: 0 !important;
            padding: 0 !important;
          }

          ${
            wrapLines
              ? `
          /* Wrap long code lines so the container doesn't overflow horizontally */
          .ai-diff-view .d2h-code-line-ctn {
            white-space: pre-wrap !important;
            word-break: break-all !important;
          }`
              : ''
          }

          /* Background for wrapper elements only — do NOT override ins/del row colors */
          .ai-diff-view,
          .ai-diff-view .d2h-wrapper,
          .ai-diff-view .d2h-file-wrapper,
          .ai-diff-view .d2h-code-wrapper,
          .ai-diff-view .d2h-diff-table {
            background-color: var(--card) !important;
          }

          /* Context (unchanged) lines */
          .ai-diff-view tr.d2h-cntx td {
            background-color: var(--card) !important;
          }
        `}
      </style>
      <div
        style={{ maxWidth: '100%', overflowX: 'auto', ...style }}
        // diff2html escapes line contents; we do not allow arbitrary HTML here.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
