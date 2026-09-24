"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export function ProfileForm({ defaults, email }: { defaults: ProfileInput; email: string }) {
  const [pending, startTransition] = useTransition();
  const form = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: defaults });
  const { errors, isDirty } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      if (result.ok) {
        toast.success(result.message);
        form.reset(values);
      } else {
        toast.error(result.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.nickname)}>
          <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
          <Input id="nickname" autoComplete="username" aria-invalid={Boolean(errors.nickname)} {...form.register("nickname")} />
          <FieldDescription>Exibido no header e no seu perfil.</FieldDescription>
          <FieldError errors={[errors.nickname]} />
        </Field>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...form.register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" value={email} disabled readOnly />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" disabled={pending || !isDirty} className="glow-sm">
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            Salvar
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
