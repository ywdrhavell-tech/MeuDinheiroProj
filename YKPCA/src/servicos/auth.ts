export type Usuario = {
  nome: string
  email: string
  telefone: string
  senha: string
}

export const STORAGE_USUARIOS = 'meudinheiro-usuarios'
export const STORAGE_SESSAO = 'meudinheiro-sessao'

export function getUsuarios(): Usuario[] {
  try {
    const dados = localStorage.getItem(STORAGE_USUARIOS)
    return dados ? JSON.parse(dados) as Usuario[] : []
  } catch {
    return []
  }
}

export function salvarUsuarios(usuarios: Usuario[]) {
  localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuarios))
}

export function getUsuarioAtual(): Usuario | null {
  try {
    const dados = localStorage.getItem(STORAGE_SESSAO)
    return dados ? JSON.parse(dados) as Usuario : null
  } catch {
    return null
  }
}

export function salvarUsuarioAtual(usuario: Usuario | null) {
  if (!usuario) {
    localStorage.removeItem(STORAGE_SESSAO)
    return
  }

  localStorage.setItem(STORAGE_SESSAO, JSON.stringify(usuario))
}

export function limparUsuarioAtual() {
  localStorage.removeItem(STORAGE_SESSAO)
}
