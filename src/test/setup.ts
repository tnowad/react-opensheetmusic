import '@testing-library/jest-dom';

// Mock DOMParser for tests
if (typeof window !== 'undefined' && !window.DOMParser) {
  type DOMParserClass = new () => { parseFromString(str: string, _type?: string): Document };
  (global as unknown as { DOMParser?: DOMParserClass }).DOMParser = class DOMParser {
    parseFromString(str: string, _type?: string): Document {
      const doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = str;
      return doc as Document;
    }
  };
}
