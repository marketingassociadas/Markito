import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const tasks = ['Atender clientes', 'Cuidar do estoque', 'Gerir a equipe', 'Resolver a loja'];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 3600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center gap-16 px-24"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: heading */}
      <div className="flex-1">
        <motion.span
          className="text-xl text-secondary font-body tracking-[0.35em] uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          O desafio
        </motion.span>
        <motion.h2
          className="text-7xl font-black font-display text-white leading-[1.05] mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A rotina já é<br /><span className="text-primary">corrida demais</span>
        </motion.h2>
        <motion.p
          className="text-3xl text-white/70 font-body mt-8 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Falta <span className="text-secondary font-semibold">tempo</span>. Falta{' '}
          <span className="text-secondary font-semibold">conhecimento técnico</span>.
        </motion.p>
      </div>

      {/* Right: task chips */}
      <div className="flex-1 flex flex-col gap-4 max-w-xl">
        {tasks.map((t, i) => (
          <motion.div
            key={t}
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 * i, type: 'spring', stiffness: 220, damping: 22 }}
          >
            <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
            <span className="text-3xl text-white/85 font-body">{t}</span>
          </motion.div>
        ))}
        <motion.div
          className="flex items-center gap-4 bg-secondary/15 border border-secondary/60 rounded-2xl px-6 py-5 mt-1"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-secondary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <span className="text-3xl text-white font-body font-semibold">
            …e ainda redes sociais, WhatsApp e anúncios?
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
