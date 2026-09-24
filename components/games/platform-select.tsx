"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FAMILIES,
  FAMILY_META,
  PLATFORM_LABELS,
  platformsOfFamily,
  type Platform,
} from "@/lib/platforms";

export function PlatformSelect({
  id,
  value,
  onChange,
  invalid,
}: {
  id?: string;
  value: Platform | undefined;
  onChange: (value: Platform) => void;
  invalid?: boolean;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Platform)}>
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder="Escolha a plataforma" />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-80">
        {FAMILIES.map((family) => (
          <SelectGroup key={family}>
            <SelectLabel className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ backgroundColor: FAMILY_META[family].color }}
              />
              {FAMILY_META[family].label}
            </SelectLabel>
            {platformsOfFamily(family).map((platform) => (
              <SelectItem key={platform} value={platform}>
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: FAMILY_META[family].color }}
                />
                {PLATFORM_LABELS[platform]}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
