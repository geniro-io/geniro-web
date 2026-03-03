import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { MarkdownContent } from '../../../../components/markdown/MarkdownContent';
import { EXPAND_TOGGLE_STYLE } from './blockStyles';

/** Reusable coloured section with an uppercase header label and markdown body.
 *  Used by SubagentBlock and CommunicationBlock for Task/Instruction, Error,
 *  and Result sections to avoid duplicating identical styled markup. */

interface StyledSectionTheme {
  background: string;
  border: string;
  labelColor: string;
  contentColor: string;
}

const THEMES: Record<string, StyledSectionTheme> = {
  task: {
    background: '#f0f5ff',
    border: '#adc6ff',
    labelColor: '#1d39c4',
    contentColor: '#000000',
  },
  instruction: {
    background: '#f9f0ff',
    border: '#d3adf7',
    labelColor: '#722ed1',
    contentColor: '#000000',
  },
  error: {
    background: '#fff2f0',
    border: '#ffccc7',
    labelColor: '#cf1322',
    contentColor: '#cf1322',
  },
  result: {
    background: '#f6ffed',
    border: '#b7eb8f',
    labelColor: '#389e0d',
    contentColor: '#135200',
  },
};

/** Pre-built style objects per variant to avoid allocating new objects on every render. */
const VARIANT_STYLES = Object.fromEntries(
  Object.entries(THEMES).map(([key, theme]) => [
    key,
    {
      wrapper: {
        padding: '6px 10px',
        fontSize: 12,
        backgroundColor: theme.background,
        borderRadius: 6,
        border: `1px solid ${theme.border}`,
        lineHeight: 1.5,
      } as React.CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
        paddingBottom: 6,
        borderBottom: `1px solid ${theme.border}`,
      } as React.CSSProperties,
      label: {
        fontSize: 12,
        fontWeight: 600,
        color: theme.labelColor,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      } as React.CSSProperties,
      content: {
        fontSize: '12px',
        lineHeight: '1.4',
        color: theme.contentColor,
      } as React.CSSProperties,
    },
  ]),
) as Record<
  string,
  {
    wrapper: React.CSSProperties;
    header: React.CSSProperties;
    label: React.CSSProperties;
    content: React.CSSProperties;
  }
>;

/** ~10 lines at 12px font size x 1.4 line-height = 168px, plus some margin for paragraphs. */
const COLLAPSED_MAX_HEIGHT = 180;

export type StyledSectionVariant = keyof typeof THEMES;

export interface StyledSectionProps {
  variant: StyledSectionVariant;
  label: string;
  content: string;
  /** When true, long content is collapsed to ~10 lines with a "Show more" toggle. */
  collapsible?: boolean;
}

export const StyledSection: React.FC<StyledSectionProps> = ({
  variant,
  label,
  content,
  collapsible = false,
}) => {
  const styles = VARIANT_STYLES[variant];
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    if (!collapsible || !contentRef.current) return;
    setOverflows(contentRef.current.scrollHeight > COLLAPSED_MAX_HEIGHT);
  }, [collapsible, content]);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  const shouldClamp = collapsible && overflows && !expanded;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
      </div>
      <div
        ref={contentRef}
        style={
          shouldClamp
            ? {
                maxHeight: COLLAPSED_MAX_HEIGHT,
                overflow: 'hidden',
                position: 'relative',
              }
            : undefined
        }>
        <MarkdownContent content={content} style={styles.content} />
        {shouldClamp && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 32,
              background: `linear-gradient(transparent, ${THEMES[variant].background})`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {collapsible && overflows && (
        <div onClick={toggle} style={EXPAND_TOGGLE_STYLE}>
          {expanded ? (
            <>
              <ChevronDown style={{ width: 9, height: 9 }} />
              Show less
            </>
          ) : (
            <>
              <ChevronRight style={{ width: 9, height: 9 }} />
              Show more
            </>
          )}
        </div>
      )}
    </div>
  );
};

StyledSection.displayName = 'StyledSection';
