import type { FC } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { JsonViewer } from '../../../components/ui/json-view';

interface ConnectedTool {
  name: string;
  description: string;
  schema: Record<string, unknown>;
}

interface NodeToolsModalProps {
  visible: boolean;
  onClose: () => void;
  tools: ConnectedTool[];
}

export const NodeToolsModal: FC<NodeToolsModalProps> = ({
  visible,
  onClose,
  tools,
}) => (
  <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-[720px]">
      <DialogHeader>
        <DialogTitle>Connected Tools ({tools.length})</DialogTitle>
      </DialogHeader>
      <div style={{ maxHeight: 560, overflowY: 'auto' }}>
        {tools.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  padding: 16,
                  background: '#fafafa',
                }}>
                <div style={{ marginBottom: 12 }}>
                  <span
                    className="font-semibold block mb-2"
                    style={{ fontSize: 15 }}>
                    {tool.name}
                  </span>
                  <span
                    className="text-muted-foreground block"
                    style={{
                      fontSize: 13,
                      wordBreak: 'break-word',
                    }}>
                    {tool.description}
                  </span>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: '#ffffff',
                    borderRadius: 6,
                    border: '1px solid #e8e8e8',
                    maxHeight: 320,
                    overflow: 'auto',
                  }}>
                  <JsonViewer value={tool.schema as object} collapsed={1} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            No connected tools available.
          </span>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
