import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import markitoMascot from '@assets/markito-mascot.png';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-20 px-24"
      initial={{ clipPath: 'circle(0% at 35% 50%)' }}
      animate={{ clipPath: 'circle(150% at 35% 50%)' }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative shrink-0"
        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl scale-110" />
        <motion.div
          className="relative w-64 h-64 rounded-full bg-primary/25 border-4 border-white/70 flex items-center justify-center overflow-hidden shadow-[0_0_70px_rgba(0,172,169,0.4)]"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
        >
          <img src={markitoMascot} alt="Markito" className="w-44 h-44 object-contain" />
        </motion.div>
      </motion.div>

      <div className="max-w-2xl">
        <motion.h2
          className="text-7xl font-black font-display text-white leading-[1.05]"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          É aí que entra o <span className="text-secondary">Markito</span>
        </motion.h2>
        <motion.p
          className="text-3xl text-white/80 font-body leading-relaxed mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Você não precisa dominar o marketing digital.{' '}
          <span className="text-white font-semibold">
            Precisa de um parceiro que domine por você.
          </span>
        </motion.p>
      </div>
    </motion.div>
  );
}
