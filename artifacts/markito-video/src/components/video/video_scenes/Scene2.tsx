import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const tasks = ['Atender clientes', 'Cuidar do estoque', 'Gerir a equipe', 'Resolver a loja'];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3300),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-8"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="text-sm text-secondary font-body tracking-[0.35em] uppercase mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        O desafio
      </motion.span>
      <motion.h2
        className="text-4xl font-black font-display text-white leading-tight mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        A rotina já é<br /><span className="text-primary">corrida demais</span>
      </motion.h2>

      <div className="flex flex-col gap-3">
        {tasks.map((t, i) => (
          <motion.div
            key={t}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 * i, type: 'spring', stiffness: 220, damping: 22 }}
          >
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <span className="text-lg text-white/85 font-body">{t}</span>
          </motion.div>
        ))}

        <motion.div
          className="flex items-center gap-3 bg-secondary/15 border border-secondary/60 rounded-xl px-4 py-3 mt-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-secondary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <span className="text-lg text-white font-body font-semibold">
            …e ainda redes sociais, WhatsApp e anúncios?
          </span>
        </motion.div>
      </div>

      <motion.p
        className="text-lg text-white/70 font-body mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Falta <span className="text-secondary font-semibold">tempo</span>. Falta{' '}
        <span className="text-secondary font-semibold">conhecimento técnico</span>.
      </motion.p>
    </motion.div>
  );
}
