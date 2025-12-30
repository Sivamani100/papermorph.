import { create } from 'zustand';
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';

interface EditorStoreState {
  editor: DocumentEditorContainerComponent | null;
  contentRef: React.RefObject<HTMLDivElement> | null;
  setEditor: (editor: DocumentEditorContainerComponent | null) => void;
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
