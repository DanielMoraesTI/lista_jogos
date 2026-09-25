# 🎮 GameVault — catálogo pessoal de jogos

Registre, acompanhe e analise sua jornada gamer: jogos **concluídos**, **jogando** e **pretendo jogar**, com notas (0–10, duas casas decimais), horas jogadas, comentários, dashboard com gráficos e exportação em CSV/XLSX/PDF.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Turbopack) |
| Linguagem | TypeScript (strict) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (Radix), lucide-react |
| Autenticação | Auth.js v5 (e-mail/senha com bcrypt + Google/GitHub opcionais), sessão JWT |
| Banco | Neon (PostgreSQL serverless) via driver HTTP |
| ORM | Drizzle ORM + drizzle-kit (migrations em SQL versionadas) |
| Gráficos | Recharts (componente `chart` do shadcn) |
| Formulários | React Hook Form + Zod |
| Exportação | ExcelJS (XLSX), CSV nativo, jsPDF + autotable (PDF) |
| Hospedagem | Vercel |

### Por que Drizzle (e não Prisma)?
- Não usa binário de engine, o que dá cold start menor nas funções serverless da Vercel.
- Conversa direto com o driver HTTP do Neon (`@neondatabase/serverless`), sem pool TCP para gerenciar.
- O schema é TypeScript puro e as migrations são SQL legível, fáceis de revisar no PR.

## Funcionalidades

- **Autenticação**: cadastro/login com e-mail e senha (bcrypt, custo 12), Google e GitHub opcionais, rotas protegidas e nickname editável.
- **Perfil**: avatar em pixel-art (8 opções) ou upload próprio (Vercel Blob), nickname, nome, total de jogos, horas, zerados, plataforma favorita e "nível".
- **CRUD de jogos** em modal: status em controle segmentado, nota com input e slider, data de conclusão habilitada só para "Concluído" (sugere a data de hoje) e comentário de até 140 caracteres com contador.
- **Listagem** em cards ou tabela, com busca, filtros por status/plataforma, 6 ordenações, paginação e "editado há X".
- **Páginas de plataforma** (`/plataforma/pc|xbox|playstation|nintendo|sega`) com chips por console.
- **Dashboard**: estatísticas, rosca por console, barras por família, "mais jogado", "mais bem avaliado" e os 10 últimos cadastrados.
- **Exportação** de todos os jogos, só da família ou só do filtro atual, em CSV, XLSX ou PDF, gerada no servidor.
- **Temas**: Dark Gamer (padrão), Claro, Neon Roxo, Neon Verde e Neon Azul.
- **Capas automáticas** pela API da RAWG (opcional).
- **Responsivo** do celular (360 px) ao desktop largo.

## Estrutura

```
app/
  (auth)/login, cadastro        telas de autenticação (sem header)
  (app)/                        páginas com header fixo + footer
    page.tsx                    landing (visitante) ou dashboard (logado)
    jogos/                      Meus Jogos
    plataforma/[familia]/       PC, Xbox, PlayStation, Nintendo, Sega
    perfil/, sobre/
  api/auth/[...nextauth]/       Auth.js
  api/export/                   geração de CSV/XLSX/PDF
actions/                        Server Actions (auth, games, profile)
components/                     ui/ (shadcn), layout/, games/, dashboard/, ...
db/                             schema.ts, index.ts, migrate.ts, seed.ts
drizzle/                        migrations SQL geradas
lib/                            auth, filtros, queries, validações, plataformas, exportação
proxy.ts                        proteção otimista de rotas (antigo middleware)
```

## Rodando localmente

Pré-requisitos: **Node.js 20.9+** e uma conta gratuita no [Neon](https://neon.tech).

```bash
# 1. Dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env.local
#   → preencha DATABASE_URL (Neon) e AUTH_SECRET (gere com: npx auth secret)

# 3. Banco de dados
npm run db:migrate     # cria tabelas, enums, índices e constraints
npm run db:seed        # (opcional) usuário demo + 24 jogos de exemplo

# 4. Servidor
npm run dev            # http://localhost:3000
```

O seed usa `SEED_EMAIL` e `SEED_PASSWORD` do `.env.local`. É idempotente: se rodar de novo, ele recria os jogos do usuário demo.

### Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `start` | build e servidor de produção |
| `npm run lint` / `typecheck` | ESLint e TypeScript |
| `npm run db:generate` | gera nova migration após alterar `db/schema.ts` |
| `npm run db:migrate` | aplica as migrations pendentes |
| `npm run db:studio` | abre o Drizzle Studio para inspecionar dados |
| `npm run db:seed` | popula dados de demonstração |
| `npm run db:covers` | busca na RAWG as capas dos jogos sem capa (`-- --all` refaz todas) |

## Configurando o Neon

1. Crie um projeto em [console.neon.tech](https://console.neon.tech) (região próxima dos usuários, ex. `aws-sa-east-1`).
2. Em **Connect**, copie a connection string **pooled** (host com `-pooler`) e cole em `DATABASE_URL`.
3. Rode `npm run db:migrate`.

> Dica: use uma *branch* do Neon para desenvolvimento e a `main` para produção. Cada uma tem sua própria `DATABASE_URL`.

## Variáveis de ambiente

Todas estão documentadas em [.env.example](.env.example).

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | conexão com o Neon |
| `AUTH_SECRET` | ✅ | assinatura do JWT de sessão |
| `AUTH_TRUST_HOST` | só fora da Vercel | `true` para rodar `npm run build && npm start` localmente (na Vercel e no `npm run dev` é automático) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | — | login com Google |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | — | login com GitHub |
| `BLOB_READ_WRITE_TOKEN` | — | upload de avatar |
| `RAWG_API_KEY` | — | capas automáticas ([chave grátis](https://rawg.io/apidocs)) |
| `SEED_EMAIL` / `SEED_PASSWORD` | — | usuário do seed (apenas dev) |

Os recursos opcionais se desligam sozinhos quando a variável está vazia: os botões OAuth somem, o upload vira só a galeria de avatares e as capas passam a ser geradas.

### Login social (opcional)
- **Google**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client ID (Web). Redirect URI: `https://SEU-DOMINIO/api/auth/callback/google` (e a de `localhost:3000` para dev).
- **GitHub**: [Developer settings](https://github.com/settings/developers) → New OAuth App. Callback: `https://SEU-DOMINIO/api/auth/callback/github`.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Na [Vercel](https://vercel.com/new), importe o repositório (o framework Next.js é detectado sozinho).
3. Em **Settings → Environment Variables**, cadastre `DATABASE_URL`, `AUTH_SECRET` e as opcionais que quiser usar.
   - Alternativa: **Storage → Connect Database → Neon**. A integração cria a `DATABASE_URL` automaticamente.
   - Para o upload de avatar: **Storage → Create → Blob**. O `BLOB_READ_WRITE_TOKEN` é injetado sozinho.
4. Aplique as migrations no banco de produção (uma vez por migration nova):
   ```bash
   DATABASE_URL="<url-de-producao>" npm run db:migrate
   ```
5. Deploy. Depois, atualize as URLs de callback do Google/GitHub com o domínio final.

> `AUTH_URL` e `AUTH_TRUST_HOST` não são necessários na Vercel.

## Segurança

- Senhas com **bcrypt** (custo 12). Na falha de login, a comparação roda mesmo quando o e-mail não existe, para o tempo de resposta não revelar quais contas existem.
- **Toda Server Action e Route Handler revalida a sessão** e filtra por `user_id`. O `proxy.ts` é só uma checagem otimista.
- Validação com **Zod** no cliente e no servidor, mais **CHECK constraints** no banco (nota 0–10, horas ≥ 0, concluído exige data).
- `callbackUrl` sanitizado contra *open redirect*.
- CSV exportado protegido contra **injeção de fórmulas** (células iniciadas por `= + - @`).
- Upload de avatar validado por tamanho e pela **assinatura binária** do arquivo, e **reprocessado no servidor** (sharp): remove todos os metadados, incluindo **GPS**, padroniza em 512×512 WebP, rejeita arquivos disfarçados e "bombas de descompressão". O nome do arquivo é aleatório e não expõe o id do usuário.
- Cabeçalhos de segurança: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS; `X-Powered-By` removido.
- `.env*` ignorado pelo git; só o `.env.example`, sem valores reais, é versionado.

## Personalização

- **Nome do site e link do GitHub**: [lib/site.ts](lib/site.ts)
- **Temas**: variáveis em [app/globals.css](app/globals.css) e lista em [lib/themes.ts](lib/themes.ts)
- **Plataformas, cores e famílias**: [lib/platforms.ts](lib/platforms.ts)
- **Frases do footer**: [lib/quotes.ts](lib/quotes.ts)
