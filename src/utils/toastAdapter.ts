import { toast } from 'sonner';

/**
 * Standalone toast message API built on sonner.
 *
 * MessageType is a callable that also implements PromiseLike<boolean>.
 */

type MessageType = (() => void) & PromiseLike<boolean>;

const makeMessageType = (): MessageType => {
  const fn = () => {};
  (fn as unknown as { then: PromiseLike<boolean>['then'] }).then = (
    onFulfilled,
  ) => Promise.resolve(true).then(onFulfilled);
  return fn as MessageType;
};

export interface ToastMessageApi {
  error: (content: unknown) => MessageType;
  success: (content: unknown) => MessageType;
  info: (content: unknown) => MessageType;
  warning: (content: unknown, duration?: number) => MessageType;
  loading: (content: unknown) => MessageType;
  open: (config: {
    key?: string;
    type?: string;
    content?: unknown;
    duration?: number;
  }) => MessageType;
  destroy: (key?: string) => void;
}

export const toastMessage: ToastMessageApi = {
  error: (content: unknown) => {
    toast.error(String(content));
    return makeMessageType();
  },
  success: (content: unknown) => {
    toast.success(String(content));
    return makeMessageType();
  },
  info: (content: unknown) => {
    toast.info(String(content));
    return makeMessageType();
  },
  warning: (content: unknown) => {
    toast.warning(String(content));
    return makeMessageType();
  },
  loading: (content: unknown) => {
    toast.loading(String(content));
    return makeMessageType();
  },
  open: (config) => {
    const text = String(config.content ?? '');
    const type = config.type ?? 'info';

    if (config.key) {
      // Dismiss any existing toast with this key before showing the new one
      toast.dismiss(config.key);
    }

    const toastOptions = config.key ? { id: config.key } : undefined;

    switch (type) {
      case 'error':
        toast.error(text, toastOptions);
        break;
      case 'success':
        toast.success(text, toastOptions);
        break;
      case 'warning':
        toast.warning(text, toastOptions);
        break;
      case 'loading':
        toast.loading(text, toastOptions);
        break;
      default:
        toast.info(text, toastOptions);
        break;
    }
    return makeMessageType();
  },
  destroy: (key?: string) => {
    if (key) {
      toast.dismiss(key);
    } else {
      toast.dismiss();
    }
  },
};
