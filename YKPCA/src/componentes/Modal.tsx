import type { ReactNode } from 'react'
export interface ModalProps { titulo:string; children:ReactNode; onClose:()=>void }
export function Modal({titulo,children,onClose}:ModalProps) {
 return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><h2 id="modal-title">{titulo}</h2><button className="close" onClick={onClose} aria-label="Fechar">×</button></div>{children}</section></div>
}
