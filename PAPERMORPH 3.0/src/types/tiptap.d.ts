import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setPageBreak: {
      setPageBreak: () => ReturnType;
    };
  }
}
