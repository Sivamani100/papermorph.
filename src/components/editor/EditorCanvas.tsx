import React, { useRef, useEffect, useCallback } from 'react';
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from '@syncfusion/ej2-react-documenteditor';

// Inject Toolbar module
DocumentEditorContainerComponent.Inject(Toolbar);

interface EditorCanvasProps {
  editorRef: React.RefObject<DocumentEditorContainerComponent | null>;
  onContentChange: () => void;
  onReady: () => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  editorRef,
  onContentChange,
  onReady,
}) => {
  return (
    <div className="editor-canvas">
      <div className="editor-placeholder">
        Start typing your document here...
      </div>
      <DocumentEditorContainerComponent
        ref={editorRef}
        id="documentEditor"
        style={{ display: 'block', height: '100%' }}
        enableToolbar={false}
        showPropertiesPane={false}
        enableLocalPaste={true}
        enableSpellCheck={false}
        enableComment={true}
        enableTrackChanges={true}
        created={onReady}
        contentChange={onContentChange}
      />
    </div>
  );
};

export default EditorCanvas;
