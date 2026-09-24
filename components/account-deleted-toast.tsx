"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/** Confirma a exclusão da conta ao chegar na home e limpa o parâmetro da URL. */
export function AccountDeletedToast() {
  const router = useRouter();
  useEffect(() => {
    toast.success("Conta excluída", {
      description: "Todos os seus dados foram apagados. Obrigado por ter jogado com a gente!",
    });
    router.replace("/", { scroll: false });
  }, [router]);
  return null;
}
