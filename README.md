# react-opensheetmusic

A React renderer adapter for sheet music using OpenSheetMusicDisplay (OSMD). This library provides easy-to-use React components and hooks for rendering MusicXML sheet music in your React applications.

## Features

- 🎵 **Simple API** - Easy-to-use React component and hooks
- 🎯 **TypeScript Support** - Full type definitions included
- ✅ **Fully Testable** - Comprehensive test coverage with Vitest
- ⚡ **Flexible** - Use as component or hook for custom implementations
- 🎨 **Customizable** - Pass any OSMD options for full control
- 📦 **Small Bundle** - Optimized bundle size with tree-shaking

## Installation

```bash
npm install react-opensheetmusic opensheetmusicdisplay react react-dom
```

or

```bash
yarn add react-opensheetmusic opensheetmusicdisplay react react-dom
```

## Usage

### Basic Component Usage

```tsx
import { SheetMusic } from 'react-opensheetmusic';

function App() {
  return (
    <SheetMusic
      file="/path/to/musicxml.xml"
      options={{
        autoResize: true,
        backend: 'svg',
        drawTitle: true,
      }}
    />
  );
}
```

### Using MusicXML String

```tsx
import { SheetMusic } from 'react-opensheetmusic';

const musicXML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <!-- Your MusicXML content -->
</score-partwise>`;

function App() {
  return <SheetMusic musicXML={musicXML} />;
}
```

### Advanced Usage with Hook

```tsx
import { useRef } from 'react';
import { useOSMD } from 'react-opensheetmusic';

function CustomSheetMusic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { osmd, load, zoom, cursor } = useOSMD(containerRef, {
    autoResize: true,
    backend: 'svg',
  });

  const handleLoad = async () => {
    await load('/path/to/music.xml');
  };

  const handleZoomIn = () => {
    zoom(1.2);
  };

  const handleNext = () => {
    cursor.show();
    cursor.next();
  };

  return (
    <div>
      <button onClick={handleLoad}>Load Music</button>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleNext}>Next Note</button>
      <div ref={containerRef} />
    </div>
  );
}
```

## API Reference

### `<SheetMusic />` Component

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `file` | `string \| Document` | Path to MusicXML file or Document object |
| `musicXML` | `string` | MusicXML content as string |
| `options` | `OSMDOptions` | Configuration options for OSMD |
| `onLoad` | `(osmd: OpenSheetMusicDisplay) => void` | Callback when music is loaded |
| `onError` | `(error: Error) => void` | Callback when error occurs |
| `className` | `string` | CSS class name |
| `style` | `React.CSSProperties` | Inline styles |

### `useOSMD()` Hook

```tsx
const {
  osmd,      // OSMD instance
  isLoading, // Loading state
  error,     // Error state
  load,      // Load music function
  render,    // Re-render function
  clear,     // Clear music function
  zoom,      // Zoom function
  cursor,    // Cursor controls
} = useOSMD(containerRef, options);
```

#### Returns

- `osmd`: OpenSheetMusicDisplay instance
- `isLoading`: Boolean indicating loading state
- `error`: Error object if loading failed
- `load(file)`: Async function to load MusicXML
- `render()`: Async function to re-render
- `clear()`: Function to clear the sheet music
- `zoom(scale)`: Function to zoom in/out
- `cursor`: Object with cursor controls
  - `show()`: Show cursor
  - `hide()`: Hide cursor
  - `next()`: Move to next note
  - `previous()`: Move to previous note
  - `reset()`: Reset cursor position

### `OSMDOptions` Type

```tsx
interface OSMDOptions {
  autoResize?: boolean;
  backend?: 'svg' | 'canvas';
  drawTitle?: boolean;
  drawSubtitle?: boolean;
  drawComposer?: boolean;
  drawLyricist?: boolean;
  drawCredits?: boolean;
  drawPartNames?: boolean;
  drawPartAbbreviations?: boolean;
  drawMeasureNumbers?: boolean;
  drawTimeSignatures?: boolean;
  drawMetronomeMarks?: boolean;
  drawFingerings?: boolean;
  // ... and more OSMD options
}
```

## Development

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Testing

This library is fully testable. The test suite includes:

- Unit tests for hooks
- Component integration tests
- Mock utilities for OSMD

Example test:

```tsx
import { render } from '@testing-library/react';
import { SheetMusic } from 'react-opensheetmusic';

test('renders sheet music', () => {
  const { container } = render(<SheetMusic file="test.xml" />);
  expect(container.firstChild).toBeInTheDocument();
});
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Built on top of [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay).
