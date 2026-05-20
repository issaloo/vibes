import { buildDailySeed, dateFromOffset } from './dateSeed';
import { createSeededRng } from './rng';
import { getColumnClues, getRowClues, serializeGrid, type Grid } from './nonogram';
import { validatePuzzleHasUniqueSolution } from './solver';

export type Difficulty = 'Gentle' | 'Tricky' | 'Sharp' | 'Brutal';
export type DailyPuzzle = { solution: Grid; rowClues: number[][]; colClues: number[][]; hash: string; size: number; difficulty: Difficulty; date: string; puzzleNumber: number };

const empty = (n: number) => Array.from({ length: n }, () => Array(n).fill(0));
const neighbors = [[1,0],[-1,0],[0,1],[0,-1]];

export const generateCandidateGrid = (seed: string, size: number, attempt: number): Grid => {
  const rng = createSeededRng(`${seed}:${attempt}`); const g = empty(size); const mid = Math.floor(size/2);
  for(let i=0;i<size*1.2;i++){ const y=Math.floor(rng()*size),x=Math.floor(rng()*(mid+1)); const r=1+Math.floor(rng()*2); for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++) if(dx*dx+dy*dy<=r*r){const ny=y+dy,nx=x+dx;if(ny>=0&&ny<size&&nx>=0&&nx<=mid)g[ny][nx]=1;}}
  for(let i=0;i<size;i++){ if(rng()>0.4){ const y=Math.floor((i/size)*size); g[y][Math.floor(mid*0.7)]=1; }}
  for(let y=0;y<size;y++)for(let x=0;x<=mid;x++) if(g[y][x]) g[y][size-1-x]=rng()>0.2?1:g[y][size-1-x];
  for(let i=0;i<size/2;i++){const y=Math.floor(rng()*size),x=Math.floor(rng()*size); if(rng()>0.65) g[y][x]=0;}
  return g;
};

const connected = (g: Grid) => { const size=g.length; let start:[number,number]|null=null; let total=0; g.forEach((r,y)=>r.forEach((c,x)=>{if(c){total++; if(!start)start=[y,x];}})); if(!start) return false; const seen=new Set<string>(); const q=[start]; while(q.length){const [y,x]=q.pop()!;const k=`${y},${x}`; if(seen.has(k))continue;seen.add(k); for(const [dy,dx] of neighbors){const ny=y+dy,nx=x+dx; if(ny>=0&&ny<size&&nx>=0&&nx<size&&g[ny][nx])q.push([ny,nx]);}} return seen.size/total>0.8; };

const quality = (g: Grid) => { const size=g.length; const f=g.flat().reduce((a,b)=>a+b,0)/(size*size); if(f<0.28||f>0.62) return false; const nonEmptyRows=g.filter(r=>r.some(Boolean)).length; const nonEmptyCols=g[0].filter((_,x)=>g.some(r=>r[x])).length; return nonEmptyRows>size*0.65&&nonEmptyCols>size*0.65&&connected(g); };

const difficultyFor = (size:number,row:number[][],col:number[][]):Difficulty => { const groups=[...row,...col].reduce((a,c)=>a+c.filter((n)=>n>0).length,0); const score=size*2+groups; return score<70?'Gentle':score<95?'Tricky':score<120?'Sharp':'Brutal'; };

export const generateDailyPuzzle = (date: string): DailyPuzzle => {
  const base = buildDailySeed(date); const size = 12; const recent = new Set<string>();
  for(let i=1;i<=60;i++){
    const prevSeed=buildDailySeed(dateFromOffset(-i,new Date(date)));
    recent.add(serializeGrid(generateCandidateGrid(prevSeed,size,0)));
  }
  for(let attempt=0;attempt<160;attempt++){
    const g=generateCandidateGrid(base,size,attempt); if(!quality(g)) continue;
    const hash=serializeGrid(g); if(recent.has(hash)) continue;
    const row=getRowClues(g), col=getColumnClues(g);
    if(!validatePuzzleHasUniqueSolution(row,col,size)) continue;
    const dayIndex=Math.floor((new Date(date).getTime()-new Date('2026-01-01').getTime())/86400000)+1;
    return { solution:g,rowClues:row,colClues:col,hash,size,difficulty:difficultyFor(size,row,col),date,puzzleNumber:dayIndex };
  }
  throw new Error('Failed to generate unique puzzle');
};
