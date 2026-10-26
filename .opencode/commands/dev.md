---
description: Implementa uma tarefa com o subagente frontend-dev
agent: frontend-dev
subagent: true
---

Implemente a seguinte tarefa no app Finanças: $ARGUMENTS

Siga `AGENTS.md` e `SPEC.md`, reaproveite `AppText`, `AppButton` e `Card`, use
NativeWind (sem `StyleSheet`/estilo inline) e mantenha o dark mode como padrão.
Ao encerrar, rode `pnpm typecheck`, `pnpm lint` e `pnpm format:check` e reporte
os arquivos alterados, as decisões relevantes e o resultado das verificações.
