import type { MetaFinanceira } from '../tipos'
import { calcularProgresso } from '../dominio/financeiro'
export interface MetaCardProps { meta:MetaFinanceira; onAdd:(meta:MetaFinanceira)=>void; onEdit:(meta:MetaFinanceira)=>void; onDelete:(id:string)=>void }
const dinheiro=(n:number)=> (n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export function MetaCard({meta,onAdd,onEdit,onDelete}:MetaCardProps) {
 const pct=calcularProgresso(meta)
 return <article className="goal-card"><div className="goal-top"><span className="goal-icon">{meta.icone}</span><div className="goal-name"><strong>{meta.nome}</strong><small>Prazo: {meta.prazo?new Date(`${meta.prazo}T12:00:00`).toLocaleDateString('pt-BR'):'Não definido'}</small></div><b>{pct}%</b></div><div className="progress"><span style={{width:`${pct}%`}}/></div><div className="goal-foot"><span>{dinheiro(meta.valorGuardadoCentavos)} guardados</span><span>Meta: {dinheiro(meta.valorAlvoCentavos)}</span></div><div className="goal-actions"><button onClick={()=>onAdd(meta)}>＋ Guardar</button><button onClick={()=>onEdit(meta)}>Editar</button><button className="danger-text" onClick={()=>onDelete(meta.id)}>Excluir</button></div></article>
}
