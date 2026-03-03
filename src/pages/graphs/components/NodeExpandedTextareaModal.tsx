import type { FC } from 'react';

import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { MdEditor } from '../../../components/ui/md-editor';

interface AiSuggestionLinkProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

const AiSuggestionLink: FC<AiSuggestionLinkProps> = ({
  onClick,
  disabled,
  label = 'Improve with AI',
}) => (
  <Button
    variant="link"
    size="sm"
    className="p-0 h-auto text-xs"
    onClick={onClick}
    disabled={disabled}>
    {label}
  </Button>
);

interface NodeExpandedTextareaModalProps {
  expandedTextarea: { fieldKey: string; value: string } | null;
  onSave: () => void;
  onCancel: () => void;
  onChange: (next: { fieldKey: string; value: string }) => void;
  /** Whether AI suggestion link is shown */
  showAiSuggestion?: boolean;
  isGraphRunning?: boolean;
  onOpenAiSuggestion?: () => void;
}

export const NodeExpandedTextareaModal: FC<NodeExpandedTextareaModalProps> = ({
  expandedTextarea,
  onSave,
  onCancel,
  onChange,
  showAiSuggestion = false,
  isGraphRunning = false,
  onOpenAiSuggestion,
}) => (
  <Dialog
    open={!!expandedTextarea}
    onOpenChange={(open) => !open && onCancel()}>
    <DialogContent className="sm:max-w-[1200px]">
      <DialogHeader>
        <DialogTitle>Edit Text</DialogTitle>
      </DialogHeader>
      {expandedTextarea && (
        <>
          <MdEditor
            value={expandedTextarea.value}
            onChange={(nextValue) =>
              onChange({
                ...expandedTextarea,
                value: nextValue,
              })
            }
            height={520}
            placeholder="Enter markdown..."
          />
          {showAiSuggestion && (
            <AiSuggestionLink
              onClick={() => onOpenAiSuggestion?.()}
              disabled={!isGraphRunning}
              label="Improve with AI"
            />
          )}
        </>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
