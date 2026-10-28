import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary flex items-center justify-center mb-12 shadow-[0_0_40px_rgba(0,172,169,0.3)]"
        initial={{ rotate: -20, opacity: 0, y: 30 }}
        animate={{ rotate: 0, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h1 
          className="text-5xl md:text-6xl font-black font-display text-white leading-tight"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          Marketing<br/>
          <span className="text-secondary">Digital</span>
        </motion.h1>
      </div>

      <div className="overflow-hidden mt-6">
        <motion.p 
          className="text-xl md:text-2xl text-white/80 font-body"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Parece um desafio?
        </motion.p>
      </div>

      {phase >= 2 && (
        <motion.div 
          className="absolute bottom-20 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}