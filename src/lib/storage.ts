import type { CellState } from './nonogram';

export type PuzzleProgress = { board: CellState[][]; startedAt: number; elapsed: number; solved: boolean; mistakes: number; mistakeFree: boolean };
export type Stats = { solved: number; currentStreak: number; maxStreak: number; totalTime: number; perfectSolves: number; lastSolvedDate?: string };

const key = (date: string) => `glyphogram:progress:${date}`;
const statsKey = 'glyphogram:stats';
export const loadProgress = (date: string): PuzzleProgress | null => JSON.parse(localStorage.getItem(key(date)) || 'null');
export const saveProgress = (date: string, p: PuzzleProgress) => localStorage.setItem(key(date), JSON.stringify(p));
export const loadStats = (): Stats => JSON.parse(localStorage.getItem(statsKey) || '{"solved":0,"currentStreak":0,"maxStreak":0,"totalTime":0,"perfectSolves":0}');
export const saveStats = (s: Stats) => localStorage.setItem(statsKey, JSON.stringify(s));
