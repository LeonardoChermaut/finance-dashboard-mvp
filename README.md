# Dashboard Financeiro - MVP

Este projeto é um MVP de um dashboard financeiro construído com Next.js 16, TypeScript, e styled-components.

## Pré-requisitos
- Node.js >= 20
- npm, yarn ou pnpm

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Execução

### Rodando o projeto localmente

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Acesso

Como não há backend, o login é mockado com os seguintes dados:

**Email**: `admin@empresa.com`
**Senha**: `admin123`

## Comandos Úteis

- `npm run dev`: Inicia o projeto
- `npm run typecheck`: Executa a verificação do TypeScript
- `npm run lint`: Executa o ESLint
- `npm run test`: Executa os testes unitários (Jest)

## Docker

Para iniciar o projeto usando Docker Compose:

```bash
docker-compose up --build
```
O front-end estará disponível na porta `3000`.

## Estrutura e Arquitetura
A arquitetura é dividida em domínios lógicos (feature-based): `auth`, `transactions`, e `filters`.
A lógica foi pensada para facilitar a substituição de dados mockados por uma futura API.

## Decisões Técnicas Principais
- **Autenticação**: Mockada usando uma Promise simulando delay, armazenando persistência com `zustand/middleware` e proteção via `middleware.ts` do Next.js.
- **Transações**: "Transações Pendentes" é um status calculado a partir das datas (últimos 5 dias em relação à mais recente).
- **Filtros Globais**: Estado persistido no `localStorage` gerido pelo `zustand`. Os componentes de UI assinam apenas os dados filtrados.
