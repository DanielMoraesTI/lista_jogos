import type { Metadata } from "next";
import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { oauthProviders } from "@/lib/auth";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <Card className="glass glow border-0">
      <CardHeader className="text-center">
        <p className="font-pixel text-[10px] tracking-widest text-primary uppercase">New Game</p>
        <CardTitle className="text-2xl">Crie seu personagem</CardTitle>
        <CardDescription>Monte seu catálogo e acompanhe cada conquista.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <RegisterForm />
        <OAuthButtons {...oauthProviders} />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Já tem conta?&nbsp;
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </CardFooter>
    </Card>
  );
}
