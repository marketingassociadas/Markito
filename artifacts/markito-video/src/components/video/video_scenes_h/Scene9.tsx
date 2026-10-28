import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import markitoMascot from '@assets/markito-mascot.png';
// @ts-ignore
import farmaciasLogo from '@assets/farmacias-logo.png';

export function Scene9() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1700),
      setTimeout(() => setPhase(3), 2700),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center gap-20 px-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative shrink-0"
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl scale-110" />
        <motion.div
          className="relative w-56 h-56 rounded-full bg-primary/25 border-4 border-white/70 flex items-center justify-center overflow-hidden shadow-[0_0_70px_rgba(0,172,169,0.4)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
        >
          <img src={markitoMascot} alt="Markito" className="w-40 h-40 object-contain" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-start max-w-xl">
        <motion.span
          className="text-xl text-secondary font-body tracking-[0.3em] uppercase mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Exclusivo para associados
        </motion.span>

        <motion.h2
          className="text-6xl font-black font-display text-white leading-[1.05] mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Seu marketing,<br /><span className="text-primary">do seu jeito</span>
        </motion.h2>

        <motion.div
          className="bg-white rounded-2xl px-8 py-5 shadow-2xl"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <img src={farmaciasLogo} alt="Farmácias Associadas" className="h-16 object-contain" />
        </motion.div>

        <motion.p
          className="text-xl text-white/60 font-body mt-8"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Desenvolvido por <span className="text-white font-semibold">Bianca Campello</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
