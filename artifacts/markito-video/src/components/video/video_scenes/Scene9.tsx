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
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Mascot */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl scale-110" />
        <motion.div
          className="relative w-40 h-40 rounded-full bg-primary/25 border-4 border-white/80 flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(0,172,169,0.45)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <img src={markitoMascot} alt="Markito" className="w-28 h-28 object-contain" />
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="h-px w-8 bg-secondary/60" />
        <span className="text-sm text-secondary font-body tracking-[0.35em] uppercase">Exclusivo para</span>
        <span className="h-px w-8 bg-secondary/60" />
      </motion.div>

      {/* White logo directly on the dark background (readable) */}
      <motion.div
        className="relative inline-block px-2"
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
        animate={phase >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      >
        <img
          src={farmaciasLogo}
          alt="Farmácias Associadas"
          className="h-24 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        />
        <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={phase >= 2 ? { opacity: 1 } : {}}>
          <motion.div
            className="absolute top-0 h-full w-1/3 skew-x-[-20deg]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
            initial={{ x: '-150%' }}
            animate={phase >= 2 ? { x: '350%' } : {}}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Credit */}
      <motion.div
        className="absolute bottom-12 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="text-[11px] text-white/45 font-body tracking-[0.3em] uppercase">Desenvolvido por</p>
        <p className="text-base text-white/90 font-display font-bold tracking-wide mt-1">Bianca Campello</p>
      </motion.div>
    </motion.div>
  );
}
