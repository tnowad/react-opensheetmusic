import { useState, useCallback } from 'react';

export interface PageFormat {
  width: number;
  height: number;
  idString: string;
  isInfinite?: boolean;
}

export const PageFormats: { [key: string]: PageFormat } = {
  A3_L: { width: 420, height: 297, idString: 'A3_L' },
  A3_P: { width: 297, height: 420, idString: 'A3_P' },
  A4_L: { width: 297, height: 210, idString: 'A4_L' },
  A4_P: { width: 210, height: 297, idString: 'A4_P' },
  A5_L: { width: 210, height: 148, idString: 'A5_L' },
  A5_P: { width: 148, height: 210, idString: 'A5_P' },
  A6_L: { width: 148, height: 105, idString: 'A6_L' },
  A6_P: { width: 105, height: 148, idString: 'A6_P' },
  Letter_L: { width: 279.4, height: 215.9, idString: 'Letter_L' },
  Letter_P: { width: 215.9, height: 279.4, idString: 'Letter_P' },
  Endless: { width: 210, height: 10000, idString: 'Endless', isInfinite: true },
};

export interface UsePageFormatOptions {
  initialFormat?: string | PageFormat;
}

export interface UsePageFormatResult {
  format: PageFormat;
  setFormat: (format: string | PageFormat) => void;
  setCustomFormat: (width: number, height: number, id?: string) => void;
  formatId: string;
}

export const usePageFormat = (
  options: UsePageFormatOptions = {}
): UsePageFormatResult => {
  const getInitialFormat = (): PageFormat => {
    if (!options.initialFormat) {
      return PageFormats.Endless;
    }
    if (typeof options.initialFormat === 'string') {
      return PageFormats[options.initialFormat] || PageFormats.Endless;
    }
    return options.initialFormat;
  };

  const [format, setFormatState] = useState<PageFormat>(getInitialFormat());

  const setFormat = useCallback((newFormat: string | PageFormat) => {
    if (typeof newFormat === 'string') {
      setFormatState(PageFormats[newFormat] || PageFormats.Endless);
    } else {
      setFormatState(newFormat);
    }
  }, []);

  const setCustomFormat = useCallback((width: number, height: number, id?: string) => {
    setFormatState({
      width,
      height,
      idString: id !== undefined ? id : `Custom_${width}x${height}`,
      isInfinite: false,
    });
  }, []);

  return {
    format,
    setFormat,
    setCustomFormat,
    formatId: format.idString,
  };
};