import { motion } from 'framer-motion';

export const SolveModal = ({ open, onClose, text }: { open: boolean; onClose: ()=>void; text: string }) => {
  if (!open) return null;
  return <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/50 grid place-items-center p-4">
    <motion.div initial={{scale:0.9}} animate={{scale:1}} className="max-w-md w-full rounded-2xl bg-slate-900 p-6 border border-white/15">
      <h2 className="text-xl font-bold">Glyph solved ✨</h2>
      <pre className="mt-3 whitespace-pre-wrap text-sm bg-white/5 p-3 rounded-lg">{text}</pre>
      <button className="mt-4 px-4 py-2 rounded-lg bg-violet-500/50" onClick={onClose}>Close</button>
    </motion.div>
  </motion.div>;
};
