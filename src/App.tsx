import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { HowToPlay } from './components/HowToPlay';
import { PuzzleGrid } from './components/PuzzleGrid';
import { SolveModal } from './components/SolveModal';
import { StatsPanel } from './components/StatsPanel';
import { getDateStringLA } from './lib/dateSeed';
import { generateDailyPuzzle } from './lib/generator';
import type { CellState } from './lib/nonogram';
import { isSolved } from './lib/nonogram';
import { loadProgress, loadStats, saveProgress, saveStats, type Stats } from './lib/storage';

const newBoard = (n:number) => Array.from({length:n},()=>Array<CellState>(n).fill(-1));
const fmt = (s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

export default function App(){
  const [activeDate,setActiveDate]=useState(getDateStringLA());
  const puzzle=useMemo(()=>generateDailyPuzzle(activeDate),[activeDate]);
  const [board,setBoard]=useState<CellState[][]>(newBoard(puzzle.size)); const [timer,setTimer]=useState(0); const [mistakes,setMistakes]=useState(0); const [mistakeFree,setMistakeFree]=useState(false);
  const [stats,setStats]=useState<Stats>(loadStats()); const [showArchive,setShowArchive]=useState(false); const [solved,setSolved]=useState(false);

  useEffect(()=>{ const p=loadProgress(activeDate); if(p){setBoard(p.board);setTimer(p.elapsed);setSolved(p.solved);setMistakes(p.mistakes);setMistakeFree(p.mistakeFree);} else {setBoard(newBoard(puzzle.size));setTimer(0);setSolved(false);setMistakes(0);} },[activeDate,puzzle.size]);
  useEffect(()=>{ if(solved) return; const i=setInterval(()=>setTimer(s=>s+1),1000); return ()=>clearInterval(i);},[solved]);
  useEffect(()=>saveProgress(activeDate,{board,startedAt:Date.now(),elapsed:timer,solved,mistakes,mistakeFree}),[activeDate,board,timer,solved,mistakes,mistakeFree]);

  const onCell=(y:number,x:number,right:boolean)=>{ if(solved)return; setBoard(prev=>{ const n=prev.map(r=>[...r]); n[y][x]= right ? 0 : ((n[y][x]+2)%3-1 as CellState); if(mistakeFree && n[y][x]===1 && puzzle.solution[y][x]!==1){n[y][x]=-1;setMistakes(m=>m+1);} return n;});};

  useEffect(()=>{ if(!solved && isSolved(board,puzzle.solution)){ setSolved(true); const ns={...stats,solved:stats.solved+1,totalTime:stats.totalTime+timer,perfectSolves:stats.perfectSolves+(mistakes===0?1:0),currentStreak:stats.lastSolvedDate===activeDate?stats.currentStreak:stats.currentStreak+1,lastSolvedDate:activeDate}; ns.maxStreak=Math.max(ns.maxStreak,ns.currentStreak); setStats(ns); saveStats(ns);} },[board,solved,puzzle.solution,stats,timer,mistakes,activeDate]);

  const share=`Glyphogram #${puzzle.puzzleNumber}\nSolved in ${fmt(timer)}\n${Array.from({length:3},(_,r)=>Array.from({length:5},(_,c)=>board[r]?.[c]===1?'🟪':'⬜').join('')).join('\n')}`;

  return <main className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white p-4 md:p-8"><div className="mx-auto max-w-6xl space-y-6">
    <Header stats={stats} onArchive={()=>setShowArchive(v=>!v)}/>
    {showArchive && <div className="rounded-xl bg-white/10 p-3 flex flex-wrap gap-2">{Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);const ds=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles'}).format(d);return <button key={ds} onClick={()=>setActiveDate(ds)} className="px-2 py-1 rounded bg-white/10 text-xs">{ds}</button>;})}</div>}
    <section className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 md:p-6 shadow-2xl grid md:grid-cols-[1fr_280px] gap-6">
      <div><div className="flex flex-wrap gap-3 items-center mb-3 text-sm text-slate-200"><span>#{puzzle.puzzleNumber}</span><span>{puzzle.date}</span><span>{puzzle.difficulty}</span><span>{fmt(timer)}</span></div>
      <PuzzleGrid board={board} rowClues={puzzle.rowClues} colClues={puzzle.colClues} onCell={onCell} hover={null}/></div>
      <div className="space-y-3"><HowToPlay/><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={mistakeFree} onChange={(e)=>setMistakeFree(e.target.checked)}/>Mistake-free mode</label><button onClick={()=>{setBoard(newBoard(puzzle.size));setTimer(0);setSolved(false);setMistakes(0);}} className="w-full rounded-xl bg-rose-500/30 px-3 py-2">Reset</button><button onClick={()=>navigator.clipboard.writeText(share)} className="w-full rounded-xl bg-cyan-500/30 px-3 py-2">Share</button><StatsPanel stats={stats}/></div>
    </section>
  </div><SolveModal open={solved} onClose={()=>setSolved(false)} text={share}/></main>;
}
