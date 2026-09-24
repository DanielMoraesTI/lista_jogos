import type { Metadata } from "next";
import Link from "next/link";

import { ContactLink, LegalPage } from "@/components/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Regras de uso do ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Rules of the game" title="Termos de Uso" updatedAt="24/09/2026">
      <p>
        Ao criar uma conta ou usar o <strong>{SITE.name}</strong>, você concorda com estes termos.
      </p>

      <section>
        <h2>1. O serviço</h2>
        <p>
          O {SITE.name} é um projeto pessoal, gratuito e sem fins comerciais, para catalogar jogos
          eletrônicos. É oferecido “como está”, sem garantia de disponibilidade contínua, e pode
          ser alterado ou encerrado a qualquer momento. Recomendamos exportar sua coleção
          periodicamente.
        </p>
      </section>

      <section>
        <h2>2. Sua conta</h2>
        <ul>
          <li>Você é responsável por manter sua senha segura.</li>
          <li>Informe dados verdadeiros e não crie contas em nome de outras pessoas.</li>
          <li>Uma conta pode ser suspensa em caso de abuso ou uso que prejudique o serviço.</li>
        </ul>
      </section>

      <section>
        <h2>3. Uso aceitável</h2>
        <p>
          Não é permitido tentar acessar dados de outros usuários, sobrecarregar o serviço com
          requisições automatizadas, enviar arquivos maliciosos ou conteúdo ilegal, ofensivo ou que
          viole direitos de terceiros (inclusive em comentários e avatares).
        </p>
      </section>

      <section>
        <h2>4. Conteúdo e marcas</h2>
        <p>
          Os dados que você cadastra são seus. Nomes de jogos, plataformas e marcas pertencem aos
          respectivos donos e são usados apenas para identificação. Capas de jogos são fornecidas
          pela <a href="https://rawg.io" target="_blank" rel="noopener noreferrer">RAWG</a>.
        </p>
      </section>

      <section>
        <h2>5. Privacidade</h2>
        <p>
          O tratamento dos seus dados está descrito na{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </section>

      <section>
        <h2>6. Contato</h2>
        <p>
          Dúvidas sobre estes termos: <ContactLink />.
        </p>
      </section>
    </LegalPage>
  );
}
