import { motion } from 'framer-motion';

const PARTICLES = [
  { x: 12, y: 18, s: 6, d: 7, delay: 0 },
  { x: 82, y: 12, s: 4, d: 9, delay: 1.2 },
  { x: 68, y: 30, s: 8, d: 8, delay: 0.6 },
  { x: 24, y: 48, s: 5, d: 10, delay: 2.1 },
  { x: 90, y: 55, s: 7, d: 7.5, delay: 0.3 },
  { x: 8, y: 70, s: 5, d: 9, delay: 1.8 },
  { x: 50, y: 82, s: 9, d: 8.5, delay: 0.9 },
  { x: 78, y: 88, s: 4, d: 10, delay: 2.6 },
  { x: 38, y: 8, s: 5, d: 8, delay: 1.5 },
  { x: 60, y: 62, s: 6, d: 9.5, delay: 0.4 },
  { x: 18, y: 92, s: 7, d: 7, delay: 2.2 },
  { x: 94, y: 78, s: 5, d: 8, delay: 1.1 },
];

const CROSSES = [
  { x: 14, y: 26, size: 26, color: 'var(--color-secondary)', d: 12, rot: 360, delay: 0 },
  { x: 86, y: 20, size: 18, color: 'var(--color-primary)', d: 16, rot: -360, delay: 1 },
  { x: 80, y: 68, size: 30, color: 'var(--color-secondary)', d: 14, rot: 360, delay: 2 },
  { x: 20, y: 78, size: 20, color: 'var(--color-primary)', d: 18, rot: -360, delay: 0.5 },
  { x: 52, y: 14, size: 16, color: 'var(--color-primary)', d: 15, rot: 360, delay: 1.5 },
];

function Cross({ size, color }: { size: number; color: string }) {
  const bar = Math.round(size * 0.34);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute rounded-sm"
        style={{ left: '50%', top: 0, width: bar, height: size, transform: 'translateX(-50%)', background: color }}
      />
      <div
        className="absolute rounded-sm"
        style={{ top: '50%', left: 0, height: bar, width: size, transform: 'translateY(-50%)', background: color }}
      />
    </div>
  );
}

export default function MotionBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Mesh gradient blobs */}
      <motion.div
        className="absolute w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] rounded-full opacity-30 blur-[80px]"
        style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
        animate={{ x: ['-25%', '30%', '-10%'], y: ['-5%', '40%', '5%'], scale: [1, 1.25, 0.9] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[120vw] h-[120vw] sm:w-[600px] sm:h-[600px] rounded-full opacity-25 blur-[60px] right-[-30%] bottom-[-20%]"
        style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent 70%)' }}
        animate={{ x: ['10%', '-25%', '5%'], y: ['-10%', '-35%', '0%'], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[80vw] h-[80vw] sm:w-[400px] sm:h-[400px] rounded-full opacity-20 blur-[70px] left-[-10%] top-[10%]"
        style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }}
        animate={{ x: ['0%', '40%', '10%'], y: ['10%', '50%', '20%'], scale: [0.9, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle moving grid */}
      <motion.div
        className="absolute inset-[-50%] opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        animate={{ x: [0, 48], y: [0, 48] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Concentric pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 rounded-full border border-primary/30"
          style={{ width: 200, height: 200, marginLeft: -100, marginTop: -100 }}
          animate={{ scale: [0.4, 2.6], opacity: [0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeOut', delay: i * 2 }}
        />
      ))}

      {/* Sweeping light beam */}
      <motion.div
        className="absolute top-0 h-full w-1/3"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
        animate={{ x: ['-120%', '320%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)',
            boxShadow: `0 0 ${p.s * 2}px currentColor`,
          }}
          animate={{ y: [0, -28, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* Floating pharmacy crosses */}
      {CROSSES.map((c, i) => (
        <motion.div
          key={`c-${i}`}
          className="absolute"
          style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: 0.18 }}
          animate={{ y: [0, -34, 0], rotate: [0, c.rot], opacity: [0.1, 0.28, 0.1] }}
          transition={{
            y: { duration: c.d, repeat: Infinity, ease: 'easeInOut', delay: c.delay },
            rotate: { duration: c.d * 2, repeat: Infinity, ease: 'linear' },
            opacity: { duration: c.d, repeat: Infinity, ease: 'easeInOut', delay: c.delay },
          }}
        >
          <Cross size={c.size} color={c.color} />
        </motion.div>
      ))}
    </div>
  );
}
