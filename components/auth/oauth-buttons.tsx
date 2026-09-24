import { oauthSignInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { GitHubIcon, GoogleIcon } from "./brand-icons";

/**
 * Separador "ou continue com" sem fundo sólido atrás do texto: funciona sobre
 * o card translúcido (glass) sem criar um retângulo visível.
 */
function OrSeparator() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground" role="separator" aria-label="ou continue com">
      <span aria-hidden className="h-px flex-1 bg-linear-to-r from-transparent to-border" />
      <span aria-hidden>ou continue com</span>
      <span aria-hidden className="h-px flex-1 bg-linear-to-l from-transparent to-border" />
    </div>
  );
}

export function OAuthButtons({
  google,
  github,
  callbackUrl,
}: {
  google: boolean;
  github: boolean;
  callbackUrl?: string;
}) {
  const count = Number(google) + Number(github);
  if (count === 0) return null;

  return (
    <>
      <OrSeparator />
      {/* Um provedor: largura total. Dois: lado a lado a partir de 640px. */}
      <div className={cn("grid gap-2", count > 1 && "sm:grid-cols-2")}>
        {google && (
          <form action={oauthSignInAction.bind(null, "google", callbackUrl)}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <GoogleIcon className="size-4" />
              Continuar com Google
            </Button>
          </form>
        )}
        {github && (
          <form action={oauthSignInAction.bind(null, "github", callbackUrl)}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <GitHubIcon className="size-4" />
              Continuar com GitHub
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
