import '@testing-library/jest-dom';

// Mock DOMParser for tests
if (typeof window !== 'undefined' && !window.DOMParser) {
  (global as any).DOMParser = class DOMParser {
    parseFromString(str: string, type: string): Document {
      const doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = str;
      return doc as any;
    }
  };
}
