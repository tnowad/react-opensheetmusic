import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

// Enums matching OSMD
export enum BackendType {
  SVG = 'svg',
  Canvas = 'canvas',
}

export enum ColoringMode {
  XML = 0,
  Boomwhacker = 1,
  CustomColorSet = 2,
}

export enum AlignRestOption {
  Never = 0,
  Always = 1,
  Auto = 2,
}

export enum CursorType {
  Standard = 0,
  ThinLeft = 1,
  ShortThinTopLeft = 2,
  CurrentArea = 3,
  CurrentAreaLeft = 4,
}

export enum FontStyles {
  Regular = 0,
  Bold = 1,
  Italic = 2,
  BoldItalic = 3,
}

export enum FillEmptyMeasuresWithWholeRests {
  No = 0,
  YesVisible = 1,
  YesInvisible = 2,
}

// Cursor Options
export interface CursorOptions {
  type: CursorType;
  color: string;
  alpha: number;
  follow: boolean;
}

// Auto Beam Options
export interface AutoBeamOptions {
  beam_rests?: boolean;
  beam_middle_rests_only?: boolean;
  maintain_stem_directions?: boolean;
  // OSMD expects a tuple-like groups type (e.g. [[3,4],[1,4]]). Allow both tuple and array forms for compatibility.
  groups?: [number[]] | number[][];
}

// Complete OSMD Options Interface
export interface OSMDOptions {
  // Backend & Display
  backend?: BackendType | string;
  autoResize?: boolean;
  pageFormat?: string;
  pageBackgroundColor?: string;
  renderSingleHorizontalStaffline?: boolean;

  // Layout & Drawing Parameters
  drawingParameters?: string;
  spacingFactorSoftmax?: number;
  spacingBetweenTextLines?: number;
  stretchLastSystemLine?: boolean;
  newSystemFromXML?: boolean;
  newPageFromXML?: boolean;
  newSystemFromNewPageInXML?: boolean;

  // Content Display - Credits
  drawCredits?: boolean;
  drawTitle?: boolean;
  drawSubtitle?: boolean;
  drawComposer?: boolean;
  drawLyricist?: boolean;

  // Content Display - Musical Elements
  drawPartNames?: boolean;
  drawPartAbbreviations?: boolean;
  drawMeasureNumbers?: boolean;
  drawTimeSignatures?: boolean;
  drawMetronomeMarks?: boolean;
  drawLyrics?: boolean;
  drawSlurs?: boolean;
  drawFingerings?: boolean;
  fingeringPosition?: string;
  fingeringInsideStafflines?: boolean;

  // Selective Drawing
  drawFromMeasureNumber?: number;
  drawUpToMeasureNumber?: number;
  drawUpToSystemNumber?: number;
  drawUpToPageNumber?: number;
  fillEmptyMeasuresWithWholeRest?: FillEmptyMeasuresWithWholeRests | number;

  // Coloring
  coloringMode?: ColoringMode | number;
  coloringEnabled?: boolean;
  coloringSetCustom?: string[];
  colorStemsLikeNoteheads?: boolean;
  darkMode?: boolean;
  defaultColorMusic?: string;
  defaultColorNotehead?: string;
  defaultColorStem?: string;
  defaultColorRest?: string;
  defaultColorLabel?: string;
  defaultColorTitle?: string;

  // Typography
  defaultFontFamily?: string;
  defaultFontStyle?: FontStyles | number;

  // Beaming & Tuplets
  autoBeam?: boolean;
  autoBeamOptions?: AutoBeamOptions;
  tupletsRatioed?: boolean;
  tupletsBracketed?: boolean;
  tripletsBracketed?: boolean;
  alignRests?: AlignRestOption | number;

  // Percussion & Instruments
  percussionOneLineCutoff?: number;
  percussionForceVoicesOneLineCutoff?: number;

  // Note & Stem Control
  setWantedStemDirectionByXml?: boolean;
  useXMLMeasureNumbers?: boolean;
  measureNumberInterval?: number;
  drawMeasureNumbersOnlyAtSystemStart?: boolean;

  // Multi-Measure Rests
  autoGenerateMultipleRestMeasuresFromRestMeasures?: boolean;

  // Cursor & Interaction
  disableCursor?: boolean;
  followCursor?: boolean;
  cursorsOptions?: CursorOptions[];

  // Advanced
  onXMLRead?: (xml: string) => string;
  preferredSkyBottomLineBatchCalculatorBackend?: number;
  skyBottomLineBatchMinMeasures?: number;
}

// Cursor Control Interface
export interface CursorControl {
  show: () => void;
  hide: () => void;
  next: () => void;
  previous: () => void;
  nextMeasure: () => void;
  previousMeasure: () => void;
  reset: () => void;
  resetIterator: () => void;
  update: () => void;
  hidden: boolean;
  skipInvisibleNotes: boolean;
}

// Sheet Music Component Props
export interface SheetMusicProps {
  file?: string | Document | Blob;
  musicXML?: string;
  options?: OSMDOptions;
  onLoad?: (osmd: OpenSheetMusicDisplay) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  autoResize?: boolean;
}

// Hook Options
export interface UseOSMDOptions extends OSMDOptions {
  autoLoad?: boolean;
}

// Hook Result
export interface UseOSMDResult {
  osmd: OpenSheetMusicDisplay | null;
  isLoading: boolean;
  error: Error | null;
  load: (file: string | Document | Blob, title?: string) => Promise<void>;
  render: () => void;
  renderAndScrollBack: () => void;
  updateGraphic: () => void;
  clear: () => void;
  setOptions: (options: OSMDOptions) => void;
  zoom: number;
  setZoom: (scale: number) => void;
  cursor: CursorControl;
  isReadyToRender: () => boolean;
}

// Page Format Type
export interface PageFormat {
  width: number;
  height: number;
  idString: string;
  isInfinite: boolean;
}

// Drawing Parameters Access
export interface DrawingParameters {
  // Add specific drawing parameters if needed
  [key: string]: unknown;
}
