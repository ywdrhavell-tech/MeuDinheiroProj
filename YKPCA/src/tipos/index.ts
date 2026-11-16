export type TipoMovimentacao = 'receita' | 'despesa'
export type Categoria = 'Alimentação' | 'Moradia' | 'Transporte' | 'Lazer' | 'Saúde' | 'Educação' | 'Salário' | 'Investimentos' | 'Outros'
export interface Lancamento {
  id: string
  descricao: string
  tipo: TipoMovimentacao
  categoria: Categoria
  valorCentavos: number
  data: string
  observacao: string
}
export interface MetaFinanceira {
  id: string
  nome: string
  valorAlvoCentavos: number
  valorGuardadoCentavos: number
  prazo: string
  icone: string
}
export interface EstadoFinanceiro {
  saldoInicialCentavos: number
  lancamentos: Lancamento[]
  metas: MetaFinanceira[]
}
export interface ErroValidacao { campo: string; mensagem: string }
