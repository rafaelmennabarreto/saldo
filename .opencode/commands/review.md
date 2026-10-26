---
description: Revisa as mudanças atuais com o subagente code-reviewer (read-only)
agent: code-reviewer
subagent: true
---

Revise as mudanças atuais do projeto: $ARGUMENTS

Se nenhum alvo for informado, comece por `git status --short`, `git diff`,
`git diff --staged` e, se houver base, `git diff <base>...HEAD`. Leia o contexto
ao redor do diff, rode `pnpm typecheck`, `pnpm lint` e `pnpm format:check` e
entregue o relatório ordenado por severidade, separando erros pré-existentes dos
introduzidos pela mudança.
