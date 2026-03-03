import React from 'react';

/**
 * Shared component overrides for ReactMarkdown.
 * Used by instruction modals, AI suggestion modals, etc.
 */
export const simpleMarkdownComponents = {
  p: (props: React.ComponentProps<'p'>) => (
    <p className="mb-2 text-sm leading-relaxed" {...props} />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="pl-5 mb-2 list-disc" {...props} />
  ),
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className="pl-5 mb-2 list-decimal" {...props} />
  ),
  code: (props: React.ComponentProps<'code'>) => (
    <code
      className="bg-muted px-1 py-0.5 rounded text-xs font-mono"
      {...props}
    />
  ),
};
