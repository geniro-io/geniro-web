import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from './utils';

const PickerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors outline-none focus:ring-2 focus:ring-ring',
      className,
    )}
    {...props}>
    {children}
    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
  </button>
));
PickerTrigger.displayName = 'PickerTrigger';

export { PickerTrigger };
