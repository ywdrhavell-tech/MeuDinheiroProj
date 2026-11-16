import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { EstadoFinanceiro, Lancamento, MetaFinanceira } from '../tipos'

const CHAVE = 'meudinheiro_react_v1'
const inicial: EstadoFinanceiro = { saldoInicialCentavos: 0, lancamentos: [], metas: [] }
function lerEstado(): EstadoFinanceiro {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return inicial
    const dado: unknown = JSON.parse(bruto)
    if (typeof dado !== 'object' || dado === null) return inicial
    const obj = dado as Partial<EstadoFinanceiro>
    return {
      saldoInicialCentavos: Number.isInteger(obj.saldoInicialCentavos) ? obj.saldoInicialCentavos as number : 0,
      lancamentos: Array.isArray(obj.lancamentos) ? obj.lancamentos : [],
      metas: Array.isArray(obj.metas) ? obj.metas : []
    }
  } catch { return inicial }
}
interface FinanceContextValue {
  estado: EstadoFinanceiro
  adicionarLancamento: (item: Lancamento) => void
  atualizarLancamento: (item: Lancamento) => void
  excluirLancamento: (id: string) => void
  adicionarMeta: (meta: MetaFinanceira) => void
  atualizarMeta: (meta: MetaFinanceira) => void
  excluirMeta: (id: string) => void
  definirSaldoInicial: (valor: number) => void
}
const FinanceContext = createContext<FinanceContextValue | null>(null)
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoFinanceiro>(lerEstado)
  useEffect(() => { localStorage.setItem(CHAVE, JSON.stringify(estado)) }, [estado])
  const valor = useMemo<FinanceContextValue>(() => ({
    estado,
    adicionarLancamento: item => setEstado(s => ({...s,lancamentos:[item,...s.lancamentos]})),
    atualizarLancamento: item => setEstado(s => ({...s,lancamentos:s.lancamentos.map(x => x.id === item.id ? item : x)})),
    excluirLancamento: id => setEstado(s => ({...s,lancamentos:s.lancamentos.filter(x => x.id !== id)})),
    adicionarMeta: meta => setEstado(s => ({...s,metas:[meta,...s.metas]})),
    atualizarMeta: meta => setEstado(s => ({...s,metas:s.metas.map(x => x.id === meta.id ? meta : x)})),
    excluirMeta: id => setEstado(s => ({...s,metas:s.metas.filter(x => x.id !== id)})),
    definirSaldoInicial: saldoInicialCentavos => setEstado(s => ({...s,saldoInicialCentavos}))
  }), [estado])
  return <FinanceContext.Provider value={valor}>{children}</FinanceContext.Provider>
}
export function useFinanceiro() {
  const contexto = useContext(FinanceContext)
  if (!contexto) throw new Error('useFinanceiro deve ser usado dentro de FinanceProvider')
  return contexto
}
