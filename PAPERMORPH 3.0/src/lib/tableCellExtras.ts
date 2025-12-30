import TableCell from '@tiptap/extension-table-cell';

export const TableCellExtended = TableCell.extend({
  name: 'tableCell',
  addAttributes() {
    const parent = TableCell.config?.addAttributes ? TableCell.config.addAttributes() : {};
    return {
      ...parent,
      background: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.backgroundColor || null,
        renderHTML: (attrs: any) => {
          if (!attrs || !attrs.background) return {};
          return { style: `background-color: ${attrs.background};` };
        },
      },
      colwidth: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.width || null,
        renderHTML: (attrs: any) => {
          if (!attrs || !attrs.colwidth) return {};
          return { style: `width: ${attrs.colwidth};` };
        },
      },
    };
  },
});

export default TableCellExtended;
