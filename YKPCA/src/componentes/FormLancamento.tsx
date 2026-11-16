import { useEffect, useRef, useState } from 'react'
import type { Categoria, Lancamento, TipoMovimentacao } from '../tipos'
import { validarLancamento } from '../dominio/financeiro'

interface Props { inicial?: Lancamento; categorias: Categoria[]; onSave: (item: Omit<Lancamento, 'id'>) => void; onClose: () => void }
const categoriasPadrao: Categoria[] = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Salário', 'Investimentos', 'Outros']

// Converte valores digitados em formato brasileiro ou internacional para centavos.
function valorEmCentavos(entrada: string): number {
  const limpo = entrada.trim().replace(/R\\$|\\s/g, '')
  if (!limpo || !/^[0-9.,]+$/.test(limpo)) return NaN
  const virgula = limpo.lastIndexOf(',')
  const ponto = limpo.lastIndexOf('.')
  let normalizado = limpo
  if (virgula >= 0 && ponto >= 0) {
    const decimal = Math.max(virgula, ponto)
    const inteiro = limpo.slice(0, decimal).replace(/[.,]/g, '')
    const fracao = limpo.slice(decimal + 1).replace(/[.,]/g, '')
    if (!fracao || fracao.length > 2) return NaN
    normalizado = inteiro + '.' + fracao
  } else if (virgula >= 0 || ponto >= 0) {
    const separador = virgula >= 0 ? ',' : '.'
    const partes = limpo.split(separador)
    if (partes.length > 2 || (partes[1] ?? '').length > 2) return NaN
    normalizado = partes[0] + (partes.length === 2 ? '.' + partes[1] : '')
  }
  const numero = Number(normalizado)
  return Number.isFinite(numero) ? Math.round(numero * 100) : NaN
}

export function FormLancamento({ inicial, categorias, onSave, onClose }: Props) {
  const opcoesCategorias = categorias.length ? categorias : categoriasPadrao
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '')
  const [tipo, setTipo] = useState<TipoMovimentacao>(inicial?.tipo ?? 'despesa')
  const [categoria, setCategoria] = useState<Categoria>(inicial?.categoria ?? opcoesCategorias[0])
  const [valor, setValor] = useState(inicial ? (inicial.valorCentavos / 100).toFixed(2) : '')
  const [data, setData] = useState(inicial?.data ?? new Date().toISOString().slice(0, 10))
  const [observacao, setObservacao] = useState(inicial?.observacao ?? '')
  const [erro, setErro] = useState('')
  const descricaoRef = useRef<HTMLInputElement>(null)
  useEffect(() => { descricaoRef.current?.focus() }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const valorCentavos = valorEmCentavos(valor)
    if (!Number.isFinite(valorCentavos) || valorCentavos <= 0) {
      setErro('Informe um valor válido maior que zero. Você pode usar vírgula ou ponto nos centavos, por exemplo: 125,50 ou 125.50.')
      return
    }
    const item = { descricao: descricao.trim(), tipo, categoria, valorCentavos, data, observacao: observacao.trim() }
    const erros = validarLancamento(item)
    if (erros.length) { setErro(erros[0]); if (erros[0].toLowerCase().includes('descrição')) descricaoRef.current?.focus(); return }
    setErro('')
    onSave(item)
  }

  return (
    <section className="panel form-panel">
      <div className="form-intro">
        <span className={'form-icon ' + tipo}>{tipo === 'receita' ? '↗' : '↘'}</span>
        <div><h3>{inicial ? 'Revise as informações' : 'Informações da movimentação'}</h3><p>Preencha os campos abaixo. Os valores serão atualizados no seu resumo financeiro.</p></div>
      </div>
      <form className="transaction-form" onSubmit={submit} noValidate>
        <fieldset className="type-choice"><legend>Tipo de movimentação</legend><div className="segmented">
          <button type="button" className={tipo === 'despesa' ? 'selected expense' : ''} aria-pressed={tipo === 'despesa'} onClick={() => setTipo('despesa')}>↘ Despesa</button>
          <button type="button" className={tipo === 'receita' ? 'selected income' : ''} aria-pressed={tipo === 'receita'} onClick={() => setTipo('receita')}>↗ Receita</button>
        </div></fieldset>
        <label className="form-field">Descrição<input ref={descricaoRef} value={descricao} onChange={e => setDescricao(e.target.value)} required minLength={3} maxLength={80} placeholder="Ex.: Conta de energia" /></label>
        <div className="form-two">
          <label className="form-field">Categoria<select value={categoria} onChange={e => setCategoria(e.target.value as Categoria)}>{opcoesCategorias.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
          <label className="form-field">Valor (R$)<input value={valor} onChange={e => setValor(e.target.value)} inputMode="decimal" placeholder="0,00" required /></label>
        </div>
        <div className="form-two">
          <label className="form-field">Data<input type="date" value={data} onChange={e => setData(e.target.value)} required /></label>
          <label className="form-field">Observação <span className="optional-label">(opcional)</span><input value={observacao} onChange={e => setObservacao(e.target.value)} maxLength={180} placeholder="Adicione um detalhe, se desejar" /></label>
        </div>
        {erro && <p className="field-error" role="alert">{erro}</p>}
        <div className="form-actions"><button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="btn-primary">{inicial ? 'Salvar alterações' : 'Salvar lançamento'}</button></div>
      </form>
    </section>
  )
}