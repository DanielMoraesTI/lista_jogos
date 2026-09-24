import { PageHeader } from "@/components/page-header";
import { SITE } from "@/lib/site";

/** Layout de texto longo para páginas legais (privacidade, termos). */
export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow={eyebrow} title={title} description={`Última atualização: ${updatedAt}`} />
      <div className="flex flex-col gap-6 leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
        {children}
      </div>
    </div>
  );
}

/** Canal de contato do responsável pelo site. */
export function ContactLink({ children = "mensagem pelo LinkedIn do responsável" }: { children?: React.ReactNode }) {
  return (
    <a href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
