"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createGameAction, updateGameAction } from "@/actions/games";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { Game } from "@/db/schema";
import { todayIso } from "@/lib/format";
import type { Platform } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import { gameSchema, type GameInput } from "@/lib/validations";

import { ratingTone } from "./badges";
import { DatePicker } from "./date-picker";
import { PlatformSelect } from "./platform-select";
import { StatusToggle } from "./status-toggle";

const COMMENT_MAX = 140;

type GameFormDialogProps = {
  /** Jogo a editar; ausente = cadastro. */
  game?: Game;
  /** Plataforma pré-selecionada no cadastro (ex.: na página de uma família). */
  defaultPlatform?: Platform;
  trigger: React.ReactNode;
};

export function GameFormDialog({ game, defaultPlatform, trigger }: GameFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {game ? "Editar jogo" : "Adicionar jogo"}
          </DialogTitle>
          <DialogDescription>
            {game ? "Atualize as informações deste jogo." : "Registre mais um jogo na sua coleção."}
          </DialogDescription>
        </DialogHeader>
        {/* Montado só com o diálogo aberto: o formulário sempre começa limpo. */}
        <GameForm game={game} defaultPlatform={defaultPlatform} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function parseDecimal(text: string): number | null {
  const normalized = text.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
}

function GameForm({
  game,
  defaultPlatform,
  onDone,
}: {
  game?: Game;
  defaultPlatform?: Platform;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const form = useForm<GameInput>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      title: game?.title ?? "",
      platform: game?.platform ?? defaultPlatform,
      status: game?.status ?? "backlog",
      rating: game?.rating ?? null,
      hoursPlayed: game?.hoursPlayed ?? 0,
      comment: game?.comment ?? "",
      completedAt: game?.completedAt ?? null,
    },
  });
  const { errors } = form.formState;
  const status = useWatch({ control: form.control, name: "status" });
  const comment = useWatch({ control: form.control, name: "comment" });

  // Texto livre dos campos numéricos (aceita vírgula e estados intermediários como "7,").
  const [ratingText, setRatingText] = useState(game?.rating != null ? String(game.rating).replace(".", ",") : "");
  const [hoursText, setHoursText] = useState(game ? String(game.hoursPlayed).replace(".", ",") : "0");

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = game ? await updateGameAction(game.id, values) : await createGameAction(values);
      if (result.ok) {
        toast.success(result.message);
        onDone();
        return;
      }
      toast.error(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof GameInput, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup className="gap-5">
        {/* 1. Nome */}
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor="title">Nome do jogo</FieldLabel>
          <Input
            id="title"
            autoFocus={!game}
            placeholder="Ex.: The Legend of Zelda: Breath of the Wild"
            aria-invalid={Boolean(errors.title)}
            {...form.register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        {/* 2. Plataforma */}
        <Field data-invalid={Boolean(errors.platform)}>
          <FieldLabel htmlFor="platform">Plataforma</FieldLabel>
          <Controller
            control={form.control}
            name="platform"
            render={({ field }) => (
              <PlatformSelect
                id="platform"
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(errors.platform)}
              />
            )}
          />
          <FieldError errors={[errors.platform]} />
        </Field>

        {/* 3. Status */}
        <Field data-invalid={Boolean(errors.status)}>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <StatusToggle
                id="status"
                value={field.value}
                onChange={(next) => {
                  field.onChange(next);
                  // Sugere a data de hoje ao marcar como concluído.
                  if (next === "completed" && !form.getValues("completedAt")) {
                    form.setValue("completedAt", todayIso(), { shouldDirty: true });
                  }
                  form.clearErrors("completedAt");
                }}
              />
            )}
          />
          <FieldError errors={[errors.status]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* 4. Nota */}
          <Field data-invalid={Boolean(errors.rating)}>
            <FieldLabel htmlFor="rating">
              Nota <span className="font-normal text-muted-foreground">(0 a 10)</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="rating"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id="rating"
                      inputMode="decimal"
                      placeholder="Sem nota"
                      value={ratingText}
                      aria-invalid={Boolean(errors.rating)}
                      className={cn(
                        "w-28 font-heading text-lg font-bold tabular-nums",
                        field.value != null && !Number.isNaN(field.value) && ratingTone(field.value),
                      )}
                      onChange={(e) => {
                        setRatingText(e.target.value);
                        field.onChange(parseDecimal(e.target.value));
                      }}
                      onBlur={field.onBlur}
                    />
                    <span className="text-sm text-muted-foreground">/ 10</span>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    step={0.05}
                    value={[field.value != null && !Number.isNaN(field.value) ? field.value : 0]}
                    onValueChange={([v]) => {
                      const rounded = Math.round((v ?? 0) * 100) / 100;
                      field.onChange(rounded);
                      setRatingText(rounded.toFixed(2).replace(".", ","));
                    }}
                    aria-label="Ajustar nota"
                  />
                </div>
              )}
            />
            <FieldDescription>Até 2 casas decimais. Deixe vazio para “sem nota”.</FieldDescription>
            <FieldError errors={[errors.rating]} />
          </Field>

          {/* 5. Horas */}
          <Field data-invalid={Boolean(errors.hoursPlayed)}>
            <FieldLabel htmlFor="hoursPlayed">Horas jogadas</FieldLabel>
            <Controller
              control={form.control}
              name="hoursPlayed"
              render={({ field }) => (
                <Input
                  id="hoursPlayed"
                  inputMode="decimal"
                  value={hoursText}
                  aria-invalid={Boolean(errors.hoursPlayed)}
                  className="tabular-nums"
                  onChange={(e) => {
                    setHoursText(e.target.value);
                    field.onChange(parseDecimal(e.target.value) ?? 0);
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldDescription>Ex.: 42 ou 12,5</FieldDescription>
            <FieldError errors={[errors.hoursPlayed]} />
          </Field>
        </div>

        {/* 6. Comentário */}
        <Field data-invalid={Boolean(errors.comment)}>
          <div className="flex items-baseline justify-between">
            <FieldLabel htmlFor="comment">Comentário</FieldLabel>
            <span
              className={cn(
                "text-xs tabular-nums text-muted-foreground",
                (comment?.length ?? 0) > COMMENT_MAX && "text-destructive",
              )}
              aria-live="polite"
            >
              {comment?.length ?? 0}/{COMMENT_MAX}
            </span>
          </div>
          <Textarea
            id="comment"
            rows={2}
            maxLength={COMMENT_MAX}
            placeholder="Uma frase sobre o jogo..."
            className="resize-none"
            aria-invalid={Boolean(errors.comment)}
            {...form.register("comment")}
          />
          <FieldError errors={[errors.comment]} />
        </Field>

        {/* 7. Data de conclusão (apenas para concluídos) */}
        <Field data-invalid={Boolean(errors.completedAt)} data-disabled={status !== "completed"}>
          <FieldLabel htmlFor="completedAt">Data de conclusão</FieldLabel>
          <Controller
            control={form.control}
            name="completedAt"
            render={({ field }) => (
              <DatePicker
                id="completedAt"
                value={status === "completed" ? field.value : null}
                onChange={field.onChange}
                disabled={status !== "completed"}
                invalid={Boolean(errors.completedAt)}
              />
            )}
          />
          {status !== "completed" && (
            <FieldDescription>Disponível quando o status for “Concluído”.</FieldDescription>
          )}
          <FieldError errors={[errors.completedAt]} />
        </Field>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" className="glow-sm" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          {pending ? "Salvando..." : game ? "Salvar alterações" : "Adicionar jogo"}
        </Button>
      </DialogFooter>
    </form>
  );
}
