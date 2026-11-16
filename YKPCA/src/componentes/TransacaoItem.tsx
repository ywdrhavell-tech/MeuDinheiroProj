import type { Lancamento } from '../tipos'
import { Link } from 'react-router-dom'
export interface TransacaoItemProps { item:Lancamento; onDelete?:(id:string)=>void }
export function TransacaoItem({item,onDelete}:TransacaoItemProps) {
 return <div className="transaction-row"><div className={`tx-icon ${item.tipo}`}>{item.tipo==='receita'?'↗':'↘'}</div><div className="tx-info"><strong>{item.descricao}</strong><small>{item.categoria} · {new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR')}</small></div><b className={`tx-value ${item.tipo}`}>{item.tipo==='receita'?'+':'−'} {(item.valorCentavos/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</b><Link className="icon-link" to={`/lancamentos/${item.id}`} aria-label={`Ver ${item.descricao}`}>↗</Link>{onDelete&&<button className="icon-link" onClick={()=>onDelete(item.id)} aria-label={`Excluir ${item.descricao}`}>×</button>}</div>
}
