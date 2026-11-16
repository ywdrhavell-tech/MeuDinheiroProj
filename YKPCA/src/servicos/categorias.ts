import type { Categoria } from '../tipos'
export async function buscarCategorias(): Promise<Categoria[]> {
  const resposta = await fetch(`${import.meta.env.BASE_URL}dados/categorias.json`)
  if (!resposta.ok) throw new Error('Não foi possível carregar as categorias.')
  return await resposta.json() as Categoria[]
}
