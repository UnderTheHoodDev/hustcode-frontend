'use client';

import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date and time',
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<string>(
    value ? format(value, 'HH:mm') : '00:00'
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      onChange?.(newDate);
    } else {
      onChange?.(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (value && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes, 0, 0);
      onChange?.(newDate);
    }
  };

  // Update time when value changes
  React.useEffect(() => {
    if (value) {
      setTime(format(value, 'HH:mm'));
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start border-[#3a4556] bg-[#252d3d] text-left font-normal text-gray-200 hover:bg-[#2a3344]',
            !value && 'text-gray-500',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'MMM dd, yyyy HH:mm')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-[#3a4556] bg-[#252d3d] p-0"
        align="start"
      >
        <div className="rounded-t-lg bg-[#252d3d] p-3">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            className="rounded-md"
            classNames={{
              months: "text-gray-200",
              caption_label: "text-gray-200 font-medium",
              nav_button: "text-gray-400 hover:text-gray-200 hover:bg-[#2a3344]",
              weekdays: "flex w-full",
              weekday: "text-gray-400 w-9 font-normal text-[0.8rem] flex-1 text-center",
              week: "flex w-full mt-2",
              day: "text-gray-200 hover:bg-[#2a3344] rounded-md w-9 h-9 p-0 font-normal flex-1",
              day_today: "bg-[#2a3344] text-cyan-400 font-semibold",
              day_selected: "!bg-cyan-600 !text-white hover:!bg-cyan-700 font-semibold",
              day_outside: "text-gray-600 opacity-50",
              day_disabled: "text-gray-600 opacity-30",
            }}
          />
        </div>
        <div className="flex items-center gap-2 border-t border-[#3a4556] bg-[#252d3d] p-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-full border-[#3a4556] bg-[#1e293b] text-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateTimePicker;
