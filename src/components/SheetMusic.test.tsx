import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import { SheetMusic } from './SheetMusic';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { OSMDOptions } from '../types';

vi.mock('opensheetmusicdisplay');

describe('SheetMusic', () => {
  let mockOSMDInstance: any;

  beforeEach(() => {
    mockOSMDInstance = {
      load: vi.fn().mockResolvedValue(undefined),
      render: vi.fn(),
      renderAndScrollBack: vi.fn(),
      updateGraphic: vi.fn(),
      clear: vi.fn(),
      setOptions: vi.fn(),
      IsReadyToRender: vi.fn().mockReturnValue(true),
      zoom: 1,
      cursor: {
        show: vi.fn(),
        hide: vi.fn(),
        next: vi.fn(),
        previous: vi.fn(),
        nextMeasure: vi.fn(),
        previousMeasure: vi.fn(),
        reset: vi.fn(),
        resetIterator: vi.fn(),
        update: vi.fn(),
        Hidden: false,
        SkipInvisibleNotes: false,
      },
    };

    (OpenSheetMusicDisplay as any).mockImplementation(() => mockOSMDInstance);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render container', () => {
      render(<SheetMusic />);

      const container = screen.getByTestId('sheet-music-container');
      expect(container).toBeInTheDocument();
    });

    it('should apply className', () => {
      render(<SheetMusic className="test-class" />);

      const container = screen.getByTestId('sheet-music-container');
      expect(container).toHaveClass('test-class');
    });

    it('should apply style', () => {
      const style = { width: '100%', height: '500px' };
      render(<SheetMusic style={style} />);

      const container = screen.getByTestId('sheet-music-container');
      expect(container).toHaveStyle(style);
    });

    it('should apply both className and style', () => {
      const style = { width: '500px', height: '400px' };
      render(<SheetMusic className="custom-class" style={style} />);

      const container = screen.getByTestId('sheet-music-container');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveStyle({ width: '500px' });
      expect(container).toHaveStyle({ height: '400px' });
    });
  });

  describe('Options', () => {
    it('should pass options to OSMD', () => {
      const options: OSMDOptions = {
        backend: 'svg',
        drawTitle: true,
      };

      render(<SheetMusic options={options} />);

      expect(OpenSheetMusicDisplay).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          ...options,
          autoResize: true, // default
        })
      );
    });

    it('should enable autoResize by default', () => {
      render(<SheetMusic />);

      expect(OpenSheetMusicDisplay).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ autoResize: true })
      );
    });

    it('should respect autoResize prop', () => {
      render(<SheetMusic autoResize={false} />);

      expect(OpenSheetMusicDisplay).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ autoResize: false })
      );
    });

    it('should merge options with autoResize', () => {
      const options: OSMDOptions = {
        drawTitle: false,
        backend: 'canvas',
      };

      render(<SheetMusic options={options} autoResize={false} />);

      expect(OpenSheetMusicDisplay).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          ...options,
          autoResize: false,
        })
      );
    });
  });

  describe('Loading from File', () => {
    it('should load music from file path', async () => {
      render(<SheetMusic file="test.musicxml" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledWith('test.musicxml', undefined);
        expect(mockOSMDInstance.render).toHaveBeenCalled();
      });
    });

    it('should load music from Document object', async () => {
      const doc = new DOMParser().parseFromString('<xml/>', 'text/xml');
      render(<SheetMusic file={doc} />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledWith(doc, undefined);
      });
    });

    it('should load music from Blob', async () => {
      const blob = new Blob(['<xml/>'], { type: 'text/xml' });
      render(<SheetMusic file={blob} />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledWith(blob, undefined);
      });
    });

    it('should call onLoad callback on successful load', async () => {
      const onLoad = vi.fn();
      render(<SheetMusic file="test.musicxml" onLoad={onLoad} />);

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalledWith(mockOSMDInstance);
      });
    });

    it('should call onError callback on load failure', async () => {
      const error = new Error('Load failed');
      mockOSMDInstance.load.mockRejectedValueOnce(error);

      const onError = vi.fn();
      render(<SheetMusic file="test.musicxml" onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('Loading from MusicXML String', () => {
    const musicXML = '<?xml version="1.0"?><score-partwise></score-partwise>';

    it('should load music from musicXML string', async () => {
      render(<SheetMusic musicXML={musicXML} />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalled();
        expect(mockOSMDInstance.render).toHaveBeenCalled();
      });
    });

    it('should parse musicXML as Document', async () => {
      render(<SheetMusic musicXML={musicXML} />);

      await waitFor(() => {
        const callArg = mockOSMDInstance.load.mock.calls[0][0];
        expect(callArg).toBeInstanceOf(Document);
      });
    });

    it('should call onLoad with musicXML', async () => {
      const onLoad = vi.fn();
      render(<SheetMusic musicXML={musicXML} onLoad={onLoad} />);

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalledWith(mockOSMDInstance);
      });
    });

    it('should call onError on musicXML load failure', async () => {
      mockOSMDInstance.load.mockRejectedValueOnce(new Error('Parse error'));

      const onError = vi.fn();
      render(<SheetMusic musicXML={musicXML} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('Priority and Updates', () => {
    it('should prioritize musicXML over file', async () => {
      const musicXML = '<?xml version="1.0"?><score-partwise></score-partwise>';
      render(<SheetMusic file="test.musicxml" musicXML={musicXML} />);

      await waitFor(() => {
        const callArg = mockOSMDInstance.load.mock.calls[0][0];
        expect(callArg).toBeInstanceOf(Document);
      });
    });

    it('should not load if neither file nor musicXML provided', async () => {
      render(<SheetMusic />);

      await waitFor(
        () => {
          expect(mockOSMDInstance.load).not.toHaveBeenCalled();
        },
        { timeout: 100 }
      ).catch(() => {
        // Expected timeout
      });

      expect(mockOSMDInstance.load).not.toHaveBeenCalled();
    });

    it('should reload when file changes', async () => {
      const { rerender } = render(<SheetMusic file="test1.musicxml" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
      });

      mockOSMDInstance.load.mockClear();
      rerender(<SheetMusic file="test2.musicxml" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
        expect(mockOSMDInstance.load).toHaveBeenLastCalledWith('test2.musicxml', undefined);
      });
    });

    it('should reload when musicXML changes', async () => {
      const xml1 = '<?xml version="1.0"?><score-partwise id="1"></score-partwise>';
      const xml2 = '<?xml version="1.0"?><score-partwise id="2"></score-partwise>';

      const { rerender } = render(<SheetMusic musicXML={xml1} />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
      });

      mockOSMDInstance.load.mockClear();
      rerender(<SheetMusic musicXML={xml2} />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
      });
    });

    it('should not reload on unrelated prop changes', async () => {
      const { rerender } = render(
        <SheetMusic file="test.musicxml" className="class1" />
      );

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
      });

      rerender(<SheetMusic file="test.musicxml" className="class2" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Loading State', () => {
    it('should set loading data attribute', () => {
      render(<SheetMusic file="test.musicxml" />);

      const container = screen.getByTestId('sheet-music-container');
      expect(container).toHaveAttribute('data-loading');
    });

    it('should set error data attribute on error', async () => {
      mockOSMDInstance.load.mockRejectedValueOnce(new Error('Error'));
      render(<SheetMusic file="test.musicxml" />);

      await waitFor(() => {
        const container = screen.getByTestId('sheet-music-container');
        expect(container).toHaveAttribute('data-error', 'true');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle generic errors', async () => {
      mockOSMDInstance.load.mockRejectedValueOnce('String error');

      const onError = vi.fn();
      render(<SheetMusic file="test.musicxml" onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
        const errorArg = onError.mock.calls[0][0];
        expect(errorArg).toBeInstanceOf(Error);
        expect(errorArg.message).toBe('Failed to load music');
      });
    });

    it('should call onError multiple times for repeated errors', async () => {
      const onError = vi.fn();
      mockOSMDInstance.load.mockRejectedValue(new Error('Error 1'));
      
      const { rerender } = render(<SheetMusic file="test1.musicxml" onError={onError} />);

      // Wait for first error
      await waitFor(() => expect(onError).toHaveBeenCalled());
      expect(onError.mock.calls.length).toBeGreaterThanOrEqual(1);

      mockOSMDInstance.load.mockClear();
      mockOSMDInstance.load.mockRejectedValueOnce(new Error('Error 2'));
      onError.mockClear();
      
      rerender(<SheetMusic file="test2.musicxml" onError={onError} />);

      await waitFor(() => expect(onError).toHaveBeenCalled());
      expect(onError.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle OSMD initialization failure gracefully', () => {
      (OpenSheetMusicDisplay as any).mockImplementationOnce(() => {
        throw new Error('Init failed');
      });

      expect(() => render(<SheetMusic file="test.musicxml" />)).not.toThrow();
    });

    it('should not load empty file string', async () => {
      render(<SheetMusic file="" />);

      await waitFor(
        () => {
          expect(mockOSMDInstance.load).not.toHaveBeenCalled();
        },
        { timeout: 100 }
      ).catch(() => {});

      expect(mockOSMDInstance.load).not.toHaveBeenCalled();
    });

    it('should not load empty musicXML string', async () => {
      render(<SheetMusic musicXML="" />);

      await waitFor(
        () => {
          expect(mockOSMDInstance.load).not.toHaveBeenCalled();
        },
        { timeout: 100 }
      ).catch(() => {});

      expect(mockOSMDInstance.load).not.toHaveBeenCalled();
    });

    it('should not load twice on initial render', async () => {
      render(<SheetMusic file="test.musicxml" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Callbacks', () => {
    it('should not call onLoad if not provided', async () => {
      render(<SheetMusic file="test.musicxml" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalled();
      });
    });

    it('should not call onError if not provided', async () => {
      mockOSMDInstance.load.mockRejectedValueOnce(new Error('Error'));
      render(<SheetMusic file="test.musicxml" />);

      await waitFor(() => {
        expect(mockOSMDInstance.load).toHaveBeenCalled();
      });
    });

    it('should call onLoad only once per successful load', async () => {
      const onLoad = vi.fn();
      render(<SheetMusic file="test.musicxml" onLoad={onLoad} />);

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });
    });
  });
});
