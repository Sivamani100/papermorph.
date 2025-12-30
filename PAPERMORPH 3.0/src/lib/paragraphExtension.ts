import { Extension } from '@tiptap/core';

/**
 * Custom Paragraph Extension for advanced margin and spacing controls
 * Supports:
 * - Line height (line spacing)
 * - Letter spacing (word/character spacing)
 * 
 * Note: Page margins (top/bottom/left/right) are applied globally to the document
 * via the container div, not to individual paragraphs to prevent text overlay issues
 */
export const ParagraphSpacing = Extension.create({
  name: 'paragraphSpacing',
  
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => {
              const style = element.getAttribute('style');
              if (!style) return null;
              const match = style.match(/line-height:\s*([^;]+)/);
              return match ? match[1] : null;
            },
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {};
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
          letterSpacing: {
            default: null,
            parseHTML: element => {
              const style = element.getAttribute('style');
              if (!style) return null;
              const match = style.match(/letter-spacing:\s*([^;]+)/);
              return match ? match[1] : null;
            },
            renderHTML: attributes => {
              if (!attributes.letterSpacing) return {};
              return {
                style: `letter-spacing: ${attributes.letterSpacing}`,
              };
            },
          },
          wordSpacing: {
            default: null,
            parseHTML: element => {
              const style = element.getAttribute('style');
              if (!style) return null;
              const match = style.match(/word-spacing:\s*([^;]+)/);
              return match ? match[1] : null;
            },
            renderHTML: attributes => {
              if (!attributes.wordSpacing) return {};
              return {
                style: `word-spacing: ${attributes.wordSpacing}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight: (value: string | null) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { lineHeight: value });
      },
      setLetterSpacing: (value: string | null) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { letterSpacing: value });
      },
      setWordSpacing: (value: string | null) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { wordSpacing: value });
      },
    };
  },
});

export default ParagraphSpacing;
