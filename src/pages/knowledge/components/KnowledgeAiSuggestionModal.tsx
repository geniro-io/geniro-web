import { createTwoFilesPatch } from 'diff';
import { Loader2, Pencil, Send } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LabelsInput } from '@/components/ui/labels-input';
import { MdEditor } from '@/components/ui/md-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { DiffHtmlView } from '../../../components/markdown/DiffHtmlView';
import { MarkdownContent } from '../../../components/markdown/MarkdownContent';

export type KnowledgeSuggestionState = {
  currentTitle: string;
  currentContent: string;
  currentTags: string[];
  suggestedTitle?: string;
  suggestedContent?: string;
  suggestedTags?: string[];
  isEditingSuggestion?: boolean;
  editSuggestionDraft?: string;
  userRequest: string;
  threadId?: string;
  model?: string;
  loading: boolean;
};

type KnowledgeAiSuggestionModalProps = {
  open: boolean;
  state: KnowledgeSuggestionState | null;
  models: { label: string; value: string }[];
  modelsLoading: boolean;
  onClose: () => void;
  onUserRequestChange: (value: string) => void;
  onModelChange: (value?: string) => void;
  onSubmit: () => void;
  onApplySuggestion: () => void;
  onStartEditSuggested: () => void;
  onCancelEditSuggested: () => void;
  onApplyEditSuggested: () => void;
  onEditDraftChange: (value: string) => void;
  onSuggestedTitleChange: (value: string) => void;
  onSuggestedTagsChange: (value: string[]) => void;
};

export const KnowledgeAiSuggestionModal = ({
  open,
  state,
  models,
  modelsLoading,
  onClose,
  onUserRequestChange,
  onModelChange,
  onSubmit,
  onApplySuggestion,
  onStartEditSuggested,
  onCancelEditSuggested,
  onApplyEditSuggested,
  onEditDraftChange,
  onSuggestedTitleChange,
  onSuggestedTagsChange,
}: KnowledgeAiSuggestionModalProps) => {
  const currentContent = state?.currentContent;
  const suggestedContent = state?.suggestedContent;
  const suggestionDiff = useMemo(() => {
    if (!suggestedContent) return null;
    return createTwoFilesPatch(
      'Current',
      'Suggested',
      currentContent ?? '',
      suggestedContent ?? '',
      '',
      '',
      { context: 3 },
    ).trimEnd();
  }, [currentContent, suggestedContent]);

  const hasAiSuggestion =
    Boolean(state?.suggestedTitle) ||
    Boolean(state?.suggestedContent) ||
    (state?.suggestedTags?.length ?? 0) > 0;

  if (!open || !state) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Improve knowledge with AI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 min-w-0">
          {/* Current knowledge */}
          <div>
            <p className="text-sm font-semibold mb-2">Current knowledge</p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Title:</span>{' '}
                {state.currentTitle || 'Untitled'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {state.currentTags.length > 0 ? (
                  state.currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags</span>
                )}
              </div>
            </div>
          </div>

          {/* Content preview */}
          <div>
            <p className="text-sm font-semibold mb-2">Content preview</p>
            {state.isEditingSuggestion ? (
              <div className="space-y-2">
                <MdEditor
                  value={
                    state.editSuggestionDraft ??
                    state.suggestedContent ??
                    state.currentContent
                  }
                  onChange={onEditDraftChange}
                  height={360}
                  placeholder="Edit suggested content..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancelEditSuggested}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={onApplyEditSuggested}>
                    Apply
                  </Button>
                </div>
              </div>
            ) : state.suggestedContent ? (
              <div className="space-y-2">
                <div className="flex gap-3 items-start">
                  <div className="flex-1 min-w-0 max-h-[360px] overflow-auto border border-border rounded-md bg-background">
                    {suggestionDiff ? (
                      <DiffHtmlView diff={suggestionDiff} wrapLines />
                    ) : (
                      <div className="p-3">
                        <MarkdownContent
                          content={state.currentContent}
                          allowHorizontalScroll={false}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 max-h-[360px] overflow-auto border border-border rounded-md p-3 bg-background">
                    <MarkdownContent
                      content={state.suggestedContent}
                      allowHorizontalScroll={false}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={onStartEditSuggested}>
                    <Pencil className="w-3.5 h-3.5" />
                    Edit suggestion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-md p-3 max-h-[300px] overflow-y-auto bg-background">
                {state.currentContent.trim() ? (
                  <MarkdownContent
                    content={state.currentContent}
                    allowHorizontalScroll={false}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No content yet.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Model */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Model</Label>
            <Select
              value={state.model || undefined}
              onValueChange={(val) => onModelChange(val)}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    modelsLoading ? 'Loading models...' : 'Select model'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User request */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              What should be improved?
            </Label>
            <Textarea
              value={state.userRequest}
              onChange={(e) => onUserRequestChange(e.target.value)}
              placeholder="Describe what you want to change or add"
              className="min-h-[80px] resize-none text-sm"
            />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={onSubmit}
                disabled={state.loading || !state.userRequest.trim()}
                className="gap-2">
                {state.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </Button>
            </div>
          </div>

          {/* Suggested knowledge */}
          {hasAiSuggestion && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">Suggested knowledge</p>
              <Input
                value={state.suggestedTitle ?? ''}
                placeholder="Suggested title"
                onChange={(e) => onSuggestedTitleChange(e.target.value)}
              />
              <LabelsInput
                value={state.suggestedTags ?? []}
                onChange={onSuggestedTagsChange}
                placeholder="Add tag and press Enter"
              />
            </div>
          )}
        </div>

        {hasAiSuggestion && (
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onApplySuggestion}>Apply to form</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
