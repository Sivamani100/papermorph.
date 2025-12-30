import { create } from 'zustand';
import { Editor } from '@tiptap/react';

interface EditorStoreState {
  editor: Editor | null;
  contentRef: React.RefObject<HTMLDivElement> | null;
  setEditor: (editor: Editor | null) => void;
  setContentRef: (ref: React.RefObject<HTMLDivElement>) => void;
  clearEditor: () => void;
}

export const useEditorStore = create<EditorStoreState>((set) => ({
  editor: null,
  contentRef: null,

  setEditor: (editor) => set({ editor }),

  setContentRef: (ref) => set({ contentRef: ref }),

  clearEditor: () => set({ editor: null, contentRef: null }),
}));
