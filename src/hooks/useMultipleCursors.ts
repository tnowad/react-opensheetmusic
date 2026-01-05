import { useState, useCallback } from 'react';
import { CursorOptions, CursorType } from '../types';

export interface UseMultipleCursorsOptions {
  cursors?: CursorOptions[];
}

export interface UseMultipleCursorsResult {
  cursors: CursorOptions[];
  addCursor: (cursor: CursorOptions) => void;
  removeCursor: (index: number) => void;
  updateCursor: (index: number, cursor: Partial<CursorOptions>) => void;
  clearCursors: () => void;
}

export const useMultipleCursors = (
  initialCursors: CursorOptions[] = []
): UseMultipleCursorsResult => {
  const [cursors, setCursors] = useState<CursorOptions[]>(initialCursors);

  const addCursor = useCallback((cursor: CursorOptions) => {
    setCursors((prev) => [...prev, cursor]);
  }, []);

  const removeCursor = useCallback((index: number) => {
    setCursors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateCursor = useCallback((index: number, update: Partial<CursorOptions>) => {
    setCursors((prev) =>
      prev.map((cursor, i) => (i === index ? { ...cursor, ...update } : cursor))
    );
  }, []);

  const clearCursors = useCallback(() => {
    setCursors([]);
  }, []);

  return {
    cursors,
    addCursor,
    removeCursor,
    updateCursor,
    clearCursors,
  };
};

export const createDefaultCursor = (
  overrides: Partial<CursorOptions> = {}
): CursorOptions => ({
  type: CursorType.Standard,
  color: '#33e02f',
  alpha: 0.5,
  follow: false,
  ...overrides,
});