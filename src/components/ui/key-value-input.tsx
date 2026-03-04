import { Plus, X } from 'lucide-react';
import * as React from 'react';

import { cn } from './utils';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeyValueInputProps {
  value: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function KeyValueInput({
  value,
  onChange,
  placeholder = 'Key',
  disabled = false,
}: KeyValueInputProps) {
  const addPair = () => {
    onChange([...value, { key: '', value: '' }]);
  };

  const removePair = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updatePair = (
    index: number,
    field: 'key' | 'value',
    newValue: string,
  ) => {
    onChange(
      value.map((pair, i) =>
        i === index ? { ...pair, [field]: newValue } : pair,
      ),
    );
  };

  return (
    <div
      className={cn(
        'w-full rounded-md border border-border bg-input-background',
        'transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      )}>
      {value.map((pair, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5',
            index < value.length - 1 && 'border-b border-border',
          )}>
          <input
            value={pair.key}
            onChange={(e) => updatePair(index, 'key', e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <span className="text-muted-foreground text-xs">=</span>
          <input
            value={pair.value}
            onChange={(e) => updatePair(index, 'value', e.target.value)}
            disabled={disabled}
            placeholder="Value"
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <button
            type="button"
            aria-label="Remove pair"
            disabled={disabled}
            onClick={() => removePair(index)}
            className="rounded-sm opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <X className="size-3" />
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={addPair}
        className={cn(
          'flex w-full items-center justify-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground',
          'hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          value.length > 0 && 'border-t border-border',
        )}>
        <Plus className="size-3" />
        Add pair
      </button>
    </div>
  );
}
