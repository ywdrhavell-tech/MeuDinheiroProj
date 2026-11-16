import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { getUsuarioAtual, limparUsuarioAtual } from '../servicos/auth'

const links = [{to:'/',label:'Visão geral',icon:'⌂'},{to:'/lancamentos',label:'Lançamentos',icon:'▤'},{to:'/metas',label:'Metas financeiras',icon:'◎'},{to:'/graficos',label:'Gráficos',icon:'▥'},{to:'/perfil',label:'Perfil',icon:'◉'}]

export function Layout() {
  const [menu,setMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const usuario = getUsuarioAtual()
  const navLinks = usuario ? links : links.filter(l => l.to !== '/perfil')

  useEffect(() => setMenu(false),[location.pathname])

  function sair() {
    limparUsuarioAtual()
    navigate('/login', { replace: true })
  }

  return <div className="app-shell">
    <aside className={`sidebar ${menu?'open':''}`}>
      <div className="brand"><span className="brand-mark">M</span><span>Meu<strong>Dinheiro</strong></span></div>
      <p className="side-label">MENU PRINCIPAL</p>
      <nav>{navLinks.map(l=><NavLink key={l.to} to={l.to} end={l.to==='/'} className={({isActive})=>`nav-item ${isActive?'active':''}`}><span>{l.icon}</span>{l.label}</NavLink>)}</nav>

      <button type="button" className="logout-button" onClick={sair}>Sair</button>

      <div className="sidebar-bottom"><span>🐷</span><b>Seu dinheiro, no controle.</b><p>Pequenos passos constroem grandes conquistas.</p></div>
      <small className="side-footer">MEUDINHEIRO · 2026</small>
    </aside>
    <main className="main"><header className="topbar"><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Abrir menu">☰</button><div><span className="eyebrow">CONTROLE FINANCEIRO PESSOAL</span><h1>{navLinks.find(l=>l.to===location.pathname)?.label ?? 'MeuDinheiro'}</h1></div><span className="today">{new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}</span></header><Outlet/><footer className="main-footer">Feito para ajudar você a cuidar melhor do seu dinheiro. <span>MeuDinheiro © 2026</span></footer></main>
  </div>
}
export function PageTitle({title,description,action}:{title:string;description:string;action?:ReactNode}) {
  return <div className="page-heading"><div><p className="eyebrow">MEUDINHEIRO</p><h2>{title}</h2><p>{description}</p></div>{action}</div>
}
