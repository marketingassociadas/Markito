import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const nodes = [
  { label: 'Associado', sub: 'vende mais' },
  { label: 'Markito', sub: 'orienta e aprende', highlight: true },
  { label: 'Rede', sub: 'enxerga tudo' },
];

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-7 text-center"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h2
        className="text-4xl font-black font-display text-white leading-tight mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Um ciclo que fortalece<br />a <span className="text-secondary">Rede inteira</span>
      </motion.h2>

      <div className="flex items-center justify-center gap-2 mb-9">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex items-center gap-2">
            <motion.div
              className={`w-[88px] h-[88px] rounded-2xl flex flex-col items-center justify-center border ${
                n.highlight
                  ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,172,169,0.4)]'
                  : 'bg-white/5 border-white/15'
              }`}
              initial={{ opacity: 0, scale: 0.6, y: 16 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 0.18 * i, type: 'spring', stiffness: 220, damping: 16 }}
            >
              <span className={`text-base font-display font-bold ${n.highlight ? 'text-primary' : 'text-white'}`}>
                {n.label}
              </span>
              <span className="text-[10px] text-white/55 font-body mt-0.5">{n.sub}</span>
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-secondary shrink-0"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1, x: [0, 3, 0] } : {}}
                transition={{ opacity: { delay: 0.18 * i + 0.15 }, x: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' } }}
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </motion.svg>
            )}
          </div>
        ))}
      </div>

      <motion.p
        className="text-lg text-white/80 font-body leading-relaxed max-w-sm mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Ajuda a ponta a vender mais e mapeia, em tempo real, as deficiências de marketing de toda a rede.
      </motion.p>

      <motion.span
        className="inline-flex items-center gap-2 self-center text-sm text-primary font-body tracking-wide bg-primary/10 border border-primary/40 rounded-full px-4 py-2 mt-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Dashboard em tempo real
      </motion.span>
    </motion.div>
  );
}
