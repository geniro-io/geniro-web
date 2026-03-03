import { DiffHtmlView } from '../../../components/markdown/DiffHtmlView';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

interface LocalDiffModalProps {
  visible: boolean;
  onClose: () => void;
  diffPatch: string;
  graphVersion?: string;
}

export const LocalDiffModal = ({
  visible,
  onClose,
  diffPatch,
  graphVersion,
}: LocalDiffModalProps) => (
  <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
    <DialogContent
      className="max-w-2xl p-0 gap-0 flex flex-col bg-white overflow-hidden"
      style={{ maxHeight: '80vh' }}>
      <DialogHeader className="px-5 py-4 border-b border-border flex-shrink-0">
        <DialogTitle className="text-sm font-semibold">
          {graphVersion ? `Local changes (v${graphVersion})` : 'Local changes'}
        </DialogTitle>
      </DialogHeader>
      {diffPatch ? (
        <div className="overflow-y-auto overflow-x-auto flex-1">
          <DiffHtmlView diff={diffPatch} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground px-5 py-4">
          No local changes to display.
        </p>
      )}
    </DialogContent>
  </Dialog>
);
