# regras

- não utilizar graficos.
- padrão dark mode.

# telas

- resumo
- orçamento
- lançamentos
- gastos fixos
- categorias
- contas
- cartões
- lançamentos cartão

# comportamentos

## resumo

- vai ser um dashboard com o total de receitas e o total de despesas separados um em cada card
- na tela deve haver um botao flutuante para adicionar uma nova receita ou despesa

## orçamentos

- vai ser uma tela em que pode se planejar o quanto gastar em uma determinada categoria vai listar o gasto realizado na categoria e tabem o quanto ainda pode ser gasto nela
- na tela deve haver um botao flutuante para adicionar um novo orçamento

## lançamentos

- vai ser uma tela onde o usuario pode lançar tanto receita quando despesa
- a tela deve ter
  - valor
  - status (em aberto ou pago)
  - tipo lançamento (despesa ou receita)
  - data vencimento (datepicker)
  - descrição
  - categoria (vai ser cadastrado na tela categoria)
  - conta utilizada
  - observação

## gastos fixos

- vai ser uma tela onde o usuario pode lançar despesas fixas
- a tela deve ter
  - valor
  - status (em aberto ou pago)
  - tipo lançamento (despesa ou receita)
  - dia vencimento
  - descrição
  - categoria (vai ser cadastrado na tela categoria)
  - conta utilizada
  - observação

## categorias

- tela onde o usuario pode criar ou remover categorias de lançamentos
- cada categoria deve ter:
  - icone (selecionavel pelo usuario)
  - nome
  - cor (selecionavel pelo usuario)

## contas

- tela onde o usuario vai criar uma conta para lançar receitas recebidas
- cada conta deve ter
  - nome
  - icone
  - tipo de conta
  - cor
  - incluir na soma total (toggle)

## cartões

- tela onde o usuario vai criar cartões de credito para lançamentos
- na tela exibe um card com cada cartao cadastrado com o limite do cartão e o valor gasto nele
- cada cartao deve conter
  - nome
  - bandeira
  - icone
  - dia do fechamento
  - dia do vencimento
  - cartão principal

## lançamentos cartãoes

- tela onde o usuario vai lançar despesas no cartão
- na tela deve ter os seguintes campos
  - data da compra
  - descricao
  - tipo de despesa
  - um seletor para selecionar qual cartão vai ser a despesa (padrão o cartao principal)
  - qual fatura vai ser lançada a despesa
  - um toggle de parcelado no qual vai abrir uma modal em que vai ter o campo numer de parcelas e o valor de cada parcela
  - um toggle despesa fixa
