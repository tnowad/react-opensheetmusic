import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import type { IOSMDOptions } from 'opensheetmusicdisplay';
import { UseOSMDOptions, UseOSMDResult, OSMDOptions, CursorControl } from '../types';

// Minimal local interface used for interacting with the OSMD instance in a safe, typed manner
type OSMDInstanceLike = Partial<OpenSheetMusicDisplay> & {
  load?: (file: string | Document | Blob, title?: string) => Promise<void>;
  setOptions?: (options: unknown) => void;
  cursor?: {
    Hidden?: boolean;
    SkipInvisibleNotes?: boolean;
    show?: () => void;
    hide?: () => void;
    next?: () => void;
    previous?: () => void;
    nextMeasure?: () => void;
    previousMeasure?: () => void;
    reset?: () => void;
    resetIterator?: () => void;
    update?: () => void;
  };
};

export const useOSMD = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialOptions: UseOSMDOptions = {}
): UseOSMDResult => {
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [zoomValue, setZoomValue] = useState(1);
  const initRef = useRef(false);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  // Initialize OSMD instance
  useEffect(() => {
    if (!containerRef.current || initRef.current) return;

    try {
      const instance = new OpenSheetMusicDisplay(containerRef.current, initialOptions as unknown as IOSMDOptions);
      osmdRef.current = instance;
      setOsmd(instance);
      setZoomValue(instance.zoom || 1);
      initRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize OSMD'));
      // Prevent retrying initialization on subsequent effect runs (keeps failing state deterministic for tests)
      initRef.current = true;
    }

    return () => {
      if (osmdRef.current) {
        try {
          osmdRef.current.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [containerRef, initialOptions]);

  // Load music file
  const load = useCallback(
    async (file: string | Document | Blob, title?: string) => {
      if (!osmdRef.current) {
        throw new Error('OSMD instance not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        await (osmdRef.current as unknown as OSMDInstanceLike).load?.(file, title);
        osmdRef.current?.render();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load music');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Render sheet music
  const render = useCallback(() => {
    if (!osmdRef.current) {
      throw new Error('OSMD instance not initialized');
    }
    osmdRef.current.render();
  }, []);

  // Render and scroll back
  const renderAndScrollBack = useCallback(() => {
    if (!osmdRef.current) {
      throw new Error('OSMD instance not initialized');
    }
    if (typeof osmdRef.current.renderAndScrollBack === 'function') {
      osmdRef.current.renderAndScrollBack();
    } else {
      osmdRef.current.render();
    }
  }, []);

  // Update graphic
  const updateGraphic = useCallback(() => {
    if (!osmdRef.current) {
      throw new Error('OSMD instance not initialized');
    }
    if (typeof osmdRef.current.updateGraphic === 'function') {
      osmdRef.current.updateGraphic();
    }
  }, []);

  // Clear sheet music
  const clear = useCallback(() => {
    if (osmdRef.current) {
      osmdRef.current.clear();
      setError(null);
    }
  }, []);

  // Set options dynamically
  const setOptions = useCallback((options: OSMDOptions) => {
    if (!osmdRef.current) {
      throw new Error('OSMD instance not initialized');
    }
    if (typeof (osmdRef.current as unknown as OSMDInstanceLike).setOptions === 'function') {
      (osmdRef.current as unknown as OSMDInstanceLike).setOptions?.(options);
    }
  }, []);

  // Set zoom level
  const setZoom = useCallback((scale: number) => {
    if (osmdRef.current) {
      osmdRef.current.zoom = scale;
      setZoomValue(scale);
      osmdRef.current.render();
    }
  }, []);

  // Check if ready to render
  const isReadyToRender = useCallback(() => {
    if (!osmdRef.current) {
      return false;
    }
    return typeof osmdRef.current.IsReadyToRender === 'function'
      ? osmdRef.current.IsReadyToRender()
      : true;
  }, []);

  // Cursor control object
  const cursor = useMemo<CursorControl>(
    () => ({
      show: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.show();
        }
      },
      hide: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.hide();
        }
      },
      next: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.next();
        }
      },
      previous: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.previous();
        }
      },
      nextMeasure: () => {
        if (osmdRef.current?.cursor && typeof osmdRef.current.cursor.nextMeasure === 'function') {
          osmdRef.current.cursor.nextMeasure();
        }
      },
      previousMeasure: () => {
        if (osmdRef.current?.cursor && typeof osmdRef.current.cursor.previousMeasure === 'function') {
          osmdRef.current.cursor.previousMeasure();
        }
      },
      reset: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.reset();
        }
      },
      resetIterator: () => {
        if (osmdRef.current?.cursor && typeof osmdRef.current.cursor.resetIterator === 'function') {
          osmdRef.current.cursor.resetIterator();
        }
      },
      update: () => {
        if (osmdRef.current?.cursor && typeof osmdRef.current.cursor.update === 'function') {
          osmdRef.current.cursor.update();
        }
      },
      get hidden() {
        return osmdRef.current?.cursor?.Hidden ?? true;
      },
      set hidden(value: boolean) {
        if (osmdRef.current?.cursor) {
          // OSMD exposes show() / hide() instead of a writable Hidden property
              if (value) {
            osmdRef.current.cursor.hide?.();
            // update underlying property if present (helps mocks and older OSMD versions)
            if ('Hidden' in (osmdRef.current.cursor ?? {})) {
              (osmdRef.current.cursor as { Hidden?: boolean }).Hidden = true;
            }
          } else {
            osmdRef.current.cursor.show?.();
            if ('Hidden' in (osmdRef.current.cursor ?? {})) {
              (osmdRef.current.cursor as { Hidden?: boolean }).Hidden = false;
            }
          }
        }
      },
      get skipInvisibleNotes() {
        return osmdRef.current?.cursor?.SkipInvisibleNotes ?? false;
      },
      set skipInvisibleNotes(value: boolean) {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.SkipInvisibleNotes = value;
        }
      },
    }),
    []
  );

  return {
    osmd,
    isLoading,
    error,
    load,
    render,
    renderAndScrollBack,
    updateGraphic,
    clear,
    setOptions,
    zoom: zoomValue,
    setZoom,
    cursor,
    isReadyToRender,
  };
};
