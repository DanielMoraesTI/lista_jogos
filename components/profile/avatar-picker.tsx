"use client";

import { Check, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { setPresetAvatarAction, uploadAvatarAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { AVATAR_MAX_BYTES, AVATAR_TYPES, PRESET_AVATARS, presetAvatarUrl } from "@/lib/avatars";
import { cn } from "@/lib/utils";

export function AvatarPicker({ current, uploadEnabled }: { current: string | null; uploadEnabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function choosePreset(id: string) {
    startTransition(async () => {
      const result = await setPresetAvatarAction(id);
      if (result.ok) toast.success(result.message);
      else toast.error(result.error);
    });
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("A imagem deve ter no máximo 2 MB.");
      return;
    }
    const formData = new FormData();
    formData.set("avatar", file);
    startTransition(async () => {
      const result = await uploadAvatarAction(formData);
      if (result.ok) toast.success(result.message);
      else toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8" aria-label="Avatares disponíveis">
        {PRESET_AVATARS.map((avatar) => {
          const url = presetAvatarUrl(avatar.id);
          const selected = current === url;
          return (
            <li key={avatar.id}>
              <button
                type="button"
                onClick={() => choosePreset(avatar.id)}
                disabled={pending}
                aria-pressed={selected}
                aria-label={`Usar avatar ${avatar.label}`}
                title={avatar.label}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl ring-2 transition-all outline-none focus-visible:ring-ring disabled:opacity-60",
                  selected ? "glow ring-primary" : "ring-border hover:ring-primary/50",
                )}
              >
                <Image src={url} alt="" fill sizes="80px" className="pixelated" unoptimized />
                {selected && (
                  <span className="absolute right-1 bottom-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {uploadEnabled ? (
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={AVATAR_TYPES.join(",")}
            className="sr-only"
            onChange={onFileChange}
            tabIndex={-1}
            aria-hidden
          />
          <Button type="button" variant="outline" disabled={pending} onClick={() => inputRef.current?.click()}>
            {pending ? <Loader2 className="animate-spin" /> : <Upload />}
            Enviar imagem
          </Button>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP ou GIF · até 2 MB</p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          O envio de imagem própria está indisponível no momento. Escolha um dos avatares acima.
        </p>
      )}
    </div>
  );
}
