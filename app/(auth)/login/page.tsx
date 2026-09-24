import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { oauthProviders } from "@/lib/auth";

export const metadata: Metadata = { title: "Entrar" };

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Este e-mail já está cadastrado com outro método de login. Entre com e-mail e senha.",
  AccessDenied: "Acesso negado.",
  Configuration: "Erro de configuração do login. Tente novamente mais tarde.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const callbackUrl = typeof searchParams.callbackUrl === "string" ? searchParams.callbackUrl : undefined;
  const errorCode = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] ?? "Não foi possível entrar. Tente novamente.") : null;

  return (
    <Card className="glass glow border-0">
      <CardHeader className="text-center">
        <p className="font-pixel text-[10px] tracking-widest text-primary uppercase">Player 1</p>
        <CardTitle className="text-2xl">Press Start</CardTitle>
        <CardDescription>Entre para continuar sua jornada.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {errorMessage && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <LoginForm callbackUrl={callbackUrl} />
        <OAuthButtons {...oauthProviders} callbackUrl={callbackUrl} />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Novo por aqui?&nbsp;
        <Link href="/cadastro" className="font-medium text-primary underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </CardFooter>
    </Card>
  );
}
