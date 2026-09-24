import { z } from "zod";

import { GAME_STATUSES, PLATFORMS } from "@/lib/platforms";

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Informe um e-mail válido").max(255, "E-mail muito longo"));

export const nicknameSchema = z
  .string()
  .trim()
  .min(3, "O nickname precisa de pelo menos 3 caracteres")
  .max(32, "O nickname pode ter no máximo 32 caracteres")
  .regex(
    /^[\p{L}\p{N}_.\-]+$/u,
    "Use apenas letras, números, ponto, hífen ou underline",
  );

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Informe sua senha").max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome")
      .max(100, "Nome muito longo"),
    nickname: nicknameSchema,
    email,
    password: z
      .string()
      .min(8, "A senha precisa de pelo menos 8 caracteres")
      .max(128, "A senha pode ter no máximo 128 caracteres")
      .regex(/[A-Za-z]/, "Inclua pelo menos uma letra")
      .regex(/\d/, "Inclua pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100, "Nome muito longo"),
  nickname: nicknameSchema,
});
export type ProfileInput = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Jogos
// ---------------------------------------------------------------------------

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function hasAtMostTwoDecimals(value: number) {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;
}

export const gameSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Informe o nome do jogo")
      .max(200, "Nome muito longo"),
    platform: z.enum(PLATFORMS, { error: "Escolha uma plataforma" }),
    status: z.enum(GAME_STATUSES, { error: "Escolha um status" }),
    rating: z
      .number({ error: "Informe um número" })
      .min(0, "A nota mínima é 0")
      .max(10, "A nota máxima é 10")
      .refine(hasAtMostTwoDecimals, "Use no máximo 2 casas decimais")
      .nullable(),
    hoursPlayed: z
      .number({ error: "Informe um número" })
      .min(0, "Não pode ser negativo")
      .max(99_999, "Valor muito alto")
      .refine(
        (v) => Math.abs(v * 10 - Math.round(v * 10)) < 1e-6,
        "Use no máximo 1 casa decimal",
      ),
    comment: z
      .string()
      .trim()
      .max(140, "Máximo de 140 caracteres"),
    completedAt: z
      .string()
      .regex(isoDate, "Data inválida")
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "completed" && !data.completedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: "Informe a data de conclusão",
      });
    }
    if (data.completedAt) {
      const today = new Date().toISOString().slice(0, 10);
      // Margem de 1 dia para fusos horários à frente do UTC.
      const tomorrow = new Date(Date.now() + 86_400_000)
        .toISOString()
        .slice(0, 10);
      if (data.completedAt > tomorrow) {
        ctx.addIssue({
          code: "custom",
          path: ["completedAt"],
          message: `A data não pode ser futura (hoje é ${today.split("-").reverse().join("/")})`,
        });
      }
    }
  });
export type GameInput = z.infer<typeof gameSchema>;

export const gameIdSchema = z.uuid("Identificador inválido");
