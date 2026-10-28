import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const nodes = [
  { title: 'Associado', sub: 'A farmácia', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
  { title: 'Markito', sub: 'O assistente', icon: <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z M5 21a7 7 0 0 1 14 0" /> },
  { title: 'A Rede', sub: 'Farmácias Associadas', icon: <path d="M3 21h18 M5 21V9l7-5 7 5v12 M9 21v-6h6v6" /> },
];

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center items-center text-center px-24"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h2
        className="text-6xl font-black font-display text-white leading-tight mb-14"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Um ecossistema que <span className="text-secondary">conecta todos</span>
      </motion.h2>

      <div className="flex items-center justify-center gap-6">
        {nodes.map((n, i) => (
          <div key={n.title} className="flex items-center gap-6">
            <motion.div
              className="w-52 rounded-3xl bg-white/5 border border-white/12 px-6 py-8 backdrop-blur-sm flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.7, y: 24 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 0.18 * i, type: 'spring', stiffness: 200, damping: 18 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/40 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {n.icon}
                </svg>
              </div>
              <p className="text-3xl text-white font-display font-bold">{n.title}</p>
              <p className="text-xl text-white/60 font-body mt-1">{n.sub}</p>
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-secondary shrink-0"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1, x: [0, 6, 0] } : {}}
                transition={{ opacity: { delay: 0.18 * i + 0.3 }, x: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } }}
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </motion.svg>
            )}
          </div>
        ))}
      </div>

      <motion.p
        className="text-3xl text-white/75 font-body mt-14 max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Marketing inteligente, com o respaldo de uma{' '}
        <span className="text-primary font-semibold">grande rede</span>.
      </motion.p>
    </motion.div>
  );
}
