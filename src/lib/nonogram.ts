export type Grid = number[][];
export type CellState = -1 | 0 | 1;

export const serializeGrid = (grid: Grid) => grid.map((r) => r.join('')).join('|');

const cluesForLine = (line: number[]) => {
  const clues: number[] = [];
  let run = 0;
  for (const c of line) {
    if (c === 1) run++; else if (run) { clues.push(run); run = 0; }
  }
  if (run) clues.push(run);
  return clues.length ? clues : [0];
};

export const getRowClues = (grid: Grid) => grid.map(cluesForLine);
export const getColumnClues = (grid: Grid) => grid[0].map((_, c) => cluesForLine(grid.map((r) => r[c])));

export const isSolved = (board: CellState[][], solution: Grid) => board.every((r,y)=>r.every((c,x)=>(c===1?1:0)===solution[y][x]));
