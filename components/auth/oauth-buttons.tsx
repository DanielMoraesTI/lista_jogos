import { oauthSignInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";

import { GitHubIcon, GoogleIcon } from "./brand-icons";

export function OAuthButtons({
  google,
  github,
  callbackUrl,
}: {
  google: boolean;
  github: boolean;
  callbackUrl?: string;
}) {
  if (!google && !github) return null;

  return (
    <>
      <FieldSeparator>ou continue com</FieldSeparator>
      <div className="grid gap-2 sm:grid-cols-2">
        {google && (
          <form action={oauthSignInAction.bind(null, "google", callbackUrl)}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <GoogleIcon className="size-4" />
              Google
            </Button>
          </form>
        )}
        {github && (
          <form action={oauthSignInAction.bind(null, "github", callbackUrl)}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <GitHubIcon className="size-4" />
              GitHub
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
