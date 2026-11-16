import { useEffect, useRef, useState } from 'react'
import type { Categoria, Lancamento, TipoMovimentacao } from '../tipos'
import { validarLancamento } from '../dominio/financeiro'
import { Modal } from './Modal'
interface Props { inicial?:Lancamento; categorias:Categoria[]; onSave:(item:Omit<Lancamento,'id'>)=>void; onClose:()=>void }
export function FormLancamento({inicial,categorias,onSave,onClose}:Props) {
 const [descricao,setDescricao]=useState(inicial?.descricao??'')
 const [tipo,setTipo]=useState<TipoMovimentacao>(inicial?.tipo??'despesa')
 const [categoria,setCategoria]=useState<Categoria>(inicial?.categoria??categorias[0]??'Outros')
 const [valor,setValor]=useState(inicial?(inicial.valorCentavos/100).toFixed(2):'')
 const [data,setData]=useState(inicial?.data??new Date().toISOString().slice(0,10))
 const [observacao,setObservacao]=useState(inicial?.observacao??'')
 const [erro,setErro]=useState('')
 const descricaoRef=useRef<HTMLInputElement>(null)
 useEffect(()=>{descricaoRef.current?.focus()},[])
 function submit(e:React.FormEvent) {
  e.preventDefault()
  const item={descricao,tipo,categoria,valorCentavos:Math.round(Number(valor.replace(',','.'))*100),data,observacao}
  const erros=validarLancamento(item)
  if(erros.length){setErro(erros[0]);if(erros[0].includes('descrição'))descricaoRef.current?.focus();return}
  setErro('');onSave(item)
 }
 return <Modal titulo={inicial?'Editar lançamento':'Novo lançamento'} onClose={onClose}><form onSubmit={submit} noValidate>
  <div className="segmented"><button type="button" className={tipo==='despesa'?'selected':''} onClick={()=>setTipo('despesa')}>Despesa</button><button type="button" className={tipo==='receita'?'selected':''} onClick={()=>setTipo('receita')}>Receita</button></div>
  <label>Descrição<input ref={descricaoRef} value={descricao} onChange={e=>setDescricao(e.target.value)} required minLength={3} placeholder="Ex.: Conta de energia"/></label>
  <label>Categoria<select value={categoria} onChange={e=>setCategoria(e.target.value as Categoria)}>{categorias.map(c=><option key={c}>{c}</option>)}</select></label>
  <div className="form-two"><label>Valor (R$)<input value={valor} onChange={e=>setValor(e.target.value)} inputMode="decimal" placeholder="0,00" required/></label><label>Data<input type="date" value={data} onChange={e=>setData(e.target.value)} required/></label></div>
  <label>Observação (opcional)<textarea value={observacao} onChange={e=>setObservacao(e.target.value)} rows={2}/></label>
  {erro&&<p className="field-error" role="alert">{erro}</p>}
  <div className="modal-actions"><button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button><button className="btn-primary">Salvar lançamento</button></div>
 </form></Modal>
}
