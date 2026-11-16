import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFinanceiro } from '../contexto/FinanceContext'
import { calcularResumo, despesasPorCategoria, filtrarLancamentos, resumoMensal, validarMeta, adicionarValorMeta } from '../dominio/financeiro'
import type { Categoria, MetaFinanceira } from '../tipos'
import { buscarCategorias } from '../servicos/categorias'
import { getUsuarioAtual, getUsuarios, limparUsuarioAtual, salvarUsuarioAtual, salvarUsuarios, type Usuario } from '../servicos/auth'
import { PageTitle } from '../componentes/Layout'
import { ResumoCard } from '../componentes/ResumoCard'
import { TransacaoItem } from '../componentes/TransacaoItem'
import { MetaCard } from '../componentes/MetaCard'
import { Modal } from '../componentes/Modal'
import { EstadoLista } from '../componentes/EstadoLista'
import { GraficoBarras } from '../componentes/GraficoBarras'
import { FormLancamento } from '../componentes/FormLancamento'

const moeda=(n:number)=>(n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
const id=()=>crypto.randomUUID()

function AuthCard({ titulo, subtitulo, children, footer }: { titulo?: string; subtitulo?: string; children: React.ReactNode; footer?: React.ReactNode }) {
 return (
  <div className="auth-page">
   <div className="auth-card">
    <div className="auth-brand">
     <div className="auth-logo" aria-hidden="true">🐷</div>
     <h1>MeuDinheiro</h1>
    </div>

    {subtitulo && <p className="auth-subtitle">{subtitulo}</p>}
    {titulo && <h2 className="auth-title">{titulo}</h2>}

    {children}

    {footer && <div className="auth-footer">{footer}</div>}
   </div>
  </div>
 )
}

export function Login() {
 const navigate = useNavigate()
 const [email, setEmail] = useState('')
 const [senha, setSenha] = useState('')
 const [erro, setErro] = useState('')

 useEffect(() => {
   if (getUsuarioAtual()) {
     navigate('/', { replace: true })
   }
 }, [navigate])

 function entrar(e: React.FormEvent) {
   e.preventDefault()
   const usuarios = getUsuarios()
   const usuario = usuarios.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.senha === senha)

   if (!usuario) {
     setErro('E-mail ou senha incorretos.')
     return
   }

   salvarUsuarioAtual(usuario)
   navigate('/', { replace: true })
 }

 return (
  <AuthCard
   subtitulo="Mais controle para o seu futuro financeiro."
   footer={<p>Organize suas finanças, conquiste seus objetivos!</p>}
  >
   <form className="auth-form" onSubmit={entrar}>
    <div className="auth-field">
     <label htmlFor="login-email">E-mail</label>
     <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="exemplo@gmail.com" />
    </div>

    <div className="auth-field">
     <label htmlFor="login-senha">Senha</label>
     <input id="login-senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Sua senha" />
    </div>

    {erro && <p className="auth-error">{erro}</p>}

    <button type="submit" className="auth-button auth-button-primary">Entrar</button>
    <button type="button" className="auth-button auth-button-secondary" onClick={() => navigate('/cadastro')}>Criar conta</button>
   </form>
  </AuthCard>
 )
}

export function Cadastro() {
 const navigate = useNavigate()
 const [nome, setNome] = useState('')
 const [email, setEmail] = useState('')
 const [telefone, setTelefone] = useState('')
 const [senha, setSenha] = useState('')
 const [confirmarSenha, setConfirmarSenha] = useState('')
 const [erro, setErro] = useState('')

 useEffect(() => {
   if (getUsuarioAtual()) {
     navigate('/', { replace: true })
   }
 }, [navigate])

 function cadastrar(e: React.FormEvent) {
   e.preventDefault()

   if (!nome.trim() || !email.trim() || !telefone.trim()) {
     setErro('Preencha nome, e-mail e telefone.')
     return
   }

   if (senha.length < 6) {
     setErro('A senha deve ter pelo menos 6 caracteres.')
     return
   }

   if (senha !== confirmarSenha) {
     setErro('As senhas não conferem.')
     return
   }

   const usuarios = getUsuarios()
   const jaExiste = usuarios.some(item => item.email.toLowerCase() === email.trim().toLowerCase())
   if (jaExiste) {
     setErro('Este e-mail já está cadastrado.')
     return
   }

   const usuario: Usuario = {
     nome: nome.trim(),
     email: email.trim().toLowerCase(),
     telefone: telefone.trim(),
     senha,
   }

   salvarUsuarios([...usuarios, usuario])
   salvarUsuarioAtual(usuario)
   navigate('/', { replace: true })
 }

 return (
  <AuthCard
   subtitulo="Mais controle para o seu futuro financeiro."
   titulo="Criar conta"
   footer={<p>Já tem uma conta? <Link to="/login">Entrar</Link></p>}
  >
   <form className="auth-form auth-form-register" onSubmit={cadastrar}>
    <div className="auth-field">
     <label htmlFor="cadastro-nome">Nome completo</label>
     <input id="cadastro-nome" type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
    </div>

    <div className="auth-field">
     <label htmlFor="cadastro-email">E-mail</label>
     <input id="cadastro-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="exemplo@gmail.com" />
    </div>

    <div className="auth-field">
     <label htmlFor="cadastro-telefone">Telefone</label>
     <input id="cadastro-telefone" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
    </div>

    <div className="auth-field">
     <label htmlFor="cadastro-senha">Senha</label>
     <input id="cadastro-senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Mínimo de 6 caracteres" />
    </div>

    <div className="auth-field">
     <label htmlFor="cadastro-confirmar">Confirmar senha</label>
     <input id="cadastro-confirmar" type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="Repita sua senha" />
    </div>

    {erro && <p className="auth-error">{erro}</p>}

    <button type="submit" className="auth-button auth-button-primary">Cadastrar</button>
   </form>
  </AuthCard>
 )
}

export function Inicio() {
 const {estado}=useFinanceiro()
 const resumo=calcularResumo(estado)
 const recentes=[...estado.lancamentos].sort((a,b)=>b.data.localeCompare(a.data)).slice(0,5)
 return <><PageTitle title="Olá! 👋" description="Acompanhe sua vida financeira de um jeito simples." action={<Link className="btn-primary" to="/lancamentos/novo">＋ Novo lançamento</Link>}/><div className="summary-grid"><ResumoCard label="SALDO ATUAL" valor={moeda(resumo.saldo)} tipo="saldo" detalhe="Saldo inicial + receitas − despesas"/><ResumoCard label="RECEITAS" valor={moeda(resumo.receitas)} tipo="receita" detalhe="Entradas registradas"/><ResumoCard label="DESPESAS" valor={moeda(resumo.despesas)} tipo="despesa" detalhe="Saídas registradas"/></div><div className="content-grid"><section className="panel"><div className="panel-head"><div><h3>Últimos lançamentos</h3><p>Movimentações recentes da sua conta</p></div><Link to="/lancamentos">Ver todos →</Link></div>{recentes.length?recentes.map(x=><TransacaoItem key={x.id} item={x}/>):<EstadoLista estado="vazio"/>}</section><section className="panel"><div className="panel-head"><div><h3>Metas financeiras</h3><p>Continue avançando nos seus planos</p></div><Link to="/metas">Ver todas →</Link></div>{estado.metas.length?estado.metas.slice(0,3).map(m=><div className="mini-goal" key={m.id}><span>{m.icone}</span><div><b>{m.nome}</b><small>{moeda(m.valorGuardadoCentavos)} de {moeda(m.valorAlvoCentavos)}</small></div></div>):<EstadoLista estado="vazio" mensagem="Você ainda não criou metas."/>}</section></div></>
}
export function Lancamentos() {
 const {estado,excluirLancamento}=useFinanceiro()
 const [busca,setBusca]=useState('');const [tipo,setTipo]=useState('todos')
 const lista=useMemo(()=>filtrarLancamentos(estado.lancamentos,busca,tipo),[estado.lancamentos,busca,tipo])
 return <><PageTitle title="Lançamentos" description="Registre e acompanhe tudo o que entra e sai." action={<Link className="btn-primary" to="/lancamentos/novo">＋ Adicionar lançamento</Link>}/><section className="panel"><div className="filter-row"><input aria-label="Buscar lançamento" placeholder="Buscar por descrição ou categoria..." value={busca} onChange={e=>setBusca(e.target.value)}/><select aria-label="Filtrar tipo" value={tipo} onChange={e=>setTipo(e.target.value)}><option value="todos">Todos os tipos</option><option value="receita">Receitas</option><option value="despesa">Despesas</option></select></div>{lista.length?lista.map(x=><TransacaoItem key={x.id} item={x} onDelete={excluirLancamento}/>):<EstadoLista estado="vazio"/>}</section></>
}
export function NovoLancamento() {
 const {adicionarLancamento}=useFinanceiro();const nav=useNavigate()
 const [categorias,setCategorias]=useState<Categoria[]>([]);const [status,setStatus]=useState<'carregando'|'erro'|'pronto'>('carregando');const [tentativa,setTentativa]=useState(0)
 useEffect(()=>{let ativo=true;buscarCategorias().then(d=>{if(ativo){setCategorias(d);setStatus('pronto')}}).catch(()=>{if(ativo)setStatus('erro')});return()=>{ativo=false}},[tentativa])
 if(status==='carregando')return <EstadoLista estado="carregando"/>
 if(status==='erro')return <EstadoLista estado="erro" mensagem="Não foi possível carregar as categorias." onRetry={()=>setTentativa(x=>x+1)}/>
 return <><PageTitle title="Novo lançamento" description="Preencha os dados da movimentação."/><FormLancamento categorias={categorias} onClose={()=>nav('/lancamentos')} onSave={item=>{adicionarLancamento({...item,id:id()});nav('/lancamentos')}}/></>
}
export function DetalheLancamento() {
 const {id:param}=useParams();const {estado,excluirLancamento}=useFinanceiro();const nav=useNavigate()
 const item=estado.lancamentos.find(x=>x.id===param)
 if(!item)return <section className="panel"><h2>Lançamento não encontrado</h2><Link to="/lancamentos">Voltar aos lançamentos</Link></section>
 return <><PageTitle title="Detalhes do lançamento" description="Confira as informações registradas."/><section className="panel detail-panel"><span className={`pill ${item.tipo}`}>{item.tipo}</span><h2>{item.descricao}</h2><strong className="detail-value">{moeda(item.valorCentavos)}</strong><p><b>Categoria:</b> {item.categoria}</p><p><b>Data:</b> {new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR')}</p><p><b>Observação:</b> {item.observacao||'Nenhuma'}</p><div className="modal-actions"><Link className="btn-secondary" to={`/lancamentos/${item.id}/editar`}>Editar</Link><button className="btn-danger" onClick={()=>{if(confirm('Excluir este lançamento?')){excluirLancamento(item.id);nav('/lancamentos')}}}>Excluir</button></div></section></>
}
export function EditarLancamento() {
 const {id:param}=useParams();const {estado,atualizarLancamento}=useFinanceiro();const nav=useNavigate()
 const item=estado.lancamentos.find(x=>x.id===param);const [categorias,setCategorias]=useState<Categoria[]>([])
 useEffect(()=>{buscarCategorias().then(setCategorias).catch(()=>setCategorias(['Alimentação','Moradia','Transporte','Lazer','Saúde','Educação','Salário','Investimentos','Outros']))},[])
 if(!item)return <section className="panel"><h2>Lançamento não encontrado</h2><Link to="/lancamentos">Voltar</Link></section>
 return <><PageTitle title="Editar lançamento" description="Atualize os dados da movimentação."/><FormLancamento inicial={item} categorias={categorias} onClose={()=>nav(`/lancamentos/${item.id}`)} onSave={dados=>{atualizarLancamento({...dados,id:item.id});nav(`/lancamentos/${item.id}`)}}/></>
}
export function Metas() {
 const {estado,adicionarMeta,atualizarMeta,excluirMeta}=useFinanceiro()
 const [aberta,setAberta]=useState(false);const [editando,setEditando]=useState<MetaFinanceira|null>(null);const [nome,setNome]=useState('');const [alvo,setAlvo]=useState('');const [guardado,setGuardado]=useState('0');const [prazo,setPrazo]=useState('');const [icone,setIcone]=useState('🎯');const [erro,setErro]=useState('')
 function abrir(meta?:MetaFinanceira){setEditando(meta??null);setNome(meta?.nome??'');setAlvo(meta?(meta.valorAlvoCentavos/100).toFixed(2):'');setGuardado(meta?(meta.valorGuardadoCentavos/100).toFixed(2):'0');setPrazo(meta?.prazo??'');setIcone(meta?.icone??'🎯');setErro('');setAberta(true)}
 function salvar(e:React.FormEvent){e.preventDefault();const dados={nome,valorAlvoCentavos:Math.round(Number(alvo.replace(',','.'))*100),valorGuardadoCentavos:Math.round(Number(guardado.replace(',','.'))*100),prazo,icone};const erros=validarMeta(dados);if(erros.length){setErro(erros[0]);return}if(editando)atualizarMeta({...dados,id:editando.id});else adicionarMeta({...dados,id:id()});setAberta(false)}
 function guardar(meta:MetaFinanceira){const raw=prompt('Quanto deseja guardar? (R$)');if(raw===null)return;const cents=Math.round(Number(raw.replace(',','.'))*100);if(cents>0)atualizarMeta(adicionarValorMeta(meta,cents));else alert('Informe um valor maior que zero.')}
 return <><PageTitle title="Metas financeiras" description="Defina objetivos e acompanhe cada conquista." action={<button className="btn-primary" onClick={()=>abrir()}>＋ Nova meta</button>}/>{estado.metas.length?<div className="goal-grid">{estado.metas.map(m=><MetaCard key={m.id} meta={m} onAdd={guardar} onEdit={abrir} onDelete={x=>{if(confirm('Excluir esta meta?'))excluirMeta(x)}}/>)}</div>:<section className="panel"><EstadoLista estado="vazio" mensagem="Crie sua primeira meta financeira e acompanhe seu progresso."/></section>}{aberta&&<Modal titulo={editando?'Editar meta':'Criar nova meta'} onClose={()=>setAberta(false)}><form onSubmit={salvar}><label>Nome da meta<input value={nome} onChange={e=>setNome(e.target.value)} required minLength={3}/></label><div className="form-two"><label>Valor desejado (R$)<input value={alvo} onChange={e=>setAlvo(e.target.value)} required inputMode="decimal"/></label><label>Já guardado (R$)<input value={guardado} onChange={e=>setGuardado(e.target.value)} inputMode="decimal"/></label></div><label>Prazo (opcional)<input type="date" value={prazo} onChange={e=>setPrazo(e.target.value)}/></label><label>Ícone<select value={icone} onChange={e=>setIcone(e.target.value)}><option>🎯</option><option>🏡</option><option>🚗</option><option>✈️</option><option>🎓</option><option>💰</option></select></label>{erro&&<p className="field-error">{erro}</p>}<div className="modal-actions"><button type="button" className="btn-secondary" onClick={()=>setAberta(false)}>Cancelar</button><button className="btn-primary">Salvar meta</button></div></form></Modal>}</>
}
export function Graficos() {
 const {estado}=useFinanceiro();const [ano,setAno]=useState(new Date().getFullYear())
 const cats=despesasPorCategoria(estado.lancamentos);const meses=resumoMensal(estado.lancamentos,ano);const nomes=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
 const total=Object.values(cats).reduce((a,b)=>a+b,0)
 return <><PageTitle title="Relatórios e gráficos" description="Entenda para onde seu dinheiro está indo."/><div className="charts-grid"><section className="panel"><h3>Despesas por categoria</h3>{total?Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([c,v])=><div className="category-row" key={c}><div><span>{c}</span><b>{moeda(v)}</b></div><div className="progress"><span style={{width:`${v/total*100}%`}}/></div></div>):<EstadoLista estado="vazio" mensagem="Adicione despesas para visualizar este gráfico."/>}</section><section className="panel"><div className="panel-head"><h3>Receitas x despesas</h3><select aria-label="Ano do relatório" value={ano} onChange={e=>setAno(Number(e.target.value))}><option>{new Date().getFullYear()-1}</option><option>{new Date().getFullYear()}</option><option>{new Date().getFullYear()+1}</option></select></div><div className="legend"><span>🟢 Receitas</span><span>🔴 Despesas</span></div><GraficoBarras labels={nomes} receitas={meses.map(x=>x.receitas)} despesas={meses.map(x=>x.despesas)}/></section></div></>
}
export function Perfil() {
 const navigate = useNavigate()
 const fileInputRef = useRef<HTMLInputElement | null>(null)
 const [usuario, setUsuario] = useState<Usuario | null>(null)
 const [editandoPerfil, setEditandoPerfil] = useState(false)
 const [nomeEditado, setNomeEditado] = useState('')
 const [telefoneEditado, setTelefoneEditado] = useState('')
 const [erroPerfil, setErroPerfil] = useState('')

 useEffect(() => {
   const atual = getUsuarioAtual()
   if (!atual) {
     navigate('/login', { replace: true })
     return
   }

   setUsuario(atual)
 }, [navigate])

 function atualizarPerfil() {
   if (!usuario) return
   setNomeEditado(usuario.nome)
   setTelefoneEditado(usuario.telefone)
   setErroPerfil('')
   setEditandoPerfil(true)
 }

 function salvarPerfil(e: React.FormEvent) {
   e.preventDefault()
   if (!usuario) return
   if (nomeEditado.trim().length < 3) { setErroPerfil('Informe um nome com pelo menos 3 caracteres.'); return }
   if (telefoneEditado.trim().length < 8) { setErroPerfil('Informe um telefone válido.'); return }
   const atualizado: Usuario = { ...usuario, nome: nomeEditado.trim(), telefone: telefoneEditado.trim() }
   salvarUsuarios(getUsuarios().map(item => item.email.toLowerCase() === usuario.email.toLowerCase() ? atualizado : item))
   salvarUsuarioAtual(atualizado)
   setUsuario(atualizado)
   setEditandoPerfil(false)
 }
 function exportarBackup() {
   const dados = JSON.stringify(getUsuarios(), null, 2)
   const blob = new Blob([dados], { type: 'application/json' })
   const url = URL.createObjectURL(blob)
   const link = document.createElement('a')
   link.href = url
   link.download = 'meudinheiro-backup.json'
   link.click()
   URL.revokeObjectURL(url)
 }

 async function importarBackup(event: React.ChangeEvent<HTMLInputElement>) {
   const arquivo = event.target.files?.[0]
   if (!arquivo) return

   try {
     const texto = await arquivo.text()
     const dados = JSON.parse(texto) as Usuario[]
     if (!Array.isArray(dados) || !dados.length) {
       alert('Arquivo inválido.')
       return
     }

     salvarUsuarios(dados)
     const atual = dados.find(item => item.email.toLowerCase() === usuario?.email.toLowerCase()) ?? dados[0]
     salvarUsuarioAtual(atual)
     setUsuario(atual)
     alert('Backup importado com sucesso!')
   } catch {
     alert('Não foi possível importar o arquivo.')
   } finally {
     event.target.value = ''
   }
 }

 function excluirConta() {
   if (!usuario || !window.confirm('Excluir sua conta e dados locais?')) return

   const usuarios = getUsuarios().filter(item => item.email.toLowerCase() !== usuario.email.toLowerCase())
   salvarUsuarios(usuarios)
   limparUsuarioAtual()
   navigate('/login', { replace: true })
 }

 if (!usuario) return null

 return (
  <>
   <div className="profile-intro">
    <p>Bem-vindo(a),</p>
    <h3>{usuario.nome}</h3>
   </div>

   <section className="profile-panel">
    <div className="profile-header">CONTA</div>
    <h2>Meu perfil</h2>

    <div className="profile-card">
     <div className="profile-avatar">🐷</div>
     <div className="profile-user-meta">
      <span className="profile-name">{usuario.nome}</span>
      <span className="profile-email">{usuario.email}</span>
     </div>
     <button type="button" className="btn-secondary" onClick={atualizarPerfil}>Editar nome e telefone</button>
    </div>

    <div className="profile-actions">
     <button type="button" className="btn-secondary" onClick={exportarBackup}>Exportar meus dados (backup)</button>
     <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>Importar backup</button>
    </div>

    <input ref={fileInputRef} type="file" accept=".json,application/json" hidden onChange={importarBackup} />

    <button type="button" className="btn-danger profile-danger" onClick={excluirConta}>Excluir conta e dados locais</button>
    <p className="profile-help">Seus dados ficam salvos neste navegador e neste dispositivo.</p>
   </section>
   {editandoPerfil && <Modal titulo="Editar perfil" onClose={() => setEditandoPerfil(false)}><form onSubmit={salvarPerfil}>
     <label>Nome completo<input value={nomeEditado} onChange={e => setNomeEditado(e.target.value)} required minLength={3} /></label>
     <label>Telefone<input type="tel" value={telefoneEditado} onChange={e => setTelefoneEditado(e.target.value)} required /></label>
     {erroPerfil && <p className="field-error" role="alert">{erroPerfil}</p>}
     <div className="modal-actions"><button type="button" className="btn-secondary" onClick={() => setEditandoPerfil(false)}>Cancelar</button><button className="btn-primary">Salvar alterações</button></div>
   </form></Modal>}
  </>
 )
}

export function Configuracoes() {
 const {estado,definirSaldoInicial}=useFinanceiro();const [valor,setValor]=useState((estado.saldoInicialCentavos/100).toFixed(2));const [msg,setMsg]=useState('')
 function salvar(e:React.FormEvent){e.preventDefault();const n=Number(valor.replace(',','.'));if(!Number.isFinite(n)||n<0){setMsg('Informe um valor válido.');return}definirSaldoInicial(Math.round(n*100));setMsg('Saldo inicial atualizado com sucesso!')}
 return <><PageTitle title="Configurações" description="Ajuste as preferências do seu controle financeiro."/><section className="panel settings-panel"><h3>Saldo inicial</h3><p>Informe o valor que você já tinha antes de começar a registrar movimentações.</p><form onSubmit={salvar}><label>Saldo inicial (R$)<input value={valor} onChange={e=>setValor(e.target.value)} inputMode="decimal"/></label><button className="btn-primary">Salvar alterações</button>{msg&&<p role="status" className="success-message">{msg}</p>}</form><hr/><h3>Armazenamento</h3><p>Os dados ficam salvos neste navegador usando localStorage. Não é necessário criar conta ou fazer login.</p></section></>
}
export function NaoEncontrado() { return <section className="panel not-found"><strong>404</strong><h2>Página não encontrada</h2><p>O endereço que você tentou acessar não existe.</p><Link className="btn-primary" to="/">Voltar ao início</Link></section> }
