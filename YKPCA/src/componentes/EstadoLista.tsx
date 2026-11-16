export interface EstadoListaProps { estado:'carregando'|'erro'|'vazio'; mensagem?:string; onRetry?:()=>void }
export function EstadoLista({estado,mensagem,onRetry}:EstadoListaProps) {
 if(estado==='carregando') return <div className="empty-state" role="status">Carregando informações...</div>
 if(estado==='erro') return <div className="empty-state error-state"><p>{mensagem??'Ocorreu um erro ao carregar os dados.'}</p><button className="btn-secondary" onClick={onRetry}>Tentar de novo</button></div>
 return <div className="empty-state">Nenhum registro encontrado. Comece adicionando uma informação.</div>
}
