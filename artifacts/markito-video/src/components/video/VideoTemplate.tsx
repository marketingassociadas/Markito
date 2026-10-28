import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import MotionBackground from './MotionBackground';
import { OrientationProvider, type Orientation } from './OrientationContext';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import { Scene8 } from './video_scenes/Scene8';
import { Scene9 } from './video_scenes/Scene9';
import { Scene1 as H1 } from './video_scenes_h/Scene1';
import { Scene2 as H2 } from './video_scenes_h/Scene2';
import { Scene3 as H3 } from './video_scenes_h/Scene3';
import { Scene4 as H4 } from './video_scenes_h/Scene4';
import { Scene5 as H5 } from './video_scenes_h/Scene5';
import { Scene6 as H6 } from './video_scenes_h/Scene6';
import { Scene7 as H7 } from './video_scenes_h/Scene7';
import { Scene8 as H8 } from './video_scenes_h/Scene8';
import { Scene9 as H9 } from './video_scenes_h/Scene9';

export const SCENE_DURATIONS = {
  hook: 3500,
  problem: 6000,
  solution: 4500,
  whatis: 6000,
  beforeafter: 6500,
  trained: 6500,
  ecosystem: 5500,
  innovation: 5500,
  outro: 5000,
};

// Horizontal cut: text-heavy scenes linger longer so they're easier to read.
export const HORIZONTAL_DURATIONS = {
  hook: 3500,
  problem: 6000,
  solution: 4500,
  whatis: 6000,
  beforeafter: 6500,
  trained: 6500,
  ecosystem: 5500,
  innovation: 5500,
  outro: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hook: Scene1,
  problem: Scene2,
  solution: Scene3,
  whatis: Scene4,
  beforeafter: Scene5,
  trained: Scene6,
  ecosystem: Scene7,
  innovation: Scene8,
  outro: Scene9,
};

const SCENE_COMPONENTS_H: Record<string, React.ComponentType> = {
  hook: H1,
  problem: H2,
  solution: H3,
  whatis: H4,
  beforeafter: H5,
  trained: H6,
  ecosystem: H7,
  innovation: H8,
  outro: H9,
};

const AUDIO_SEEK_EPSILON_SEC = 0.18;

function ScaledStage({ isH, children }: { isH: boolean; children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const BASE_W = isH ? 1280 : 448;
  const BASE_H = isH ? 720 : Math.round(448 * (16 / 9)); // 796

  useEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current.parentElement!;
      const scaleW = clientWidth / BASE_W;
      const scaleH = clientHeight / BASE_H;
      setScale(Math.min(scaleW, scaleH));
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [BASE_W, BASE_H]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative overflow-hidden bg-bg-dark shadow-2xl flex-shrink-0"
        data-stage
      >
        {children}
      </div>
    </div>
  );
}

export default function VideoTemplate({
  durations,
  loop = true,
  muted = false,
  orientation = 'vertical',
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  orientation?: Orientation;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const isH = orientation === 'horizontal';
  const activeDurations = durations ?? (isH ? HORIZONTAL_DURATIONS : SCENE_DURATIONS);
  const sceneSet = isH ? SCENE_COMPONENTS_H : SCENE_COMPONENTS;

  const sceneStartSec = useRef<Record<string, number>>((() => {
    const out: Record<string, number> = {};
    let cumulativeMs = 0;
    for (const [key, ms] of Object.entries(activeDurations)) {
      out[key] = cumulativeMs / 1000;
      cumulativeMs += ms;
    }
    return out;
  })()).current;

  const { currentSceneKey } = useVideoPlayer({ durations: activeDurations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(activeDurations).indexOf(baseSceneKey);
  const totalScenes = Object.keys(activeDurations).length;
  const SceneComponent = sceneSet[baseSceneKey];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = `${import.meta.env.BASE_URL}audio/bg_music_long.mp3`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = sceneStartSec[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted, sceneStartSec]);

  const progress = totalScenes > 1 ? (sceneIndex + 1) / totalScenes : 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-dark text-text-inverse flex justify-center items-center">
      <ScaledStage isH={isH}>
        {/* Persistent animated motion-graphics background */}
        <MotionBackground />

        {/* Progress bar across the top */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-white/10">
          <motion.div
            className="h-full bg-secondary shadow-[0_0_12px_rgba(236,102,8,0.7)]"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Scene specific content */}
        <OrientationProvider value={orientation}>
          <div className="relative z-20 w-full h-full">
            <AnimatePresence mode="popLayout">
              {SceneComponent && <SceneComponent key={currentSceneKey} />}
            </AnimatePresence>
          </div>
        </OrientationProvider>
      </ScaledStage>

      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}
