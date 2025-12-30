import { Node } from '@tiptap/core';

/**
 * Page Break Extension for TipTap
 * Allows users to insert explicit page breaks that force content to the next page
 * Renders as a visible page break indicator in the editor
 */
export const PageBreak = Node.create({
  name: 'pageBreak',

  group: 'block',

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-page-break]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Render a dashed separator with a centered badge-label.
    // We return nested elements so the badge can be styled inline without external CSS.
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-page-break': 'true',
        class: 'page-break',
        style: `
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 22px 0;
          box-sizing: border-box;
          page-break-after: always;
          break-after: page;
        `,
      },
      // left line
      ['span', { style: 'flex:1;border-top:2px dashed rgba(153,153,153,0.9);height:1px;margin-right:8px;' }],
      // label
      ['span', { class: 'page-break-label', style: "background: rgba(0,0,0,0.75); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 11px; letter-spacing: 0.6px; font-weight: 600; text-transform: uppercase;" }, 'PAGE BREAK'],
      // right line
      ['span', { style: 'flex:1;border-top:2px dashed rgba(153,153,153,0.9);height:1px;margin-left:8px;' }],
    ];
  },

  addCommands(): any {
    return {
      setPageBreak:
        () =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // Ctrl+Enter or Cmd+Enter to insert page break
      'Mod-Enter': ({ editor }) => {
        editor.commands.insertContent({ type: 'pageBreak' });
        return true;
      },
    };
  },
});

export default PageBreak;
