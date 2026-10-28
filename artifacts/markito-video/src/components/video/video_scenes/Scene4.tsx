import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const chips = ['Redes sociais', 'WhatsApp', 'Google Ads', 'Campanhas', 'SEO local', 'Branding'];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="inline-flex items-center gap-2 self-start text-xs text-primary font-body tracking-[0.25em] uppercase bg-primary/10 border border-primary/40 rounded-full px-4 py-1.5 mb-5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Assistente virtual de IA
      </motion.span>

      <motion.h2
        className="text-4xl font-black font-display text-white leading-tight"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Especialista em <span className="text-secondary">marketing</span>, comunicação e vendas
      </motion.h2>

      <motion.p
        className="text-lg text-white/75 font-body leading-relaxed mt-5"
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Criado para os associados da Rede Farmácias Associadas — orientação simples, rápida e prática.
      </motion.p>

      <div className="flex flex-wrap gap-2.5 mt-7">
        {chips.map((c, i) => (
          <motion.span
            key={c}
            className="text-sm text-white/90 font-body bg-white/8 border border-white/15 rounded-full px-4 py-2 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.07 * i, type: 'spring', stiffness: 240, damping: 20 }}
          >
            {c}
          </motion.span>
        ))}
      </div>

      <motion.p
        className="text-base text-white/55 font-body mt-8"
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        Disponível <span className="text-primary font-semibold">24h por dia</span>, direto no celular.
      </motion.p>
    </motion.div>
  );
}
