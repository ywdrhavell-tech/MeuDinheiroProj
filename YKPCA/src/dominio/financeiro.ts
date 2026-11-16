import type { EstadoFinanceiro, Lancamento, MetaFinanceira } from '../tipos'

export function calcularResumo(estado: EstadoFinanceiro) {
  const receitas = estado.lancamentos.filter(x => x.tipo === 'receita').reduce((s, x) => s + x.valorCentavos, 0)
  const despesas = estado.lancamentos.filter(x => x.tipo === 'despesa').reduce((s, x) => s + x.valorCentavos, 0)
  return { receitas, despesas, saldo: estado.saldoInicialCentavos + receitas - despesas }
}
export function validarLancamento(item: Omit<Lancamento, 'id'>): string[] {
  const erros: string[] = []
  if (item.descricao.trim().length < 3) erros.push('A descrição deve ter pelo menos 3 caracteres.')
  if (!Number.isInteger(item.valorCentavos) || item.valorCentavos <= 0) erros.push('O valor deve ser maior que zero.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.data)) erros.push('Informe uma data válida.')
  if (item.data > new Date().toISOString().slice(0, 10)) erros.push('A data não pode ser futura.')
  return erros
}
export function validarMeta(meta: Omit<MetaFinanceira, 'id'>): string[] {
  const erros: string[] = []
  if (meta.nome.trim().length < 3) erros.push('O nome da meta deve ter pelo menos 3 caracteres.')
  if (!Number.isInteger(meta.valorAlvoCentavos) || meta.valorAlvoCentavos <= 0) erros.push('O valor desejado deve ser maior que zero.')
  if (!Number.isInteger(meta.valorGuardadoCentavos) || meta.valorGuardadoCentavos < 0) erros.push('O valor guardado não pode ser negativo.')
  if (meta.valorGuardadoCentavos > meta.valorAlvoCentavos) erros.push('O valor guardado não pode superar o valor da meta.')
  return erros
}
export function calcularProgresso(meta: MetaFinanceira): number {
  if (meta.valorAlvoCentavos <= 0) return 0
  return Math.min(100, Math.round(meta.valorGuardadoCentavos / meta.valorAlvoCentavos * 100))
}
export function despesasPorCategoria(lancamentos: Lancamento[]) {
  return lancamentos.filter(x => x.tipo === 'despesa').reduce<Record<string, number>>((acc, x) => {
    acc[x.categoria] = (acc[x.categoria] ?? 0) + x.valorCentavos
    return acc
  }, {})
}
export function resumoMensal(lancamentos: Lancamento[], ano: number) {
  return Array.from({ length: 12 }, (_, mes) => {
    const doMes = lancamentos.filter(x => {
      const d = new Date(`${x.data}T12:00:00`)
      return d.getFullYear() === ano && d.getMonth() === mes
    })
    return {
      mes,
      receitas: doMes.filter(x => x.tipo === 'receita').reduce((s, x) => s + x.valorCentavos, 0),
      despesas: doMes.filter(x => x.tipo === 'despesa').reduce((s, x) => s + x.valorCentavos, 0)
    }
  })
}
export function adicionarValorMeta(meta: MetaFinanceira, valorCentavos: number): MetaFinanceira {
  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) return meta
  return { ...meta, valorGuardadoCentavos: Math.min(meta.valorAlvoCentavos, meta.valorGuardadoCentavos + valorCentavos) }
}
export function filtrarLancamentos(lancamentos: Lancamento[], busca: string, tipo: string): Lancamento[] {
  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  return lancamentos.filter(x => (tipo === 'todos' || x.tipo === tipo) &&
    `${x.descricao} ${x.categoria} ${x.observacao}`.toLocaleLowerCase('pt-BR').includes(termo))
    .sort((a, b) => b.data.localeCompare(a.data))
}
