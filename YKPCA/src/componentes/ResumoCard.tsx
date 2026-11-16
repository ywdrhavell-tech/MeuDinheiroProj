export interface ResumoCardProps { label: string; valor: string; tipo: 'saldo'|'receita'|'despesa'; detalhe: string }
export function ResumoCard({label,valor,tipo,detalhe}:ResumoCardProps) {
 return <article className={`summary-card ${tipo}`}><span>{label}</span><strong>{valor}</strong><small>{detalhe}</small></article>
}
