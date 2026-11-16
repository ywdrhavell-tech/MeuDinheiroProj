export interface GraficoBarrasProps { labels:string[]; receitas:number[]; despesas:number[] }
export function GraficoBarras({labels,receitas,despesas}:GraficoBarrasProps) {
 const max=Math.max(1,...receitas,...despesas)
 return <div className="bar-chart" role="img" aria-label="Comparação mensal de receitas e despesas">{labels.map((label,i)=><div className="bar-group" key={label}><div className="bars"><span className="bar income-bar" style={{height:`${receitas[i]/max*100}%`}}/><span className="bar expense-bar" style={{height:`${despesas[i]/max*100}%`}}/></div><small>{label}</small></div>)}</div>
}
