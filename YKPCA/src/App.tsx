import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './componentes/Layout'
import { Inicio, Lancamentos, NovoLancamento, DetalheLancamento, EditarLancamento, Metas, Graficos, Configuracoes, NaoEncontrado, Login, Cadastro, Perfil } from './paginas/Paginas'
import { getUsuarioAtual } from './servicos/auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const usuario = getUsuarioAtual()
  return usuario ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const usuario = getUsuarioAtual()
  return usuario ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
 return (
  <Routes>
   <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
   <Route path="/cadastro" element={<PublicRoute><Cadastro /></PublicRoute>} />

   <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index element={<Inicio/>}/>
    <Route path="/lancamentos" element={<Lancamentos/>}/>
    <Route path="/lancamentos/novo" element={<NovoLancamento/>}/>
    <Route path="/lancamentos/:id" element={<DetalheLancamento/>}/>
    <Route path="/lancamentos/:id/editar" element={<EditarLancamento/>}/>
    <Route path="/metas" element={<Metas/>}/>
    <Route path="/graficos" element={<Graficos/>}/>
    <Route path="/perfil" element={<Perfil/>}/>
    <Route path="/configuracoes" element={<Configuracoes/>}/>
    <Route path="/404" element={<NaoEncontrado/>}/>
    <Route path="*" element={<Navigate to="/404" replace/>}/>
   </Route>
  </Routes>
 )
}
