import { useState, useCallback } from 'react';
import { OSMDOptions, ColoringMode } from '../types';

export interface UseColoringOptions {
  mode?: ColoringMode;
  customColors?: string[];
  enabled?: boolean;
}

export interface UseColoringResult {
  coloringMode: ColoringMode;
  setColoringMode: (mode: ColoringMode) => void;
  customColors: string[];
  setCustomColors: (colors: string[]) => void;
  coloringEnabled: boolean;
  setColoringEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  getOptions: () => Partial<OSMDOptions>;
}

const defaultBoomwhackerColors = [
  '#ff0000', // C - Red
  '#ff7f00', // D - Orange
  '#ffff00', // E - Yellow
  '#00ff00', // G - Green
  '#0000ff', // A - Blue
  '#4b0082', // B - Indigo
  '#9400d3', // F - Violet
  '#000000', // Rest - Black
];

export const useColoring = (
  initialOptions: UseColoringOptions = {}
): UseColoringResult => {
  const [coloringMode, setColoringMode] = useState<ColoringMode>(
    initialOptions.mode ?? ColoringMode.XML
  );
  const [customColors, setCustomColors] = useState<string[]>(
    initialOptions.customColors ?? defaultBoomwhackerColors
  );
  const [coloringEnabled, setColoringEnabled] = useState<boolean>(
    initialOptions.enabled ?? false
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const getOptions = useCallback((): Partial<OSMDOptions> => {
    return {
      coloringMode,
      coloringEnabled,
      coloringSetCustom: coloringMode === ColoringMode.CustomColorSet ? customColors : undefined,
      darkMode,
    };
  }, [coloringMode, coloringEnabled, customColors, darkMode]);

  return {
    coloringMode,
    setColoringMode,
    customColors,
    setCustomColors,
    coloringEnabled,
    setColoringEnabled,
    darkMode,
    setDarkMode,
    getOptions,
  };
};