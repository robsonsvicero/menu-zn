# Design System - DS_MENUZN

Este arquivo documenta a especificação técnica do **DS_MENUZN** para o Guia Gastronômico da Zona Norte.

---

## 1. Cores (Color Tokens)

Estas são as cores de marca, superfícies e suporte funcionais do design system:

| Token / Variável | Nome do Token | Valor Hex | Descrição |
| :--- | :--- | :--- | :--- |
| `bg-editorial-surface` | Off-White | `#FAF8F2` | Cor de fundo primária do tema e das páginas (efeito marfim). |
| `text-editorial-on-surface` | Charcoal / Dark Grey | `#2f2e2e` | Texto padrão do corpo, títulos internos e limites de alta ênfase. |
| `editorial-primary` | Peach Terracotta Accent | `#943515` | Destaques de cabeçalhos, botões principais, links ativos e indicadores. |
| `editorial-secondary` | Peach Terracotta Accent | `#D69869` | Botões outline, hover
| `editorial-surface-low` | Soft Obsidian | `#222222` | Cor de fundo do rodapé, blocos bento escuros e frames de apoio. |
| `editorial-secondary` | Silver Gray | `#b9b9b9` | Textos de apoio secundários, tags e bordas em fundos escuros. |
| `editorial-surface-bright` / `lowest` | Pure White | `#ffffff` | Fundo de cartões (cards), botões de ação e modais elevados. |
| `editorial-outline` | Bento Outline Slate | `#cbd5e1` | Linhas de bordas finas estruturais e grades. |
| `error` | Gastro Crimson Alert | `#ff4040` | Status de erro, alertas críticos e ações destrutivas. |

---

## 2. Tipografia (Typography Tokens)

Nossa escala tipográfica combina fontes serifadas de alta sofisticação com fontes sem serifa modernas de alta legibilidade:

### Fontes Utilizadas:
- **Serif (Display / Títulos)**: `Libre Caslon Text`
- **Sans-Serif (Textos / UI)**: `Inter`

### Escala de Fontes:

| Nome do Token | Família | Tamanho | Peso | Line Height | Uso Recomendado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Title XL** | Libre Caslon Text | `60px` | `700` (Bold) | `84px` | Grandes títulos e seções de destaque editorial. |
| **Page Title** | Libre Caslon Text | `50px` | `700` (Bold) | `70px` | Título principal da página ou capa de revistas digitais. |
| **Heading 3** | Libre Caslon Text | `40px` | `700` (Bold) | `56px` | Subtítulos de seções principais. |
| **Heading 4** | Libre Caslon Text | `40px` | `400` (Regular) | `56px` | Textos em destaque e títulos de cards de restaurantes. |
| **Heading 5** | Libre Caslon Text | `30px` | `400` (Regular) | `42px` | Títulos secundários de blocos bento. |
| **Heading 6** | Libre Caslon Text | `22px` | `400` (Regular) | `30.8px` | Títulos pequenos em listas e adegas boutique. |
| **Body L** | Inter | `17px` | `400` (Regular) | `23.8px` | Parágrafos introdutórios e lead copy. |
| **Body M (Default)** | Inter | `15px` | `400` (Regular) | `21px` | Corpo de texto comum e descrições gerais. |
| **Body S** | Inter | `14px` | `400` (Regular) | `19.6px` | Metadados, informações secundárias dos cards. |
| **Body XS** | Inter | `12px` | `400` (Regular) | `16.8px` | Notas de rodapé, termos legais e microlegendas. |

---

## 3. Formas e Bordas (Shape Tokens)

Arredondamentos padronizados para botões, inputs e containers Bento Grid:

- **Extra Small (`sm`)**: `6px (0.375rem)` — Badges de status, pequenos botões.
- **Default / Medium**: `12px (0.75rem)` — Inputs, filtros superiores.
- **Medium Large (`md`)**: `16px (1.0rem)` — Botões de ação, menus flutuantes.
- **Large (`lg`)**: `24px (1.50rem)` — Blocos bento padrão, cards de conteúdo.
- **Extra Large (`xl`)**: `32px (2.00rem)` — Contêiner principal do grid da página.
- **Full (`full`)**: `9999px` — Chips, avatares circulares e tags de filtros.

---

## 4. Layout e espaçamento responsivo (Layout Tokens)

### Medidas base para formato web
- **Seções principais**: `padding-left/right: 120px` e `padding-top/bottom: 96px`
- **CTA (chamada para ação)**: `padding-left/right: 120px` e `padding-top/bottom: 140px`
- **Header**: `padding-left/right: 120px`
- **Footer**: `padding-left/right: 120px`, `padding-top: 96px`, `padding-bottom: 40px`

### Diretrizes de responsividade
- **Desktop grande (>= 1440px)**: manter os valores web padrão.
- **Desktop padrão / tablet landscape (>= 1024px)**:
  - Seções: `px-96`, `py-80`
  - CTA: `px-96`, `py-120`
  - Header: `px-96`
  - Footer: `px-96`, `pt-80`, `pb-32`
- **Tablet / mobile largo (>= 768px)**:
  - Seções: `px-64`, `py-72`
  - CTA: `px-64`, `py-96`
  - Header: `px-64`
  - Footer: `px-64`, `pt-72`, `pb-32`
- **Mobile padrão (< 768px)**:
  - Seções: `px-24`, `py-48`
  - CTA: `px-24`, `py-56`
  - Header: `px-24`
  - Footer: `px-24`, `pt-48`, `pb-32`

### Uso recomendado
- Adote as medidas web como base para layouts de largura ampla.
- Reduza o espaçamento progressivamente em pontos de quebra para preservar a hierarquia e a legibilidade.
- Ajuste imagens e grades internas para que o conteúdo permaneça centralizado quando o `padding` for reduzido.
