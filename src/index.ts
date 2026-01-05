export { SheetMusic } from './components/SheetMusic';
export { useOSMD } from './hooks/useOSMD';
export { useMultipleCursors, createDefaultCursor } from './hooks/useMultipleCursors';
export { useColoring } from './hooks/useColoring';
export { usePageFormat, PageFormats } from './hooks/usePageFormat';

export type {
  OSMDOptions,
  SheetMusicProps,
  UseOSMDOptions,
  UseOSMDResult,
  CursorOptions,
  CursorControl,
  AutoBeamOptions,
  PageFormat,
  DrawingParameters,
} from './types';

export {
  BackendType,
  ColoringMode,
  AlignRestOption,
  CursorType,
  FontStyles,
  FillEmptyMeasuresWithWholeRests,
} from './types';
