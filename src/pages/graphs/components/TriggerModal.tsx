import { Info, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';

interface TriggerModalProps {
  visible: boolean;
  onCancel: () => void;
  onTrigger: (message: string) => Promise<void>;
  nodeId?: string;
  nodeName?: string;
  loading?: boolean;
}

export const TriggerModal = ({
  visible,
  onCancel,
  onTrigger,
  nodeId,
  nodeName,
  loading = false,
}: TriggerModalProps) => {
  const [triggerMessage, setTriggerMessage] = useState('');
  const [showLongRunningHint, setShowLongRunningHint] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start a 10s timer when loading becomes true and modal is visible
    if (visible && loading) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = window.setTimeout(() => {
        setShowLongRunningHint(true);
      }, 10000);
    } else {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      setShowLongRunningHint(false);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, loading]);

  const handleTrigger = async () => {
    if (triggerMessage.trim()) {
      await onTrigger(triggerMessage);
      setTriggerMessage('');
    }
  };

  const handleCancel = () => {
    setTriggerMessage('');
    setShowLongRunningHint(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onCancel();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trigger Node</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-semibold">
              Node: {nodeName || nodeId}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold">
              Enter message for trigger:
            </span>
          </div>
          <Textarea
            value={triggerMessage}
            onChange={(e) => setTriggerMessage(e.target.value)}
            placeholder="Enter trigger message..."
            rows={4}
          />

          {showLongRunningHint ? (
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Trigger is running</AlertTitle>
              <AlertDescription>
                You can close this window; it will continue in background. After
                closing, the threads list will be refreshed.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleTrigger}
            disabled={!triggerMessage.trim() || loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Trigger
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="size-4" />
                Trigger
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
