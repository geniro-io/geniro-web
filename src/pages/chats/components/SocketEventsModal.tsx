import type { FC } from 'react';

import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import type { ThreadSocketEventEntry } from '../types';

interface SocketEventsModalProps {
  open: boolean;
  onClose: () => void;
  threadId: string | null;
  events: ThreadSocketEventEntry[];
  onCopyJson: () => void;
}

export const SocketEventsModal: FC<SocketEventsModalProps> = ({
  open,
  onClose,
  threadId,
  events,
  onCopyJson,
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Thread Socket Events</DialogTitle>
        </DialogHeader>
        {threadId ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {events.length} event
              {events.length === 1 ? '' : 's'} recorded for this thread.
            </p>
            <Button onClick={onCopyJson} disabled={events.length === 0}>
              Copy events JSON
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Select a thread to view events
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
