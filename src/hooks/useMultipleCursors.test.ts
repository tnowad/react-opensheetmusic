import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMultipleCursors, createDefaultCursor } from './useMultipleCursors';
import { CursorType, CursorOptions } from '../types';

describe('useMultipleCursors', () => {
  describe('Initialization', () => {
    it('should initialize with empty cursors array', () => {
      const { result } = renderHook(() => useMultipleCursors());

      expect(result.current.cursors).toEqual([]);
    });

    it('should initialize with provided cursors', () => {
      const initialCursors: CursorOptions[] = [
        { type: CursorType.Standard, color: '#ff0000', alpha: 0.5, follow: false },
        { type: CursorType.ThinLeft, color: '#00ff00', alpha: 0.7, follow: true },
      ];

      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      expect(result.current.cursors).toEqual(initialCursors);
    });
  });

  describe('Adding Cursors', () => {
    it('should add a cursor', () => {
      const { result } = renderHook(() => useMultipleCursors());
      const newCursor: CursorOptions = {
        type: CursorType.Standard,
        color: '#0000ff',
        alpha: 0.5,
        follow: false,
      };

      act(() => {
        result.current.addCursor(newCursor);
      });

      expect(result.current.cursors).toHaveLength(1);
      expect(result.current.cursors[0]).toEqual(newCursor);
    });

    it('should add multiple cursors', () => {
      const { result } = renderHook(() => useMultipleCursors());

      act(() => {
        result.current.addCursor({
          type: CursorType.Standard,
          color: '#ff0000',
          alpha: 0.5,
          follow: false,
        });
        result.current.addCursor({
          type: CursorType.ThinLeft,
          color: '#00ff00',
          alpha: 0.7,
          follow: true,
        });
      });

      expect(result.current.cursors).toHaveLength(2);
    });

    it('should preserve existing cursors when adding new one', () => {
      const initial: CursorOptions[] = [
        { type: CursorType.Standard, color: '#ff0000', alpha: 0.5, follow: false },
      ];
      const { result } = renderHook(() => useMultipleCursors(initial));

      act(() => {
        result.current.addCursor({
          type: CursorType.ThinLeft,
          color: '#00ff00',
          alpha: 0.7,
          follow: true,
        });
      });

      expect(result.current.cursors).toHaveLength(2);
      expect(result.current.cursors[0]).toEqual(initial[0]);
    });
  });

  describe('Removing Cursors', () => {
    let initialCursors: CursorOptions[];

    beforeEach(() => {
      initialCursors = [
        { type: CursorType.Standard, color: '#ff0000', alpha: 0.5, follow: false },
        { type: CursorType.ThinLeft, color: '#00ff00', alpha: 0.7, follow: true },
        { type: CursorType.CurrentArea, color: '#0000ff', alpha: 0.3, follow: false },
      ];
    });

    it('should remove cursor at index', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.removeCursor(1);
      });

      expect(result.current.cursors).toHaveLength(2);
      expect(result.current.cursors[0]).toEqual(initialCursors[0]);
      expect(result.current.cursors[1]).toEqual(initialCursors[2]);
    });

    it('should remove first cursor', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.removeCursor(0);
      });

      expect(result.current.cursors).toHaveLength(2);
      expect(result.current.cursors[0]).toEqual(initialCursors[1]);
    });

    it('should remove last cursor', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.removeCursor(2);
      });

      expect(result.current.cursors).toHaveLength(2);
      expect(result.current.cursors).not.toContain(initialCursors[2]);
    });

    it('should handle invalid index gracefully', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.removeCursor(10);
      });

      expect(result.current.cursors).toHaveLength(3);
    });

    it('should handle negative index', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.removeCursor(-1);
      });

      expect(result.current.cursors).toHaveLength(3);
    });
  });

  describe('Updating Cursors', () => {
    let initialCursors: CursorOptions[];

    beforeEach(() => {
      initialCursors = [
        { type: CursorType.Standard, color: '#ff0000', alpha: 0.5, follow: false },
        { type: CursorType.ThinLeft, color: '#00ff00', alpha: 0.7, follow: true },
      ];
    });

    it('should update cursor at index', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.updateCursor(0, { color: '#0000ff', alpha: 0.8 });
      });

      expect(result.current.cursors[0]).toEqual({
        type: CursorType.Standard,
        color: '#0000ff',
        alpha: 0.8,
        follow: false,
      });
    });

    it('should update single property', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.updateCursor(1, { follow: false });
      });

      expect(result.current.cursors[1].follow).toBe(false);
      expect(result.current.cursors[1].color).toBe('#00ff00');
    });

    it('should not affect other cursors', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.updateCursor(0, { color: '#ffffff' });
      });

      expect(result.current.cursors[1]).toEqual(initialCursors[1]);
    });

    it('should handle invalid index gracefully', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.updateCursor(10, { color: '#ffffff' });
      });

      expect(result.current.cursors).toEqual(initialCursors);
    });

    it('should update all properties', () => {
      const { result } = renderHook(() => useMultipleCursors(initialCursors));
      const update: CursorOptions = {
        type: CursorType.CurrentArea,
        color: '#ffffff',
        alpha: 1.0,
        follow: true,
      };

      act(() => {
        result.current.updateCursor(0, update);
      });

      expect(result.current.cursors[0]).toEqual(update);
    });
  });

  describe('Clearing Cursors', () => {
    it('should clear all cursors', () => {
      const initialCursors: CursorOptions[] = [
        { type: CursorType.Standard, color: '#ff0000', alpha: 0.5, follow: false },
        { type: CursorType.ThinLeft, color: '#00ff00', alpha: 0.7, follow: true },
      ];
      const { result } = renderHook(() => useMultipleCursors(initialCursors));

      act(() => {
        result.current.clearCursors();
      });

      expect(result.current.cursors).toEqual([]);
    });

    it('should handle clearing empty array', () => {
      const { result } = renderHook(() => useMultipleCursors());

      act(() => {
        result.current.clearCursors();
      });

      expect(result.current.cursors).toEqual([]);
    });

    it('should allow adding cursors after clearing', () => {
      const { result } = renderHook(() => useMultipleCursors([
        { type: CursorType.Standard, color: '#ff0000', alpha: 0.5, follow: false },
      ]));

      act(() => {
        result.current.clearCursors();
        result.current.addCursor({
          type: CursorType.ThinLeft,
          color: '#00ff00',
          alpha: 0.7,
          follow: true,
        });
      });

      expect(result.current.cursors).toHaveLength(1);
      expect(result.current.cursors[0].type).toBe(CursorType.ThinLeft);
    });
  });
});

describe('createDefaultCursor', () => {
  it('should create cursor with default values', () => {
    const cursor = createDefaultCursor();

    expect(cursor).toEqual({
      type: CursorType.Standard,
      color: '#33e02f',
      alpha: 0.5,
      follow: false,
    });
  });

  it('should override default values', () => {
    const cursor = createDefaultCursor({
      type: CursorType.ThinLeft,
      color: '#ff0000',
    });

    expect(cursor).toEqual({
      type: CursorType.ThinLeft,
      color: '#ff0000',
      alpha: 0.5,
      follow: false,
    });
  });

  it('should override all properties', () => {
    const cursor = createDefaultCursor({
      type: CursorType.CurrentArea,
      color: '#0000ff',
      alpha: 1.0,
      follow: true,
    });

    expect(cursor).toEqual({
      type: CursorType.CurrentArea,
      color: '#0000ff',
      alpha: 1.0,
      follow: true,
    });
  });

  it('should preserve unspecified defaults', () => {
    const cursor = createDefaultCursor({ alpha: 0.8 });

    expect(cursor.type).toBe(CursorType.Standard);
    expect(cursor.color).toBe('#33e02f');
    expect(cursor.alpha).toBe(0.8);
    expect(cursor.follow).toBe(false);
  });
});