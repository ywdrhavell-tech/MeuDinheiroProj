import { describe, it, expect } from 'vitest'
import { calcularResumo, validarLancamento, validarMeta, calcularProgresso, despesasPorCategoria, resumoMensal, adicionarValorMeta, filtrarLancamentos } from './financeiro'
import type { Lancamento, MetaFinanceira } from '../tipos'
const base: Lancamento = { id:'1', descricao:'Mercado', tipo:'despesa', categoria:'Alimentação', valorCentavos:15000, data:'2026-11-01', observacao:'' }
const meta: MetaFinanceira = { id:'m1', nome:'Viagem', valorAlvoCentavos:100000, valorGuardadoCentavos:25000, prazo:'2027-05-01', icone:'✈️' }
describe('regras financeiras', () => {
  it('calcula saldo inicial mais receitas menos despesas', () => expect(calcularResumo({saldoInicialCentavos:50000,lancamentos:[base,{...base,id:'2',tipo:'receita',valorCentavos:80000}],metas:[] })).toEqual({receitas:80000,despesas:15000,saldo:115000}))
  it('recusa descrição curta', () => expect(validarLancamento({...base,descricao:'oi'})).toContain('A descrição deve ter pelo menos 3 caracteres.'))
  it('recusa valor zero', () => expect(validarLancamento({...base,valorCentavos:0})).toContain('O valor deve ser maior que zero.'))
  it('recusa data futura', () => expect(validarLancamento({...base,data:'2999-01-01'})).toContain('A data não pode ser futura.'))
  it('aceita lançamento válido', () => expect(validarLancamento(base)).toEqual([]))
  it('valida nome e valor da meta', () => expect(validarMeta({...meta,nome:'x',valorAlvoCentavos:0}).length).toBe(2))
  it('calcula progresso percentual', () => expect(calcularProgresso(meta)).toBe(25))
  it('limita progresso a 100%', () => expect(calcularProgresso({...meta,valorGuardadoCentavos:150000})).toBe(100))
  it('agrupa despesas por categoria', () => expect(despesasPorCategoria([base,{...base,id:'2',categoria:'Lazer',valorCentavos:5000}])).toEqual({'Alimentação':15000,'Lazer':5000}))
  it('agrupa receitas e despesas por mês', () => expect(resumoMensal([base,{...base,id:'2',tipo:'receita',valorCentavos:30000}],2026)[10]).toEqual({mes:10,receitas:30000,despesas:15000}))
  it('adiciona valor sem ultrapassar a meta', () => expect(adicionarValorMeta(meta,90000).valorGuardadoCentavos).toBe(100000))
  it('filtra por tipo e termo', () => expect(filtrarLancamentos([base,{...base,id:'2',tipo:'receita',descricao:'Salário'}],'sal','receita').length).toBe(1))
})
