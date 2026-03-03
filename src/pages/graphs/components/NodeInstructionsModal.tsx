import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { simpleMarkdownComponents } from '../../../components/markdown/markdownComponentOverrides';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

interface NodeInstructionsModalProps {
  visible: boolean;
  onClose: () => void;
  instructionsText: string;
}

export const NodeInstructionsModal: FC<NodeInstructionsModalProps> = ({
  visible,
  onClose,
  instructionsText,
}) => (
  <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Agent instructions</DialogTitle>
      </DialogHeader>
      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {instructionsText ? (
          <div
            style={{
              margin: 0,
              wordBreak: 'break-word',
              fontSize: 13,
              lineHeight: 1.6,
            }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={simpleMarkdownComponents}>
              {instructionsText}
            </ReactMarkdown>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            No instructions available.
          </span>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
