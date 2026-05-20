import { CalendarDays, Flame } from 'lucide-react';
import type { Stats } from '../lib/storage';

export const Header = ({ stats, onArchive }: { stats: Stats; onArchive: () => void }) => (
  <header className="flex flex-wrap items-center justify-between gap-3">
    <div><h1 className="text-3xl font-bold tracking-tight">Glyphogram</h1><p className="text-slate-300">A new hidden glyph every day</p></div>
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-white/10 px-3 py-2 text-sm flex items-center gap-2"><Flame className="h-4 w-4 text-amber-300"/>Streak {stats.currentStreak}</div>
      <button onClick={onArchive} className="rounded-xl bg-violet-500/30 hover:bg-violet-500/50 px-3 py-2 text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4"/>Archive</button>
    </div>
  </header>
);
