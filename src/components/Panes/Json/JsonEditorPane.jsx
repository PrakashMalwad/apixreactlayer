import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultTabBinding } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { basicSetup } from "@codemirror/basic-setup";

// Define extensions outside the component to avoid recreating them on every render
const basicExtensions = [
  basicSetup,
  keymap.of([defaultTabBinding]),
  json(),
  EditorState.tabSize.of(2),
  EditorView.theme({
    "&": { height: "100%" }, // Ensure the editor fills the container
    ".cm-scroller": { overflow: "auto" }, // Ensure scrolling is enabled
  }),
];

export default function JsonEditorPanel({ paneValue, setPaneValue, isEditable = true }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null); // Store the editor instance

  // Initialize the editor
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    // Create the editor state
    const state = EditorState.create({
      doc: paneValue,
      extensions: [
        ...basicExtensions,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            if (newValue !== paneValue) {
              setPaneValue(newValue);
            }
          }
        }),
        EditorView.editable.of(isEditable),
      ],
    });

    // Initialize the editor
    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    // Cleanup on unmount
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [isEditable, setPaneValue]); // Only run once on mount and when isEditable changes

  // Update the editor content when paneValue changes
  useEffect(() => {
    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (currentDoc !== paneValue) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: paneValue },
        });
      }
    }
  }, [paneValue]); // Only update when paneValue changes

  return (
    <div
      ref={editorRef}
      className="border rounded p-2 h-50 overflow-hidden" 
    ></div>
  );
}

JsonEditorPanel.propTypes = {
  paneValue: PropTypes.string.isRequired,
  setPaneValue: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
};