import { createTwoFilesPatch } from 'diff';
import { Loader2, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';

import { MarkdownSplitEditor } from '../../../components/markdown/MarkdownSplitEditor';

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

function TagsInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const parts = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onChange([...new Set([...tags, ...parts])]);
    setInput('');
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="border border-border rounded-md px-3 py-2 flex flex-wrap gap-1.5 min-h-[38px] focus-within:ring-1 focus-within:ring-ring cursor-text">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1 px-2 py-0.5 text-xs">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-0.5 hover:text-destructive transition-colors">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <input
        className="flex-1 min-w-[140px] text-sm outline-none bg-transparent placeholder:text-muted-foreground"
        placeholder={
          tags.length === 0 ? 'Add tag, press Enter or comma' : 'Add more...'
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (input.trim()) addTag(input);
          }
          if (e.key === 'Backspace' && !input && tags.length) {
            removeTag(tags[tags.length - 1]);
          }
        }}
        onBlur={() => {
          if (input.trim()) addTag(input);
        }}
      />
    </div>
  );
}

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
  const suggestionDiffMarkdown = useMemo(() => {
    if (!suggestedContent) return null;
    const diffString = createTwoFilesPatch(
      'Current',
      'Suggested',
      currentContent ?? '',
      suggestedContent ?? '',
      '',
      '',
      { context: Number.MAX_SAFE_INTEGER },
    );
    const trimmed = diffString.trimEnd();
    return `\`\`\`diff\n${trimmed}\n\`\`\``;
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
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Improve knowledge with AI</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                <MarkdownSplitEditor
                  value={
                    state.editSuggestionDraft ??
                    state.suggestedContent ??
                    state.currentContent
                  }
                  onChange={onEditDraftChange}
                  height={360}
                  placeholder="Edit suggested content..."
                  initialMode="split"
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
              <MarkdownSplitEditor
                value={suggestionDiffMarkdown ?? ''}
                readOnly
                height={360}
                initialMode="split"
                previewValue={state.suggestedContent}
                onModeChange={(nextMode) => {
                  if (nextMode === 'edit') {
                    onStartEditSuggested();
                  }
                }}
                shouldChangeMode={(nextMode) => nextMode !== 'edit'}
              />
            ) : (
              <MarkdownSplitEditor
                value={state.currentContent}
                readOnly
                height={300}
                initialMode="split"
              />
            )}
          </div>

          {/* Model */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Model</Label>
            <select
              value={state.model || ''}
              onChange={(e) => onModelChange(e.target.value || undefined)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">
                {modelsLoading ? 'Loading models...' : 'Select model'}
              </option>
              {models.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
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
              <TagsInput
                tags={state.suggestedTags ?? []}
                onChange={(nextTags) => onSuggestedTagsChange(nextTags)}
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
