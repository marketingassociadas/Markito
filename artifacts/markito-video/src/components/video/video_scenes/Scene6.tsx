import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const items = [
  {
    title: 'Produtos de marca própria',
    desc: 'Conhece os produtos da Rede e seus apelos de venda.',
    icon: (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
    ),
  },
  {
    title: 'Campanhas e ações de marketing',
    desc: 'Domina as campanhas e o calendário da marca.',
    icon: (
      <path d="M3 11l18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    ),
  },
  {
    title: 'Informações regionais',
    desc: 'Entende o público e o contexto de cada estado.',
    icon: (
      <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z M12 10a2 2 0 1 0 0 0.01" />
    ),
  },
];

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 700)];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-7"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="text-sm text-secondary font-body tracking-[0.3em] uppercase mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Inteligência da Rede
      </motion.span>
      <motion.h2
        className="text-4xl font-black font-display text-white leading-tight mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Treinado com a sua <span className="text-primary">realidade</span>
      </motion.h2>

      <div className="flex flex-col gap-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            className="flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.12 * i, type: 'spring', stiffness: 200, damping: 22 }}
          >
            <motion.div
              className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center shrink-0"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.2 * i }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
            </motion.div>
            <div>
              <p className="text-lg text-white font-display font-bold leading-snug">{it.title}</p>
              <p className="text-sm text-white/65 font-body mt-1">{it.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
