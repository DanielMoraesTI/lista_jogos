import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="container-page relative flex-1 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
