# AGENTS.md — Finanças

App mobile de finanças pessoais (receitas, despesas, orçamentos, contas, cartões) construído
com Expo + React Native + NativeWind. Interface em pt-BR, código em inglês.

O `SPEC.md` é a fonte de verdade do produto. Regras de produto que não podem ser violadas:

- **Não usar gráficos** em nenhuma tela.
- **Dark mode é o padrão** da aplicação.
- Cada tela descrita no `SPEC.md` deve ter o botão flutuante (FAB) indicado, quando houver.

## Stack

| Camada       | Tecnologia                                           |
| ------------ | ---------------------------------------------------- |
| Runtime      | Expo SDK 57, React Native 0.86, React 19.2           |
| Navegação    | Expo Router 57 (rotas por arquivo em `app/`)         |
| Estilo       | NativeWind 4.2 + Tailwind CSS 3.4                    |
| Animação     | react-native-reanimated 4.7 + worklets               |
| Estado de UI | Zustand 5 (`store/appStore.ts`)                      |
| Persistência | expo-sqlite 57 + Drizzle ORM 0.45 + drizzle-kit 0.31 |
| Ícones       | lucide-react-native                                  |
| Calendário   | react-native-calendars (locale pt-BR customizado)    |
| Linguagem    | TypeScript 6 em modo `strict`                        |
| Qualidade    | ESLint 9 (flat, expo + prettier) e Prettier 3        |
| Gerenciador  | pnpm (`pnpm-lock.yaml`)                              |

A linha estável do Drizzle é a `0.45.x`; a v1 está em RC. Não atualize nem use `@rc` sem
decisão explícita.

## Estrutura

```
app/                     rotas (Expo Router) — só telas e layouts
  _layout.tsx            Stack raiz, tema, SafeAreaView, StatusBar, bootstrap do banco
  (tabs)/_layout.tsx     Tabs
  (tabs)/index.tsx       Resumo (dashboard)
  (tabs)/lancamentos.tsx Lançamentos (formulário + histórico)
  (tabs)/sobre.tsx       Sobre (placeholder)
components/              componentes de UI reutilizáveis
  AppText.tsx            texto base (+ ícone opcional)
  AppButton.tsx          botão com variantes primary | secondary | dark
  Card.tsx               container arredondado (bg-neutral-800)
  Datepicker.tsx         modal de data com calendário
  MonthPicker.tsx        seleção de mês/ano (FlatLists sincronizadas)
  MonthPickerItem.tsx    item genérico de lista do MonthPicker
shared/
  config/calendarsLocale.ts  locale pt-BR do react-native-calendars
  db/
    client.ts              abertura do banco, PRAGMAs e instância Drizzle
    schema.ts              tabelas, enums, índices e FKs
    seed.ts                dados padrão (categorias/contas)
    repositories/          leitura/escrita por entidade
    queries/               agregações (dashboard, orçamento, fatura)
  domain/
    money.ts               helpers de centavos
    invoice.ts             cálculo do mês de fatura
    installments.ts        divisão de parcelas
    icons.ts               registry de ícones
    colors.ts              paleta fixa de tokens
  hooks/                   hooks de dados (useDatabaseMigrations, useTransactions, ...)
  utils/dateUtils.ts       helpers e tipos de data (Month, getDateOnly, ...)
  utils/nativeWindUtils.ts getColors(colorScheme) para props de ícones
store/appStore.ts        Zustand: tema e visibilidade do saldo
drizzle/                 migrações geradas (versionadas)
drizzle.config.ts        config do drizzle-kit (dialect sqlite, driver expo)
global.css               design tokens (CSS vars) + diretivas do Tailwind
```

Regras de organização:

- Tudo que é rota fica em `app/`; o resto (componentes, hooks, utils, store, `db`, `domain`)
  **nunca** em `app/`.
- `ios/` e `android/` não existem e são gerados (CNG). Nunca criar ou editar manualmente —
  configure nativo via `app.json` e config plugins.
- Novas telas do `SPEC.md` entram como rotas dentro de `app/(tabs)/` (ou grupo próprio, se
  fizer sentido) e devem ser registradas em `app/(tabs)/_layout.tsx`.

## Comandos

```bash
pnpm start              # dev server
pnpm android            # dev build no Android
pnpm ios                # dev build no iOS
pnpm web                # dev server web
pnpm typecheck          # tsc --noEmit
pnpm lint               # expo lint
pnpm lint:fix           # expo lint --fix
pnpm format             # prettier --write .
pnpm format:check       # prettier --check .
pnpm expo install <pkg> # instalar dependência na versão compatível com o SDK
pnpm db:generate        # drizzle-kit generate (após alterar shared/db/schema.ts)
pnpm dlx expo-doctor    # diagnosticar deps/config
```

- Libs nativas (`expo-sqlite`, `expo-crypto`, ...) sempre com `pnpm expo install`, na versão do
  SDK. Libs JS puras (`drizzle-orm`, `zod`, ...) podem usar `pnpm add`.
- Antes de considerar qualquer tarefa concluída, rodar `pnpm typecheck` e `pnpm lint`
  (e `pnpm format:check` se você tocou em estilos/classes). Com persistência, rode também
  `pnpm test` quando a suíte existir.
- `expo-sqlite` está incluído no Expo Go. SQLCipher, `op-sqlite` e qualquer lib fora do Expo Go
  exigem development build.
- Consulte a documentação versionada do SDK antes de usar qualquer API do Expo:
  `https://docs.expo.dev/versions/v57.0.0/`. Não confie na memória — o Expo muda a cada SDK.

## Subagentes

- Definições ficam em `.opencode/agents/` e os commands em `.opencode/commands/`. Mantenha os
  dois versionados junto com o código.
- `frontend-dev`: implementa telas, componentes, schema e repositórios previstos no `SPEC.md`.
  Use quando a tarefa tocar mais de um arquivo ou exigir rodar as verificações ao final.
- `code-reviewer`: revisão **read-only** (nunca edita arquivos); roda `typecheck`, `lint` e
  `format:check`, confere SQL/centavos/migrações e reporta os achados por severidade. Use antes
  de considerar uma tarefa concluída.
- Atalhos: `/dev <tarefa>` e `/review [alvo]` já fixam o agente e executam em sessão filha.
- Subagente começa com contexto novo: passe escopo, arquivos envolvidos e critério de aceite.
  Não delegue tarefas triviais (um arquivo, ajuste óbvio) — o custo de contexto não compensa.

## Padrões de código

### Estilo (NativeWind)

- Use `className` com utilitários Tailwind. Não use `StyleSheet.create` nem estilos inline,
  exceto quando uma API exigir objeto (ex.: `theme` do `react-native-calendars`).
- Combine classes condicionais com `twMerge` (já usado em `AppText`, `AppButton`, `Card`).
- **Nunca** monte classes por interpolação parcial (`` `bg-${color}` ``) — o Tailwind não
  enxerga o valor. Escreva sempre a classe completa em um mapa/objeto.
- O Tailwind usa `darkMode: "class"`. A UI é dark por padrão: use os tokens
  (`bg-neutral-900`, `text-primary`, `bg-teal-800`, ...) e `dark:` só quando o valor mudar.
- O `content` do `tailwind.config.js` cobre apenas `app/**` e `components/**`. Se criar classes
  fora dessas pastas, atualize o `content`.

### Design tokens e tema

- Cores estão duplicadas de propósito em dois lugares: `global.css` (CSS variables para classes
  Tailwind) e `shared/utils/nativeWindUtils.ts` (valores hex para props de componentes como
  ícones do lucide). **Ao adicionar/alterar uma cor, atualize os dois arquivos.**
- `getColors(colorScheme)` é o caminho para passar cor a ícones/calendário. Não hardcode hex
  em telas.
- Tema vive no Zustand (`theme: "light" | "dark"`), aplicado no `app/_layout.tsx` via
  `setColorScheme`. `app.json` declara `userInterfaceStyle: "light"`, mas o app força dark —
  mantenha o dark como default em `appStore`.
- `shared/utils/nativeWindUtils.ts` ainda tem paletas `light` e `dark` idênticas; ao implementar
  tema claro, diferencie-as e valide as duas variantes.

### Estado

- Estado global: Zustand em `store/appStore.ts`, com tipos separados `AppState` (dados) e
  `AppActions` (ações) e um único `create`.
- **Selecione fatias específicas** no componente (`useAppStore((s) => s.showBalance)`), não o
  store inteiro — a tela `Resumo` atualmente usa `useAppStore((state) => state)` e re-renderiza
  a cada mudança; não replique esse padrão.
- O store guarda **apenas UI/preferências** (`theme`, `showBalance`), persistidas em
  `expo-sqlite/kv-store` via middleware `persist` do Zustand. Dados de domínio vêm do SQLite —
  veja a seção abaixo.

### Persistência (SQLite)

- O banco local é a **fonte de verdade** do domínio. Nunca espelhe transações, contas, cartões
  ou agregados no Zustand.
- Fluxo de leitura: tela → hook (`useLiveQuery`) → repository/query → SQLite. Fluxo de escrita:
  tela → repository → SQLite → live query re-renderiza. **Nenhum SQL em tela/componente.**
- Repositórios ficam em `shared/db/repositories` e recebem a instância do banco (não importam
  singleton), para permitir testes em Node.
- Dinheiro é `INTEGER` em **centavos** (`amount_cents`). Nunca `REAL`. O valor é sempre positivo
  no banco; o sinal exibido vem de `type: "income" | "expense"`.
- Datas em `TEXT` ISO: `YYYY-MM-DD` (vencimento), `YYYY-MM` (mês de referência) e ISO UTC para
  timestamps. Use os helpers de `dateUtils`; não monte strings de data na tela.
- `shared/db/client.ts` aplica `PRAGMA journal_mode = WAL` e `PRAGMA foreign_keys = ON`. Toda
  relação tem FK explícita.
- Migrações são geradas por `pnpm db:generate` e versionadas em `drizzle/`. Nunca edite uma
  migração já aplicada; nunca apague o banco ou dados do usuário para "resolver" schema.
  Correção = nova migração.
- Escritas que tocam mais de uma tabela (parcelas, gastos fixos, importação) rodam em
  transação.
- Consultas usam o query builder do Drizzle ou prepared statements. Nunca interpole valores em
  `execAsync`.
- Ícones e cores são **nomes/tokens**, nunca componentes ou hex solto: registry em
  `shared/domain/icons.ts` e paleta fechada em `shared/domain/colors.ts`. Classes Tailwind
  precisam existir por extenso; se o mapa de classes ficar em `shared/`, inclua `shared/**` no
  `content` do Tailwind.
- Soft delete (`archived_at`) em categorias, contas e cartões. Lançamentos podem ser apagados
  de verdade, com confirmação.
- Seed de categorias/contas padrão só quando as tabelas estiverem vazias; nunca sobrescreva
  dados do usuário.
- `app/_layout.tsx` só renderiza as telas após as migrações concluírem; erro de banco tem tela
  própria com retry.
- **Web não é alvo.** `expo-sqlite` no browser é alpha e exige WASM + headers COOP/COEP. Não
  adicione suporte web sem decisão explícita.
- **Backup/export/import está fora do escopo por enquanto.** Não implemente sem spec.

### Componentes

- Reutilize `AppText`, `AppButton` e `Card` antes de criar novos primitivos.
- `AppText` sempre renderiza `Text` dentro de um `View` com `flex-row`: ele aceita `icon`
  (elemento lucide) e `className`. Para layout que não deve ser `flex-row`, use `Text` direto
  ou componha dentro de um `View` próprio.
- `AppButton` tem variantes `primary`, `secondary` e `dark`; use `variant` em vez de recriar
  classes de botão.
- `Card` já aplica `rounded-[24px] bg-neutral-800 p-2`; sobrescreva via `className` + `twMerge`.
- Props e tipos: `type Props = { ... }` e funções exportadas nomeadas (`export function X`).
  Páginas default export.
- Ícones: `import { Eye } from "lucide-react-native"` e passe `color={colors.*}` / `size`.

### Datas

- Use os helpers de `shared/utils/dateUtils.ts` (`getDateOnly`, `newDateFromString`,
  `stringToDateString`, `getMonthString`, ...) em vez de formatar datas na tela.
- `Month` é um union type em pt-BR; o calendário depende do locale registrado em
  `shared/config/calendarsLocale.ts` (importado no root layout). Não registre locale em telas.
- Cuidado com `new Date("YYYY-MM-DD")` (interpretado como UTC): para datas locais use
  `newDateFromString`.
- Mês de referência (`YYYY-MM`) também sai de helper; não concatene ano/mês na mão. O mês de
  fatura vem de `shared/domain/invoice.ts`, nunca de cálculo na tela.

### Idioma e texto de UI

- Textos de interface, mensagens, labels e nomes de meses: **pt-BR** (com acentuação correta).
- Identificadores, tipos, nomes de arquivos, commits e comentários técnicos: **inglês**.
- Formatação de moeda/hora: siga o padrão exibido (`R$ 8.450,00`).

### Formatação e lint

Prettier: 2 espaços, aspas duplas, ponto e vírgula, vírgula final, 100 colunas, plugin
`prettier-plugin-tailwindcss` (ordena classes em `className`, `twMerge`, `cn`, `clsx`). Não
reordene classes à mão — rode `pnpm format`. ESLint: flat config com `eslint-config-expo` +
`eslint-plugin-prettier`; erro de Prettier quebra o lint.

## Estado atual / dívidas conhecidas

- Implementadas: **Resumo**, **Lançamentos** e **Sobre** (rotas em `app/(tabs)/`). Orçamento,
  Gastos fixos, Categorias, Contas, Cartões e Lançamentos de cartão ainda não existem (ver
  `SPEC.md`).
- **Persistência**: implementada de ponta a ponta (`expo-sqlite` + Drizzle 0.45 + `drizzle-kit`).
  Schema completo em `shared/db/schema.ts`, migração versionada em `drizzle/`, boot que roda as
  migrações e o seed antes de renderizar as telas em `app/_layout.tsx`. PKs são `TEXT` UUID
  (geradas nos repositórios), todas as tabelas têm `created_at`/`updated_at` e o seed cria
  categorias/contas padrão somente quando as tabelas estão vazias. **Resumo** e **Lançamentos**
  já leem do banco via `useLiveQuery` (queries em `shared/db/queries`, hooks em `shared/hooks`) e
  gravam pelos repositórios. Faltam os testes da camada de dados.
- Sem backend, autenticação, testes ou CI. Não há suíte configurada — ao criar uma, use
  `jest-expo`/`better-sqlite3` com scripts próprios.
- Backup/export/import está adiado; web não é alvo. Ambas as decisões estão na seção de
  persistência e não devem ser antecipadas sem spec.
- `app/(tabs)/sobre.tsx` é placeholder com `Text`/`View` puros.
- `components/MonthPicker.tsx` tem um `console.log("oi")` em `useEffect` e um `useEffect`
  redundante apenas para `currentDate` — remover ao mexer nesse arquivo.
- `app/_layout.tsx` chama `setColorScheme` durante o render; ao refatorar, mover para
  `useEffect`.
- `app.json` declara `userInterfaceStyle: "light"`; ajustar quando o tema claro for suportado
  de fato.
- Imports são relativos (`../../components/...`). Não há alias configurado; se adicionar,
  configure em `tsconfig.json` **e** no `babel.config.js`/Metro.
- `pnpm-lock.yaml` está no `.gitignore` apesar de existir no disco — não altere essa decisão
  sem confirmar.

## Checklist antes de abrir PR

1. `pnpm typecheck` sem erros.
2. `pnpm lint` sem erros (Prettier incluso).
3. Classes novas existem no `tailwind.config.js`/`global.css` e foram escritas por extenso.
4. Cores novas atualizadas nos dois lugares (`global.css` + `nativeWindUtils.ts`).
5. Tela nova registrada no layout de tabs e acessível.
6. Nada de gráfico, dark mode preservado, textos em pt-BR.
7. Migração criada com `pnpm db:generate` quando o schema mudou, e o app sobe em banco vazio.
8. Nenhum SQL em tela/componente e nenhuma transação/agregado guardado no Zustand.
9. Valores em centavos e datas/mês de referência via helpers (`dateUtils` ou `shared/domain`).
10. Testes da camada de dados (`shared/domain` e repositórios) atualizados e verdes.
11. `shared/**` incluído no `content` do Tailwind quando houver classes fora de `app/` e
    `components/`.
