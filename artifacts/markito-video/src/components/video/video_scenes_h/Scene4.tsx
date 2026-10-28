import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const chips = ['Redes sociais', 'WhatsApp', 'Google Ads', 'Campanhas', 'SEO local', 'Branding'];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1700),
      setTimeout(() => setPhase(3), 2800),
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
      {/* Left: heading + paragraph */}
      <div className="flex-1 max-w-2xl">
        <motion.span
          className="inline-flex items-center gap-3 text-base text-primary font-body tracking-[0.25em] uppercase bg-primary/10 border border-primary/40 rounded-full px-5 py-2 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          Assistente virtual de IA
        </motion.span>
        <motion.h2
          className="text-7xl font-black font-display text-white leading-[1.05]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Especialista em <span className="text-secondary">marketing</span>
        </motion.h2>
        <motion.p
          className="text-3xl text-white/75 font-body leading-relaxed mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Comunicação e vendas para os associados da Rede Farmácias Associadas — orientação simples, rápida e prática.
        </motion.p>
        <motion.p
          className="text-2xl text-white/55 font-body mt-7"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Disponível <span className="text-primary font-semibold">24h por dia</span>, direto no celular.
        </motion.p>
      </div>

      {/* Right: chips */}
      <div className="flex-1 flex flex-wrap gap-4 content-center max-w-xl">
        {chips.map((c, i) => (
          <motion.span
            key={c}
            className="text-3xl text-white/90 font-body bg-white/8 border border-white/15 rounded-2xl px-7 py-4 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 240, damping: 20 }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
