import type { Metadata } from "next";
import Link from "next/link";

import { ContactLink, LegalPage } from "@/components/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como o ${SITE.name} coleta, usa e protege seus dados.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Save file" title="Política de Privacidade" updatedAt="24/09/2026">
      <p>
        O <strong>{SITE.name}</strong> (listajogos.vercel.app) é um catálogo pessoal de jogos
        eletrônicos, sem fins comerciais. Esta política explica quais dados coletamos, por que e
        como você pode controlá-los, em linha com a Lei Geral de Proteção de Dados (LGPD, Lei nº
        13.709/2018).
      </p>

      <section>
        <h2>1. Dados que coletamos</h2>
        <ul>
          <li>
            <strong>Dados de conta:</strong> nome, nickname, e-mail e, se você criar senha, apenas o
            <em> hash</em> dela (a senha em si nunca é armazenada).
          </li>
          <li>
            <strong>Login com Google:</strong> recebemos somente seu <strong>nome, e-mail e foto
            de perfil</strong>. Não acessamos contatos, Gmail, Drive nem qualquer outro dado da sua
            conta Google.
          </li>
          <li>
            <strong>Avatar enviado:</strong> a imagem é reprocessada no servidor e publicada sem
            metadados (como localização GPS e modelo da câmera).
          </li>
          <li>
            <strong>Sua coleção:</strong> jogos, plataformas, status, notas, horas jogadas,
            comentários e datas que você mesmo cadastra.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Como usamos os dados</h2>
        <p>
          Exclusivamente para autenticar você e exibir, organizar e exportar a sua própria coleção.
          Não vendemos, alugamos nem compartilhamos seus dados para publicidade, e não usamos dados
          do Google para nenhuma outra finalidade além do login.
        </p>
      </section>

      <section>
        <h2>3. Quem pode ver seus dados</h2>
        <p>
          Somente você. Cada jogo pertence à sua conta e não é visível para outros usuários. Os
          dados ficam armazenados nos serviços que hospedam o site: <strong>Vercel</strong>{" "}
          (aplicação e imagens de avatar) e <strong>Neon</strong> (banco de dados PostgreSQL). As
          capas dos jogos são obtidas da API pública da <strong>RAWG</strong> apenas pelo nome do
          jogo, sem enviar dados pessoais.
        </p>
      </section>

      <section>
        <h2>4. Cookies e armazenamento local</h2>
        <ul>
          <li>
            <strong>Cookie de sessão</strong> (essencial): mantém você conectado. É criptografado e
            expira em até 30 dias.
          </li>
          <li>
            <strong>Preferência de tema</strong>, salva no seu navegador.
          </li>
        </ul>
        <p>Não usamos cookies de rastreamento, publicidade ou analytics de terceiros.</p>
      </section>

      <section>
        <h2>5. Segurança</h2>
        <p>
          Conexões sempre por HTTPS, senhas protegidas com bcrypt, validação de dados no servidor
          e isolamento das informações por usuário. Nenhum sistema é 100% imune, mas adotamos boas
          práticas para proteger suas informações.
        </p>
      </section>

      <section>
        <h2>6. Seus direitos</h2>
        <p>
          Você pode, a qualquer momento: acessar e corrigir seus dados na página de{" "}
          <Link href="/perfil">Perfil</Link>; exportar toda a sua coleção (CSV, Excel ou PDF) em{" "}
          <Link href="/jogos">Meus Jogos</Link>; e solicitar a <strong>exclusão completa da sua
          conta</strong> e de todos os dados associados por <ContactLink />. Pedidos são atendidos
          em até 15 dias.
        </p>
      </section>

      <section>
        <h2>7. Alterações</h2>
        <p>
          Esta política pode ser atualizada. A data no topo indica a versão vigente; mudanças
          relevantes serão destacadas no site.
        </p>
      </section>

      <section>
        <h2>8. Contato</h2>
        <p>
          Dúvidas sobre privacidade: <ContactLink />.
        </p>
      </section>
    </LegalPage>
  );
}
