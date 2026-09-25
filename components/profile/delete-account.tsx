"use client";

import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteAccountAction } from "@/actions/profile";
import { PasswordInput } from "@/components/auth/password-input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DELETE_CONFIRMATION } from "@/lib/validations";

export function DeleteAccount({ hasPassword, gameCount }: { hasPassword: boolean; gameCount: number }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  const ready = confirmation === DELETE_CONFIRMATION && (!hasPassword || password.length > 0);

  function reset(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) {
      setConfirmation("");
      setPassword("");
    }
  }

  function handleDelete(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;
    startTransition(async () => {
      // Em caso de sucesso a action redireciona (e não retorna).
      const result = await deleteAccountAction({ confirmation, password: hasPassword ? password : undefined });
      if (result && !result.ok) toast.error(result.error);
    });
  }

  return (
    <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5 sm:p-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-destructive">
        <TriangleAlert className="size-5" aria-hidden /> Zona de perigo
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Excluir sua conta apaga permanentemente seu perfil, {gameCount}{" "}
        {gameCount === 1 ? "jogo cadastrado" : "jogos cadastrados"}, seu avatar enviado e o vínculo
        com Google. Considere exportar sua coleção antes.
      </p>

      <AlertDialog open={open} onOpenChange={reset}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 /> Excluir minha conta
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleDelete} className="flex flex-col gap-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação <strong>não pode ser desfeita</strong>. Todos os seus dados serão apagados
                imediatamente e você será desconectado.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="delete-confirmation">
                  Digite <span className="font-mono font-bold text-destructive">{DELETE_CONFIRMATION}</span> para
                  confirmar
                </FieldLabel>
                <Input
                  id="delete-confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  disabled={pending}
                />
              </Field>
              {hasPassword && (
                <Field>
                  <FieldLabel htmlFor="delete-password">Sua senha atual</FieldLabel>
                  <PasswordInput
                    id="delete-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={pending}
                  />
                  <FieldDescription>Confirmamos que é mesmo você antes de apagar tudo.</FieldDescription>
                </Field>
              )}
            </FieldGroup>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
              <Button type="submit" disabled={!ready || pending} className="bg-destructive text-white hover:bg-destructive/90">
                {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
                {pending ? "Excluindo..." : "Excluir tudo"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
