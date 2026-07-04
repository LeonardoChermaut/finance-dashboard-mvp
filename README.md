## Pré-requisitos

- Node.js >= 20
- npm, yarn ou pnpm

## Instalação e Execução

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

### Credenciais Mock

| Campo  | Valor                |
| ------ | -------------------- |
| Email  | `admin@empresa.com`  |
| Senha  | `admin123`           |

## Comandos

| Comando              | Descrição                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento        |
| `npm run build`      | Build de produção                  |
| `npm run start`      | Inicia servidor de produção        |
| `npm run lint`       | ESLint (flat config)               |
| `npm run typecheck`  | TypeScript `--noEmit`              |
| `npm run test`       | Jest (17 suites, 143+ testes)      |
| `npm run validate`   | lint → typecheck → test (sequencial) |
| `npm run format`     | Prettier em todos os arquivos      |

### Docker

```bash
docker-compose up --build
```

Build multi-stage com `node:22-alpine` e output standalone do Next.js.
Servido na porta `3000`.

---

## Estrutura do Projeto

```
src/
├── middleware.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── icon.png
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── dashboard.styled.ts
│   └── profile/
│       ├── page.tsx
│       └── profile.styled.ts
├── components/
│   ├── charts/
│   │   ├── charts.tsx
│   │   └── charts.styled.ts
│   ├── dashboard-skeleton/
│   │   ├── index.ts
│   │   └── dashboard-skeleton.tsx
│   ├── filter-bar/
│   │   ├── filter-bar.tsx
│   │   └── filter-bar.styled.ts
│   ├── sidebar/
│   │   ├── sidebar.tsx
│   │   └── sidebar.styled.ts
│   ├── summary-cards/
│   │   ├── summary-cards.tsx
│   │   └── summary-cards.styled.ts
│   └── ui/
│       ├── index.ts
│       ├── auth-layout.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── field.tsx
│       ├── form.tsx
│       ├── skeleton.tsx
│       └── theme-toggle.tsx
├── constants/
│   ├── breakpoints.ts
│   ├── config.ts
│   ├── dashboard.ts
│   └── drilldown.ts
├── hooks/
│   ├── index.ts
│   ├── use-click-outside.ts
│   ├── use-delay.ts
│   ├── use-drilldown.ts
│   ├── use-export.ts
│   ├── use-form.ts
│   ├── use-local-storage.ts
│   ├── use-pagination.ts
│   ├── use-password-visibility.ts
│   ├── use-quick-filters.ts
│   ├── use-search-params.ts
│   └── use-sync-filters-to-url.ts
├── lib/
│   ├── api.ts
│   ├── export.ts
│   └── styled.d.ts
├── mocks/
│   ├── transactions.json
│   └── users.ts
├── modules/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── auth.schemas.ts
│   │   ├── auth-service.ts
│   │   └── use-auth-store.ts
│   ├── filters/
│   │   ├── index.ts
│   │   ├── filters.types.ts
│   │   ├── apply-filters.ts
│   │   └── use-filters-store.ts
│   └── transactions/
│       ├── index.ts
│       ├── transaction.types.ts
│       ├── transaction-mappers.ts
│       ├── transaction-metrics.ts
│       ├── transaction-repository.ts
│       ├── transaction-repository-api.ts
│       ├── transaction-repository-factory.ts
│       └── use-dashboard-data.ts
├── routes/
│   └── routes.ts
├── styles/
│   ├── global-style.ts
│   └── styled-registry.tsx
├── theme/
│   ├── index.ts
│   ├── theme-types.ts
│   ├── theme-provider.tsx
│   ├── shared.ts
│   ├── light-theme.ts
│   └── dark-theme.ts
└── utils/
    ├── calcs.ts
    ├── date.ts
    ├── format.ts
    ├── pagination.ts
    ├── profile.ts
    ├── string.ts
    └── transaction.ts
```

---

O código é organizado em modulos sob `src/modules/`:

- **auth** — Login mockado (`admin@empresa.com` / `admin123`), sessão via cookie, store Zustand com persist. Factory pattern para alternar entre mock e API real. O `setAuthenticated` preserva o nome do usuário já persistido — se o usuário trocou o nome no perfil, o login não sobrescreve de volta para o valor do mock.
- **transactions** — Repository pattern com factory (`NEXT_PUBLIC_DATA_SOURCE`). Mappers normalizam dados brutos (strings → cents, IDs, pending status). Metrics calculam summary, monthly totals e accumulated balance. Hook `useDashboardData` orquestra tudo.
- **filters** — Estado global persistido no localStorage via Zustand. Deriva opções disponíveis a partir dos dados. Sync bidirecional com URL (search params).

Cada módulo tem seu barrel export via `index.ts`. Importações entre módulos usam sempre o alias `@/`.

### Por que Repository Pattern?

A separação em `transaction-repository.ts` (mock), `transaction-repository-api.ts` (API) e `transaction-repository-factory.ts` existe porque o dataset mock é um JSON estático com ~50k transações, enquanto a API real tem paginação e endpoints REST. O factory seleciona qual usar baseado na env var `NEXT_PUBLIC_DATA_SOURCE`. Quando a API estiver pronta, basta mudar a variável de ambiente — nenhum componente precisa alterar.

O page size da API (`API_PAGE_SIZE = 10000`) é uma constante extraída para evitar magic number. Se o dataset da API crescer além de 10k registros, a implementação precisa de paginação real (loop de fetch) — mas para o MVP atual, uma única requisição com pageSize alto resolve.

### Por que Zustand com Persist?

Os filtros precisam se manter mesmo com o refresh da página.
O estado de auth precisa persistir entre abas.O Zustand com `persist` middleware resolve ambos sem boilerplate.
Os stores são tipados integralmente — sem `any` ou casts forçados.

Ambos os stores (auth e filters) incluem `version` e `migrate` no config do persist. Quando o shape de um store mudar em uma versão futura, a migration roda automaticamente e evita erros de runtime causados por dados stale no localStorage.

### Por que Dynamic Imports no Dashboard?

O dashboard carrega ~50k transações e renderiza 3 gráficos Chart.js. Usar `next/dynamic` com `ssr: false` nos componentes de Charts, SummaryCards e FilterBar evita que o bundle inicial inclua chart.js, xlsx e jspdf. O código só é carregado quando o dashboard monta no client.

---

## Algumas Decisões Técnicas

### Mobile First com Scroll Lock iOS

O sidebar mobile usa `position: fixed` + `top: -scrollY` para o scroll lock. Simples `overflow: hidden` no body não funciona no iOS — o Safari ignora. Isso meio que salva a posição do scroll, trava o body com `position: fixed`, e restaura ao fechar. O `overscroll-behavior: contain` no overlay previne que o scroll bleed para o body por trás.

### Doughnut Chart com Dados Ajustados

O card de Distribuição mostra receitas (R$), despesas (R$) e pendentes (count) no mesmo gráfico. Plotar um count de ~5 junto com valores monetários de ~80.000 resultava em um slice invisível. Isso ajusta o pendingCount proporcionalmente: `Math.max(averageMonetary * 0.05, pendingCount * 100)`. O tooltip mostra o valor real (count), não o inflado.

### Bar Chart Filter vs Global Filter

Clicar em uma barra do gráfico define um date range específico. O botão "Limpar filtro" nesse gráfico chama `setDateRange({ startDate: null, ... })` — não `resetFilters()`. A razão: o usuário pode ter filtros de account/industry/states ativos que não devem ser afastados ao desfazer a seleção de uma barra.

### Hydration Safety

Três componentes usam o padrão `useState<boolean>(false)` + `useEffect(() => setIsHydrated(true), [])` para garantir que o rendering dependa do client: ThemeProvider (evita flash de tema errado), ProfilePage (evita redirect incorreto antes do auth check), e a data fetching no useDashboardData.

### ESLint com react-hooks

`eslint-plugin-react-hooks` v7.1.1 configurado com `rules-of-hooks` como error e `exhaustive-deps` como warn. O `exhaustive-deps` como warn (não error) é intencional: em alguns casos o dev sabe que uma dependência não precisa estar no array (ex: setters estáveis do Zustand), e bloquear o build por isso causaria mais fricção do que benefício.

### Auth: Preservando Nome do Usuário

O mock auth service retorna sempre o nome hardcoded ("Admin"). Se o usuário troca o nome no perfil, o `updateUser` persiste no Zustand. No próximo login, `setAuthenticated` faz merge: `state.user?.name ?? user.name`. Isso preserva o nome customizado. O toast de boas-vindas lê `useAuthStore.getState().user` após o `setAuthenticated`, garantindo que mostra o nome correto.

### Sidebar: Factory de Auth Consistente

O sidebar usa `getAuthService()` (factory) em vez de `createMockAuthService()` hardcoded. Isso garante que o logout também funcione  quando `NEXT_PUBLIC_DATA_SOURCE=api` — sem isso, o logout sempre usaria o mock independentemente da configuração.

---

## Testes

17 suítes de teste cobrindo:

| Área             | Arquivos                                        | Cobertura                                    |
| ---------------- | ----------------------------------------------- | -------------------------------------------- |
| Auth             | `auth.schemas`, `auth-service`, `use-auth-store`| Zod schemas, mock login, store transitions   |
| Filters          | `apply-filters`, `use-filters-store`            | Derivação, aplicação, toggle/set/reset       |
| Transactions     | `transaction-mappers`, `transaction-metrics`, `transaction-repository`, `transaction-repository-api` | Mappers, cálculos, repositório mock e API    |
| Hooks            | `use-click-outside`, `use-form`, `use-pagination`, `use-password-visibility` | Event listeners, validação, paginação        |
| Lib              | `api`                                           | HTTP client, headers, error handling         |
| Utils            | `date`, `format`, `transaction`                 | Formatação, moeda, filtragem por tipo        |

Fixtures usam `Object.freeze` para impedir mutação acidental entre testes.

---

## Stack

| Camada          | Tecnologia                                    |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                       |
| UI              | React 19, styled-components v6 (SSR)          |
| State           | Zustand v5 (persist middleware)               |
| Validação       | Zod v4                                        |
| Gráficos        | Chart.js v4 + react-chartjs-2                 |
| Exportação      | xlsx (Excel), jspdf + html2canvas (PDF)       |
| Ícones          | lucide-react                                  |
| Notificações    | sonner                                        |
| Tipagem         | TypeScript 5.7 (strict mode)                  |
| Linting         | ESLint 10 (flat config) + Prettier            |
| Git Hooks       | Husky + lint-staged + commitlint              |
| Testes          | Jest 30 + Testing Library                     |
| Deploy          | Docker (multi-stage, standalone output)       |
| Locale          | pt-BR (formatação, textos, moeda)             |

---

## Env Vars

| Variável                      | Default   | Descrição                                |
| ----------------------------- | --------- | ---------------------------------------- |
| `NEXT_PUBLIC_DATA_SOURCE`     | `mock`    | `mock` ou `api` — seleciona repositório  |
| `NEXT_PUBLIC_API_BASE_URL`    | —         | URL base da API (quando `api`)           |
| `NEXT_PUBLIC_API_USER`        | —         | Credencial de usuário para a API         |
| `NEXT_PUBLIC_API_PASS`        | —         | Credencial de senha para a API           |
