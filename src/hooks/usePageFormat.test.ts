import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageFormat, PageFormats } from './usePageFormat';

describe('usePageFormat', () => {
  describe('Initialization', () => {
    it('should initialize with Endless format by default', () => {
      const { result } = renderHook(() => usePageFormat());

      expect(result.current.format).toEqual(PageFormats.Endless);
      expect(result.current.formatId).toBe('Endless');
    });

    it('should initialize with string format', () => {
      const { result } = renderHook(() =>
        usePageFormat({ initialFormat: 'A4_P' })
      );

      expect(result.current.format).toEqual(PageFormats.A4_P);
      expect(result.current.formatId).toBe('A4_P');
    });

    it('should initialize with PageFormat object', () => {
      const customFormat = {
        width: 200,
        height: 300,
        idString: 'Custom',
      };

      const { result } = renderHook(() =>
        usePageFormat({ initialFormat: customFormat })
      );

      expect(result.current.format).toEqual(customFormat);
      expect(result.current.formatId).toBe('Custom');
    });

    it('should fallback to Endless for invalid string format', () => {
      const { result } = renderHook(() =>
        usePageFormat({ initialFormat: 'InvalidFormat' })
      );

      expect(result.current.format).toEqual(PageFormats.Endless);
    });
  });

  describe('Setting Format', () => {
    it('should set format by string', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setFormat('A4_L');
      });

      expect(result.current.format).toEqual(PageFormats.A4_L);
      expect(result.current.formatId).toBe('A4_L');
    });

    it('should set format by PageFormat object', () => {
      const { result } = renderHook(() => usePageFormat());
      const customFormat = {
        width: 150,
        height: 200,
        idString: 'CustomSize',
      };

      act(() => {
        result.current.setFormat(customFormat);
      });

      expect(result.current.format).toEqual(customFormat);
      expect(result.current.formatId).toBe('CustomSize');
    });

    it('should change format multiple times', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setFormat('A4_P');
      });
      expect(result.current.formatId).toBe('A4_P');

      act(() => {
        result.current.setFormat('Letter_L');
      });
      expect(result.current.formatId).toBe('Letter_L');

      act(() => {
        result.current.setFormat('A5_L');
      });
      expect(result.current.formatId).toBe('A5_L');
    });

    it('should fallback to Endless for invalid string', () => {
      const { result } = renderHook(() => usePageFormat({ initialFormat: 'A4_P' }));

      act(() => {
        result.current.setFormat('InvalidFormat');
      });

      expect(result.current.format).toEqual(PageFormats.Endless);
    });
  });

  describe('Setting Custom Format', () => {
    it('should set custom format with width and height', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(250, 350);
      });

      expect(result.current.format.width).toBe(250);
      expect(result.current.format.height).toBe(350);
      expect(result.current.format.isInfinite).toBe(false);
    });

    it('should generate default id if not provided', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(100, 200);
      });

      expect(result.current.formatId).toBe('Custom_100x200');
    });

    it('should use provided id', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(100, 200, 'MyCustomFormat');
      });

      expect(result.current.formatId).toBe('MyCustomFormat');
    });

    it('should handle decimal dimensions', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(210.5, 297.8);
      });

      expect(result.current.format.width).toBe(210.5);
      expect(result.current.format.height).toBe(297.8);
    });

    it('should set isInfinite to false', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(100, 10000);
      });

      expect(result.current.format.isInfinite).toBe(false);
    });
  });

  describe('Standard Formats', () => {
    const standardFormats = [
      'A3_L', 'A3_P', 'A4_L', 'A4_P', 'A5_L', 'A5_P',
      'A6_L', 'A6_P', 'Letter_L', 'Letter_P', 'Endless',
    ];

    standardFormats.forEach((formatId) => {
      it(`should support ${formatId} format`, () => {
        const { result } = renderHook(() => usePageFormat());

        act(() => {
          result.current.setFormat(formatId);
        });

        expect(result.current.formatId).toBe(formatId);
        expect(result.current.format).toEqual(PageFormats[formatId]);
      });
    });

    it('should have correct dimensions for A4_P', () => {
      expect(PageFormats.A4_P).toEqual({
        width: 210,
        height: 297,
        idString: 'A4_P',
      });
    });

    it('should have correct dimensions for A4_L', () => {
      expect(PageFormats.A4_L).toEqual({
        width: 297,
        height: 210,
        idString: 'A4_L',
      });
    });

    it('should mark Endless as infinite', () => {
      expect(PageFormats.Endless.isInfinite).toBe(true);
    });

    it('should have portrait orientation taller than wide', () => {
      expect(PageFormats.A4_P.height).toBeGreaterThan(PageFormats.A4_P.width);
      expect(PageFormats.Letter_P.height).toBeGreaterThan(PageFormats.Letter_P.width);
    });

    it('should have landscape orientation wider than tall', () => {
      expect(PageFormats.A4_L.width).toBeGreaterThan(PageFormats.A4_L.height);
      expect(PageFormats.Letter_L.width).toBeGreaterThan(PageFormats.Letter_L.height);
    });
  });

  describe('Format ID', () => {
    it('should return correct format ID', () => {
      const { result } = renderHook(() => usePageFormat({ initialFormat: 'A5_P' }));

      expect(result.current.formatId).toBe('A5_P');
    });

    it('should update format ID when format changes', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setFormat('Letter_P');
      });

      expect(result.current.formatId).toBe('Letter_P');
    });

    it('should return custom ID for custom format', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(100, 200, 'SpecialFormat');
      });

      expect(result.current.formatId).toBe('SpecialFormat');
    });
  });

  describe('Integration', () => {
    it('should handle switching between standard and custom formats', () => {
      const { result } = renderHook(() => usePageFormat());

      // Start with standard format
      act(() => {
        result.current.setFormat('A4_P');
      });
      expect(result.current.formatId).toBe('A4_P');

      // Switch to custom
      act(() => {
        result.current.setCustomFormat(150, 250, 'Custom1');
      });
      expect(result.current.formatId).toBe('Custom1');
      expect(result.current.format.width).toBe(150);

      // Switch back to standard
      act(() => {
        result.current.setFormat('Letter_L');
      });
      expect(result.current.formatId).toBe('Letter_L');
      expect(result.current.format).toEqual(PageFormats.Letter_L);
    });

    it('should maintain format object structure', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(200, 300, 'Test');
      });

      const format = result.current.format;
      expect(format).toHaveProperty('width');
      expect(format).toHaveProperty('height');
      expect(format).toHaveProperty('idString');
      expect(format).toHaveProperty('isInfinite');
    });

    it('should work with all format switching patterns', () => {
      const { result } = renderHook(() => usePageFormat({ initialFormat: 'A4_P' }));

      // String to string
      act(() => {
        result.current.setFormat('A4_L');
      });
      expect(result.current.formatId).toBe('A4_L');

      // String to object
      const obj = { width: 100, height: 200, idString: 'Custom' };
      act(() => {
        result.current.setFormat(obj);
      });
      expect(result.current.format).toEqual(obj);

      // Object to custom
      act(() => {
        result.current.setCustomFormat(50, 100);
      });
      expect(result.current.formatId).toBe('Custom_50x100');

      // Custom to string
      act(() => {
        result.current.setFormat('Endless');
      });
      expect(result.current.formatId).toBe('Endless');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero dimensions', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(0, 0);
      });

      expect(result.current.format.width).toBe(0);
      expect(result.current.format.height).toBe(0);
    });

    it('should handle very large dimensions', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(9999, 9999);
      });

      expect(result.current.format.width).toBe(9999);
      expect(result.current.format.height).toBe(9999);
    });

    it('should use provided id even if empty', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(100, 200, '');
      });

      // Empty string gets passed through (it's truthy check, empty string is valid)
      expect(result.current.formatId).toBe('');
      expect(result.current.format.idString).toBe('');
    });

    it('should handle negative dimensions', () => {
      const { result } = renderHook(() => usePageFormat());

      act(() => {
        result.current.setCustomFormat(-100, -200);
      });

      expect(result.current.format.width).toBe(-100);
      expect(result.current.format.height).toBe(-200);
    });
  });
});