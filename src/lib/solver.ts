import type { Grid } from './nonogram';

export const generateLinePatterns = (length: number, clues: number[]): number[][] => {
  if (clues.length === 1 && clues[0] === 0) return [Array(length).fill(0)];
  const out: number[][] = [];
  const rec = (idx: number, pos: number, line: number[]) => {
    if (idx === clues.length) {
      out.push([...line, ...Array(length - line.length).fill(0)]);
      return;
    }
    const block = clues[idx];
    const remain = clues.slice(idx + 1).reduce((a, b) => a + b, 0) + (clues.length - idx - 1);
    for (let start = pos; start <= length - block - remain; start++) {
      const next = [...line, ...Array(start - line.length).fill(0), ...Array(block).fill(1)];
      if (idx < clues.length - 1) next.push(0);
      rec(idx + 1, next.length, next);
    }
  };
  rec(0, 0, []);
  return out;
};

export const countSolutionsUpToTwo = (rowClues: number[][], colClues: number[][], size: number) => {
  const rowPatterns = rowClues.map((c) => generateLinePatterns(size, c));
  const colPatterns = colClues.map((c) => generateLinePatterns(size, c));
  let count = 0;
  const grid: Grid = Array.from({ length: size }, () => Array(size).fill(0));

  const validPrefix = (x: number, y: number, v: number) => colPatterns[x].some((p) => p[y] === v && p.slice(0, y + 1).every((k, i) => k === grid[i][x] || i === y));

  const bt = (r: number) => {
    if (count >= 2) return;
    if (r === size) {
      if (colPatterns.every((options, x) => options.some((p) => p.every((v, y) => v === grid[y][x])))) count++;
      return;
    }
    for (const pat of rowPatterns[r]) {
      let ok = true;
      for (let x = 0; x < size && ok; x++) {
        grid[r][x] = pat[x];
        if (!validPrefix(x, r, pat[x])) ok = false;
      }
      if (ok) bt(r + 1);
    }
  };
  bt(0);
  return count;
};

export const validatePuzzleHasUniqueSolution = (rowClues: number[][], colClues: number[][], size: number) => countSolutionsUpToTwo(rowClues, colClues, size) === 1;
