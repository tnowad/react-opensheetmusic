import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColoring } from './useColoring';
import { ColoringMode } from '../types';

describe('useColoring', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useColoring());

      expect(result.current.coloringMode).toBe(ColoringMode.XML);
      expect(result.current.coloringEnabled).toBe(false);
      expect(result.current.darkMode).toBe(false);
      expect(result.current.customColors).toHaveLength(8);
    });

    it('should initialize with custom mode', () => {
      const { result } = renderHook(() =>
        useColoring({ mode: ColoringMode.Boomwhacker })
      );

      expect(result.current.coloringMode).toBe(ColoringMode.Boomwhacker);
    });

    it('should initialize with custom colors', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];
      const { result } = renderHook(() => useColoring({ customColors: colors }));

      expect(result.current.customColors).toEqual(colors);
    });

    it('should initialize with enabled state', () => {
      const { result } = renderHook(() => useColoring({ enabled: true }));

      expect(result.current.coloringEnabled).toBe(true);
    });

    it('should initialize with all options', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];
      const { result } = renderHook(() =>
        useColoring({
          mode: ColoringMode.CustomColorSet,
          customColors: colors,
          enabled: true,
        })
      );

      expect(result.current.coloringMode).toBe(ColoringMode.CustomColorSet);
      expect(result.current.customColors).toEqual(colors);
      expect(result.current.coloringEnabled).toBe(true);
    });
  });

  describe('Coloring Mode', () => {
    it('should set coloring mode', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setColoringMode(ColoringMode.Boomwhacker);
      });

      expect(result.current.coloringMode).toBe(ColoringMode.Boomwhacker);
    });

    it('should change mode multiple times', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setColoringMode(ColoringMode.Boomwhacker);
      });
      expect(result.current.coloringMode).toBe(ColoringMode.Boomwhacker);

      act(() => {
        result.current.setColoringMode(ColoringMode.CustomColorSet);
      });
      expect(result.current.coloringMode).toBe(ColoringMode.CustomColorSet);

      act(() => {
        result.current.setColoringMode(ColoringMode.XML);
      });
      expect(result.current.coloringMode).toBe(ColoringMode.XML);
    });
  });

  describe('Custom Colors', () => {
    it('should set custom colors', () => {
      const { result } = renderHook(() => useColoring());
      const newColors = ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888'];

      act(() => {
        result.current.setCustomColors(newColors);
      });

      expect(result.current.customColors).toEqual(newColors);
    });

    it('should handle empty color array', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setCustomColors([]);
      });

      expect(result.current.customColors).toEqual([]);
    });

    it('should handle partial color array', () => {
      const { result } = renderHook(() => useColoring());
      const partialColors = ['#ff0000', '#00ff00', '#0000ff'];

      act(() => {
        result.current.setCustomColors(partialColors);
      });

      expect(result.current.customColors).toEqual(partialColors);
    });
  });

  describe('Coloring Enabled', () => {
    it('should enable coloring', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setColoringEnabled(true);
      });

      expect(result.current.coloringEnabled).toBe(true);
    });

    it('should disable coloring', () => {
      const { result } = renderHook(() => useColoring({ enabled: true }));

      act(() => {
        result.current.setColoringEnabled(false);
      });

      expect(result.current.coloringEnabled).toBe(false);
    });

    it('should toggle coloring', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setColoringEnabled(true);
      });
      expect(result.current.coloringEnabled).toBe(true);

      act(() => {
        result.current.setColoringEnabled(false);
      });
      expect(result.current.coloringEnabled).toBe(false);
    });
  });

  describe('Dark Mode', () => {
    it('should enable dark mode', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('should disable dark mode', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setDarkMode(true);
        result.current.setDarkMode(false);
      });

      expect(result.current.darkMode).toBe(false);
    });
  });

  describe('Get Options', () => {
    it('should return correct options for XML mode', () => {
      const { result } = renderHook(() => useColoring({
        mode: ColoringMode.XML,
        enabled: true,
      }));

      const options = result.current.getOptions();

      expect(options).toEqual({
        coloringMode: ColoringMode.XML,
        coloringEnabled: true,
        coloringSetCustom: undefined,
        darkMode: false,
      });
    });

    it('should return correct options for Boomwhacker mode', () => {
      const { result } = renderHook(() => useColoring({
        mode: ColoringMode.Boomwhacker,
        enabled: true,
      }));

      const options = result.current.getOptions();

      expect(options).toEqual({
        coloringMode: ColoringMode.Boomwhacker,
        coloringEnabled: true,
        coloringSetCustom: undefined,
        darkMode: false,
      });
    });

    it('should return custom colors for CustomColorSet mode', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];
      const { result } = renderHook(() => useColoring({
        mode: ColoringMode.CustomColorSet,
        customColors,
        enabled: true,
      }));

      const options = result.current.getOptions();

      expect(options).toEqual({
        coloringMode: ColoringMode.CustomColorSet,
        coloringEnabled: true,
        coloringSetCustom: customColors,
        darkMode: false,
      });
    });

    it('should include dark mode when enabled', () => {
      const { result } = renderHook(() => useColoring({ enabled: true }));

      act(() => {
        result.current.setDarkMode(true);
      });

      const options = result.current.getOptions();

      expect(options.darkMode).toBe(true);
    });

    it('should update options dynamically', () => {
      const { result } = renderHook(() => useColoring());

      act(() => {
        result.current.setColoringMode(ColoringMode.Boomwhacker);
        result.current.setColoringEnabled(true);
        result.current.setDarkMode(true);
      });

      const options = result.current.getOptions();

      expect(options).toEqual({
        coloringMode: ColoringMode.Boomwhacker,
        coloringEnabled: true,
        coloringSetCustom: undefined,
        darkMode: true,
      });
    });

    it('should not include custom colors when mode is not CustomColorSet', () => {
      const customColors = ['#ff0000', '#00ff00'];
      const { result } = renderHook(() => useColoring({
        mode: ColoringMode.XML,
        customColors,
      }));

      const options = result.current.getOptions();

      expect(options.coloringSetCustom).toBeUndefined();
    });
  });

  describe('Integration', () => {
    it('should handle complete workflow', () => {
      const { result } = renderHook(() => useColoring());

      // Enable coloring with Boomwhacker mode
      act(() => {
        result.current.setColoringEnabled(true);
        result.current.setColoringMode(ColoringMode.Boomwhacker);
      });

      expect(result.current.getOptions()).toEqual({
        coloringMode: ColoringMode.Boomwhacker,
        coloringEnabled: true,
        coloringSetCustom: undefined,
        darkMode: false,
      });

      // Switch to custom colors
      const customColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];
      act(() => {
        result.current.setColoringMode(ColoringMode.CustomColorSet);
        result.current.setCustomColors(customColors);
      });

      expect(result.current.getOptions()).toEqual({
        coloringMode: ColoringMode.CustomColorSet,
        coloringEnabled: true,
        coloringSetCustom: customColors,
        darkMode: false,
      });

      // Enable dark mode
      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.getOptions().darkMode).toBe(true);

      // Disable coloring
      act(() => {
        result.current.setColoringEnabled(false);
      });

      expect(result.current.coloringEnabled).toBe(false);
    });
  });
});