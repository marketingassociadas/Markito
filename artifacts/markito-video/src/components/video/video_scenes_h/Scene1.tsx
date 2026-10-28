import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-24"
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="w-28 h-28 rounded-3xl bg-primary/20 border border-primary flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(0,172,169,0.3)]"
        initial={{ rotate: -20, opacity: 0, y: 30 }}
        animate={{ rotate: 0, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h1
          className="text-8xl font-black font-display text-white leading-[1.05]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          Marketing <span className="text-secondary">Digital</span>
        </motion.h1>
      </div>

      <motion.p
        className="text-4xl text-white/80 font-body mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Parece um desafio?
      </motion.p>
    </motion.div>
  );
}
