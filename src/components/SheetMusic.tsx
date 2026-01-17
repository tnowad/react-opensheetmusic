/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { useOSMD } from '../hooks/useOSMD';
import { SheetMusicProps } from '../types';

export const SheetMusic: React.FC<SheetMusicProps> = ({
  file,
  musicXML,
  options = {},
  onLoad,
  onError,
  className,
  style,
  autoResize = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { osmd, isLoading, error, load } = useOSMD(containerRef, {
    ...options,
    autoResize,
  });
  const prevFileRef = useRef<string | Document | Blob | undefined>();
  const prevMusicXMLRef = useRef<string | undefined>();

  useEffect(() => {
    if (!osmd) return;

    // Check if file or musicXML has actually changed
    const fileChanged = file !== prevFileRef.current;
    const xmlChanged = musicXML !== prevMusicXMLRef.current;

    if (!fileChanged && !xmlChanged) return;

    // Don't load if both are empty/undefined
    if (!file && !musicXML) return;

    const loadMusic = async () => {
      try {
        let source: string | Document | Blob;

        if (musicXML) {
          // Only process non-empty musicXML
          if (musicXML.trim() === '') return;
          const parser = new DOMParser();
          source = parser.parseFromString(musicXML, 'text/xml');
          prevMusicXMLRef.current = musicXML;
        } else if (file) {
          // Only process truthy files (including empty string '' which is truthy)
          if (file === '') return;
          source = file;
          prevFileRef.current = file;
        } else {
          return;
        }

        await load(source);
        onLoad?.(osmd);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load music');
        onError?.(error);
      }
    };

    loadMusic();
  }, [osmd, file, musicXML, load, onLoad, onError]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      data-testid="sheet-music-container"
      data-loading={isLoading}
      data-error={!!error}
    />
  );
};
