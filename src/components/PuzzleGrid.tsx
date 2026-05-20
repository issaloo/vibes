import { motion } from 'framer-motion';
import type { CellState } from '../lib/nonogram';

export const PuzzleGrid = ({ board, rowClues, colClues, onCell, hover }: { board: CellState[][]; rowClues: number[][]; colClues: number[][]; onCell: (y:number,x:number,right:boolean)=>void; hover:[number,number]|null }) => {
  const size = board.length;
  return <div className="overflow-auto"><div className="inline-grid gap-1" style={{gridTemplateColumns:`auto repeat(${size},1.8rem)`}}>
    <div />
    {colClues.map((c,x)=><div key={x} className="text-[10px] text-center text-slate-300 h-12 flex flex-col justify-end">{c.map((n,i)=><span key={i}>{n}</span>)}</div>)}
    {board.map((row,y)=><><div key={`r${y}`} className="text-[10px] text-right pr-1 text-slate-300 self-center">{rowClues[y].join(' ')}</div>{row.map((c,x)=><motion.button key={`${y}-${x}`} onClick={()=>onCell(y,x,false)} onContextMenu={(e)=>{e.preventDefault();onCell(y,x,true);}} className={`h-7 w-7 rounded ${hover && (hover[0]===y||hover[1]===x)?'ring-1 ring-cyan-300/40':''} ${c===1?'bg-violet-400':c===0?'bg-slate-700':'bg-slate-800 hover:bg-slate-700'}`} whileTap={{scale:0.92}} />)}</>)}
  </div></div>;
};
