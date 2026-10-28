import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="text-sm text-secondary font-body tracking-[0.3em] uppercase mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Inovação feita em casa
      </motion.span>
      <motion.h2
        className="text-4xl font-black font-display text-white leading-tight mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Inteligência, design e arquitetura <span className="text-primary">100% internos</span>
      </motion.h2>

      <motion.p
        className="text-base text-white/70 font-body leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Total alinhamento com a cultura e as diretrizes da Rede Farmácias Associadas.
      </motion.p>

      <div className="flex gap-3 mt-7">
        {[
          { k: 'Desenvolvimento', v: 'Dedicado' },
          { k: 'Manutenção', v: 'Assinatura' },
        ].map((s, i) => (
          <motion.div
            key={s.k}
            className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.12 * i, type: 'spring', stiffness: 220, damping: 18 }}
          >
            <p className="text-xs text-white/55 font-body tracking-[0.15em] uppercase">{s.k}</p>
            <p className="text-2xl text-secondary font-display font-black mt-1">{s.v}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-9 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/15 border border-white/15 p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-2xl text-white font-display font-black leading-tight text-center">
          O futuro da farmácia é<br /><span className="text-secondary">digital e conectado.</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
