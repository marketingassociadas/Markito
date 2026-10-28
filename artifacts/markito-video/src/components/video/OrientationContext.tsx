import { createContext, useContext } from 'react';

export type Orientation = 'vertical' | 'horizontal';

const OrientationContext = createContext<Orientation>('vertical');

export const OrientationProvider = OrientationContext.Provider;

export function useOrientation(): Orientation {
  return useContext(OrientationContext);
}
