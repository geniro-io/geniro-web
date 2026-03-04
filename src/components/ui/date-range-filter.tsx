import { endOfDay, format, startOfDay, startOfMonth, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type DateRangeFilterValue = {
  dateFrom: string | undefined;
  dateTo: string | undefined;
};

type Preset = 'all' | 'last7' | 'last30' | 'month' | 'custom';

const PRESET_LABELS: Record<Preset, string> = {
  all: 'All time',
  last7: 'Last 7 days',
  last30: 'Last 30 days',
  month: 'This month',
  custom: 'Custom range',
};

function toIso(date: Date): string {
  return date.toISOString();
}

function computePresetValue(
  preset: Exclude<Preset, 'custom' | 'all'>,
): DateRangeFilterValue {
  const now = new Date();
  switch (preset) {
    case 'last7':
      return {
        dateFrom: toIso(startOfDay(subDays(now, 7))),
        dateTo: toIso(endOfDay(now)),
      };
    case 'last30':
      return {
        dateFrom: toIso(startOfDay(subDays(now, 30))),
        dateTo: toIso(endOfDay(now)),
      };
    case 'month':
      return {
        dateFrom: toIso(startOfMonth(now)),
        dateTo: toIso(endOfDay(now)),
      };
  }
}

function resolvePreset(value: DateRangeFilterValue): Preset {
  if (!value.dateFrom && !value.dateTo) return 'all';
  // If it matches a known preset, show that; otherwise custom
  return 'custom';
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRangeFilterValue;
  onChange: (value: DateRangeFilterValue) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset>(() =>
    resolvePreset(value),
  );
  const [localRange, setLocalRange] = useState<DateRange | undefined>(
    undefined,
  );

  const committedRange: DateRange | undefined =
    value.dateFrom || value.dateTo
      ? {
          from: value.dateFrom ? new Date(value.dateFrom) : undefined,
          to: value.dateTo ? new Date(value.dateTo) : undefined,
        }
      : undefined;

  const handlePresetChange = (preset: string) => {
    const p = preset as Preset;
    setActivePreset(p);

    if (p === 'all') {
      onChange({ dateFrom: undefined, dateTo: undefined });
      return;
    }

    if (p === 'custom') {
      setPopoverOpen(true);
      return;
    }

    onChange(computePresetValue(p));
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (!range) {
      setLocalRange(undefined);
      return;
    }

    // Always store locally so the calendar keeps showing the selection
    setLocalRange(range);

    if (range.from && range.to) {
      // Range complete — commit to parent, keep calendar open for adjustment
      onChange({
        dateFrom: toIso(startOfDay(range.from)),
        dateTo: toIso(endOfDay(range.to)),
      });
    }
  };

  const handlePopoverChange = (open: boolean) => {
    setPopoverOpen(open);
    if (!open) {
      setLocalRange(undefined);
    }
  };

  const formatLabel = (): string => {
    if (!value.dateFrom && !value.dateTo) return 'Pick dates';
    const parts: string[] = [];
    if (value.dateFrom)
      parts.push(format(new Date(value.dateFrom), 'MMM d, yyyy'));
    if (value.dateTo) parts.push(format(new Date(value.dateTo), 'MMM d, yyyy'));
    return parts.join(' - ');
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={activePreset} onValueChange={handlePresetChange}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PRESET_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activePreset === 'custom' && (
        <Popover open={popoverOpen} onOpenChange={handlePopoverChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <CalendarIcon className="size-3.5" />
              {formatLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              min={1}
              resetOnSelect
              selected={localRange ?? committedRange}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
              defaultMonth={
                value.dateFrom ? new Date(value.dateFrom) : undefined
              }
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
