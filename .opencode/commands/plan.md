---
description: Entrevista o usuário e produz um plano antes de implementar
---

Antes de escrever qualquer código, faça um planejamento da tarefa: $ARGUMENTS

## Etapas

1. Leia `AGENTS.md` e `SPEC.md`. Inspecione o código relacionado em `app/`, `components/`,
   `shared/` e `store/` para saber o que já existe e pode ser reutilizado.
2. Liste o que está ambíguo ou indefinido: escopo, campos, navegação, estado, dados mockados,
   reuso de componentes, textos de UI e critério de aceite.
3. Pergunte ao usuário com a ferramenta `question`, em rodadas de no máximo 4 perguntas, cada
   uma com opções concretas e uma recomendação. Priorize o que muda arquitetura ou escopo.
   Não pergunte o que já está no `SPEC.md` ou no `AGENTS.md`.
4. Repita até não restar decisão aberta. Nada de implementar antes das respostas.
5. Entregue o plano com: objetivo, escopo (dentro/fora), telas e arquivos afetados,
   componentes reutilizados, formato do estado no Zustand, dados mockados, riscos, critério de
   aceite e ordem de execução.
6. Pergunte se o plano deve ser salvo em `docs/plans/<slug>.md`; só grave após confirmação.

## Regras

- Não edite código neste comando; o produto aqui é o plano.
- Se a tarefa já estiver totalmente especificada, diga isso e vá direto ao plano.
- Se houver design no Figma (imagens em `design/` ou MCP `figma`), use como fonte para as
  perguntas e para o mapeamento de tokens de cor/espaçamento.
