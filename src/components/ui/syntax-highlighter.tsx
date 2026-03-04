import { Prism as PrismHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface SyntaxHighlighterProps {
  language: string;
  children: string;
  customStyle?: React.CSSProperties;
  codeTagProps?: { style?: React.CSSProperties };
  preTag?: keyof React.JSX.IntrinsicElements | React.ComponentType;
}

export function SyntaxHighlighter({
  language,
  children,
  customStyle,
  codeTagProps,
  preTag,
}: SyntaxHighlighterProps) {
  return (
    <PrismHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={customStyle}
      codeTagProps={codeTagProps}
      PreTag={preTag}>
      {children}
    </PrismHighlighter>
  );
}
