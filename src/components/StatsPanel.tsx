import type { Stats } from '../lib/storage';

export const StatsPanel = ({ stats }: { stats: Stats }) => {
  const avg = stats.solved ? Math.round(stats.totalTime / stats.solved) : 0;
  return <div className="grid grid-cols-2 gap-2 text-sm">{[
    ['Solved', stats.solved],['Streak', stats.currentStreak],['Max streak', stats.maxStreak],['Avg sec', avg],['Perfect', stats.perfectSolves]
  ].map(([k,v])=><div key={String(k)} className="rounded-lg bg-white/5 p-2"><div className="text-slate-400">{k}</div><div className="font-semibold">{v}</div></div>)}</div>;
};
