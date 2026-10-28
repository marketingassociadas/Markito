import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const rows = [
  { label: 'Agilidade', before: 'Horas no tentativa e erro', after: 'Respostas em segundos' },
  { label: 'Suporte', before: 'Só no horário comercial', after: '24h por dia, 7 dias' },
  { label: 'Conteúdo', before: 'Campanhas genéricas', after: 'Feito para a sua região' },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 700)];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-7"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h2
        className="text-4xl font-black font-display text-white leading-tight mb-7"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        O que muda com o <span className="text-secondary">Markito</span>
      </motion.h2>

      <div className="flex flex-col gap-3.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.12 * i, type: 'spring', stiffness: 200, damping: 22 }}
          >
            <p className="text-xs text-primary font-body tracking-[0.2em] uppercase mb-2.5">{r.label}</p>
            <div className="flex items-center gap-3">
              <span className="flex-1 text-sm text-white/45 font-body line-through decoration-white/30">
                {r.before}
              </span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-secondary shrink-0"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.12 * i }}
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </motion.svg>
              <span className="flex-1 text-sm text-white font-body font-semibold text-right">
                {r.after}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
