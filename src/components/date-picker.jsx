import React from 'react'
import { format, isToday, isTomorrow, isYesterday } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const DatePicker = ({ date, onDateChange }) => {
  return (
    <Popover>
      {/* Button that triggers the date picker popover */}
      <PopoverTrigger asChild>
        <Button variant='outline'>
          {
            // Display a label for today, tomorrow, yesterday, or formatted date otherwise
            isToday(date)
              ? 'Today'
              : isTomorrow(date)
                ? 'Tomorrow'
                : isYesterday(date)
                  ? 'Yesterday'
                  : format(date, 'PPP')
          }
        </Button>
      </PopoverTrigger>

      {/* Popover content showing the calendar */}
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
