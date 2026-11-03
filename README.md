# Portfólio · Gustavo Alves dos Santos

Site pessoal: IA aplicada e automação. Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui, gerado de forma totalmente estática.

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev      # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm run start
```

## Estrutura

```
app/                 rotas, layout raiz, tokens em globals.css
components/
  ui/                componentes shadcn/ui adaptados aos tokens
  layout/            header, footer, seção
content/
  types.ts           formatos do conteúdo
  pt-BR/site.ts      textos e dados do site
lib/                 utilitários (cn, URL do site)
```

## Design tokens

Todas as cores, fontes, tamanhos e raios estão em `app/globals.css`, como variáveis CSS e no `@theme` do Tailwind. Componentes usam só esses tokens (`bg-surface`, `text-brand`, `text-h2`, `rounded-card`…).

## Conteúdo

Os textos ficam em `content/pt-BR/`. Itens marcados com `[CONFIRMAR]` ainda precisam de dado real.

## Deploy

Preparado para a Vercel. Defina `NEXT_PUBLIC_SITE_URL` se usar um domínio próprio; sem ela, o site usa o domínio de produção da Vercel.
