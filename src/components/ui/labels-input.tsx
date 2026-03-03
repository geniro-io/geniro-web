import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from './utils';

export interface LabelsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function LabelsInput({
  value,
  onChange,
  placeholder = 'Add label and press Enter',
  disabled = false,
  className,
}: LabelsInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addLabel = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeLabel = (label: string) => {
    onChange(value.filter((l) => l !== label));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLabel(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 items-center',
        'min-h-9 w-full rounded-md border border-border bg-input-background px-2.5 py-1.5',
        'transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      onClick={() => inputRef.current?.focus()}>
      {value.map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 text-xs font-medium leading-none">
          {label}
          <button
            type="button"
            aria-label={`Remove ${label}`}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              removeLabel(label);
            }}
            className="rounded-sm opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) addLabel(inputValue);
        }}
        disabled={disabled}
        placeholder={value.length === 0 ? placeholder : ''}
        className={cn(
          'flex-1 min-w-24 bg-transparent text-sm outline-none',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed',
        )}
      />
    </div>
  );
}
