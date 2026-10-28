import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: 'Custo zero', label: 'Sem custo extra para o associado' },
  { value: 'Futuro digital', label: 'Inovação ao alcance de todos' },
];

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center gap-16 px-24"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex-1 max-w-2xl">
        <motion.span
          className="text-xl text-secondary font-body tracking-[0.3em] uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Inovação acessível
        </motion.span>
        <motion.h2
          className="text-7xl font-black font-display text-white leading-[1.05] mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Tecnologia de ponta,<br /><span className="text-primary">sem complicação</span>
        </motion.h2>
        <motion.p
          className="text-3xl text-white/70 font-body leading-relaxed mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          O Markito coloca o poder do marketing digital na mão de cada farmácia associada.
        </motion.p>
      </div>

      <div className="flex-1 flex flex-col gap-6 max-w-md">
        {stats.map((s, i) => (
          <motion.div
            key={s.value}
            className="rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/12 p-9 backdrop-blur-sm"
            initial={{ opacity: 0, x: 40, scale: 0.92 }}
            animate={phase >= 1 ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ delay: 0.15 * i, type: 'spring', stiffness: 200, damping: 18 }}
          >
            <p className="text-5xl font-black font-display text-white">{s.value}</p>
            <p className="text-2xl text-white/70 font-body mt-3">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
