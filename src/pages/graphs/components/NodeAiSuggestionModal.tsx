import { createTwoFilesPatch } from 'diff';
import { AlertTriangle } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import { DiffHtmlView } from '../../../components/markdown/DiffHtmlView';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { MdEditor } from '../../../components/ui/md-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import type { AiSuggestionState } from './NodeEditSidebar';

interface NodeAiSuggestionModalProps {
  aiSuggestionState: AiSuggestionState | null;
  setAiSuggestionState: React.Dispatch<
    React.SetStateAction<AiSuggestionState | null>
  >;
  nodeDirtyWarning: boolean;
  suggestionDiffMarkdown: string | null;
  liteLlmModelOptions: { label: string; value: string }[];
  litellmModelsLoading: boolean;
  isGraphRunning: boolean;
  graphId?: string;
  nodeId?: string;
  onClose: () => void;
  onSubmit: () => void;
  onApply: () => void;
  onStartEditSuggested: () => void;
  onCancelEditSuggested: () => void;
  onApplyEditSuggested: () => void;
}

export const NodeAiSuggestionModal: FC<NodeAiSuggestionModalProps> = ({
  aiSuggestionState,
  setAiSuggestionState,
  nodeDirtyWarning,
  liteLlmModelOptions,
  litellmModelsLoading,
  isGraphRunning,
  graphId,
  nodeId,
  onClose,
  onSubmit,
  onApply,
  onStartEditSuggested,
  onCancelEditSuggested,
  onApplyEditSuggested,
}) => {
  const title = aiSuggestionState?.fieldLabel
    ? `Improve ${aiSuggestionState.fieldLabel} with AI`
    : 'Improve instructions with AI';

  const handleModelChange = useCallback(
    (value: string) => {
      setAiSuggestionState((prev) => (prev ? { ...prev, model: value } : prev));
    },
    [setAiSuggestionState],
  );

  const handleUserRequestChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAiSuggestionState((prev) =>
        prev ? { ...prev, userRequest: e.target.value } : prev,
      );
    },
    [setAiSuggestionState],
  );

  const handleEditDraftChange = useCallback(
    (nextValue: string) => {
      setAiSuggestionState((prev) =>
        prev ? { ...prev, editSuggestionDraft: nextValue } : prev,
      );
    },
    [setAiSuggestionState],
  );

  const suggested = aiSuggestionState
    ? (aiSuggestionState.manualSuggestedOverride ??
      aiSuggestionState.lastSuggestedInstructions)
    : null;

  const diffText = useMemo(() => {
    if (!aiSuggestionState || !suggested) return '';
    return createTwoFilesPatch(
      'Current',
      'Suggested',
      aiSuggestionState.initialInstructions,
      suggested,
      '',
      '',
      { context: Number.MAX_SAFE_INTEGER },
    ).trimEnd();
  }, [aiSuggestionState, suggested]);

  const contentSection = useMemo(() => {
    if (!aiSuggestionState) return null;

    if (suggested) {
      if (aiSuggestionState.isEditingSuggestion) {
        return (
          <div className="flex flex-col gap-3 w-full">
            <MdEditor
              value={
                aiSuggestionState.editSuggestionDraft ??
                aiSuggestionState.manualSuggestedOverride ??
                aiSuggestionState.lastSuggestedInstructions ??
                ''
              }
              onChange={handleEditDraftChange}
              height={360}
              placeholder="Edit suggested content..."
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelEditSuggested}>
                Cancel
              </Button>
              <Button size="sm" onClick={onApplyEditSuggested}>
                Apply
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full">
          <div
            className="rounded-md border border-border overflow-auto"
            style={{ maxHeight: 420 }}>
            <DiffHtmlView diff={diffText} wrapLines />
          </div>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={onStartEditSuggested}>
              Edit suggestion
            </Button>
          </div>
        </div>
      );
    }

    if (aiSuggestionState.currentInstructions.trim()) {
      return (
        <MdEditor
          value={aiSuggestionState.currentInstructions}
          readOnly
          height={280}
        />
      );
    }

    return (
      <span className="text-sm text-muted-foreground">
        No content available.
      </span>
    );
  }, [
    aiSuggestionState,
    diffText,
    handleEditDraftChange,
    onApplyEditSuggested,
    onCancelEditSuggested,
    onStartEditSuggested,
    suggested,
  ]);

  return (
    <Dialog
      open={!!aiSuggestionState}
      onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="sm:max-w-[1100px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {aiSuggestionState && (
          <div className="flex flex-col gap-6">
            {nodeDirtyWarning && (
              <Alert>
                <AlertTriangle className="size-4" />
                <AlertTitle>Unsaved changes for this node</AlertTitle>
                <AlertDescription>
                  AI suggestions use the current value from the database. Save
                  this node first if you want your latest edits included.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <span className="text-sm font-semibold block mb-1.5">
                {suggested ? 'Suggested changes' : 'Current instructions'}
              </span>
              {contentSection}
            </div>

            <div>
              <span className="text-sm font-semibold block mb-1.5">Model</span>
              <Select
                value={aiSuggestionState.model ?? ''}
                onValueChange={handleModelChange}
                disabled={aiSuggestionState.loading}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      litellmModelsLoading
                        ? 'Loading models...'
                        : 'Select model'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {liteLlmModelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <span className="text-sm font-semibold block mb-1.5">
                What should be improved?
              </span>
              <Textarea
                value={aiSuggestionState.userRequest}
                onChange={handleUserRequestChange}
                placeholder="Describe what you want to change or add"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={onSubmit}
                  disabled={
                    !isGraphRunning ||
                    aiSuggestionState.loading ||
                    !aiSuggestionState.userRequest.trim() ||
                    !graphId ||
                    !nodeId
                  }>
                  {aiSuggestionState.loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Send
                    </span>
                  ) : (
                    'Send'
                  )}
                </Button>
              </div>
            </div>

            {aiSuggestionState.suggestedInstructions && (
              <div className="flex justify-end gap-2 pt-1 border-t border-border">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={onApply}>Apply to field</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
