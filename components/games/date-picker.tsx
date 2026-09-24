"use client";

import { ptBR } from "react-day-picker/locale";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatIsoDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function isoToDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

function dateToIso(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function DatePicker({
  id,
  value,
  onChange,
  disabled,
  invalid,
}: {
  id?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? isoToDate(value) : undefined;
  const today = new Date();

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid}
            className={cn("flex-1 justify-start font-normal", !value && "text-muted-foreground")}
          >
            <CalendarDays />
            {value ? formatIsoDate(value) : "Escolha a data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ptBR}
            captionLayout="dropdown"
            selected={selected}
            defaultMonth={selected ?? today}
            startMonth={new Date(1980, 0)}
            endMonth={today}
            disabled={{ after: today }}
            onSelect={(date) => {
              if (date) {
                onChange(dateToIso(date));
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
      {value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange(null)}
          aria-label="Limpar data"
        >
          <X />
        </Button>
      )}
    </div>
  );
}
