import { useState } from 'react';

export type BackgroundEffect = 'none' | 'blur' | 'image' | 'color';
export type BackgroundColor = 'blue' | 'green' | 'purple' | 'red' | 'custom';

interface UseBackgroundEffectsReturn {
  effect: BackgroundEffect;
  blurIntensity: number;
  backgroundColor: BackgroundColor;
  customBackgroundImage: string | null;
  customBackgroundColor: string;
  setEffect: (effect: BackgroundEffect) => void;
  setBlurIntensity: (intensity: number) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setCustomBackgroundImage: (image: string | null) => void;
  setCustomBackgroundColor: (color: string) => void;
}

export function useBackgroundEffects(): UseBackgroundEffectsReturn {
  const [effect, setEffect] = useState<BackgroundEffect>('none');
  const [blurIntensity, setBlurIntensity] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>('blue');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#1e40af');

  return {
    effect,
    blurIntensity,
    backgroundColor,
    customBackgroundImage,
    customBackgroundColor,
    setEffect,
    setBlurIntensity,
    setBackgroundColor,
    setCustomBackgroundImage,
    setCustomBackgroundColor,
  };
}
