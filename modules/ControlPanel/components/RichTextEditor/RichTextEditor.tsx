// modules/ControlPanel/components/RichTextEditor/RichTextEditor.tsx
import React, {
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
  memo,
  useMemo,
} from "react";
import Toolbar from "./Toolbar";
import { RichTextEditorProps } from "./types/types";
import {
  useEditorHistory,
  useFormattingState,
  useHighlightStyles,
  useTextColors,
} from "./hooks/hooks";
import { execFormatCommand } from "./utils/utils";
import { HIGHLIGHT_SPAN_TAG, HIGHLIGHT_ATTR } from "./constants/constants";
import { generateUniqueId as utilGenerateUniqueId } from "./utils/utils";
import { useBrandContext } from "@/contexts/BrandContext";

const RichTextEditor: React.FC<RichTextEditorProps> = memo(
  ({
    initialContent = "",
    onContentChange,
    fieldName = "",
    height = "80px",
    isToolbarVisible = true,
  }) => {
    const {
      state: {
        brand: {
          config: {
            colors: { primaryColor, secondaryColor, highlightColor },
          },
        },
      },
    } = useBrandContext();
    const editorRef = useRef<HTMLDivElement | null>(null);

    const [history, stageHistorySave, handleUndo, handleRedo, isUndoRedo] =
      useEditorHistory(initialContent);
    const [formattingState, updateFormattingState] =
      useFormattingState(editorRef);

    const handleContentChange = useCallback(() => {
      if (editorRef.current && onContentChange) {
        onContentChange(editorRef.current.innerHTML, fieldName);
      }
    }, [onContentChange, fieldName]);

    const handleEditorInput = useCallback(() => {
      if (editorRef.current) {
        // Do not save to history immediately on input if isUndoRedo is true
        // The history save is now deferred in useEditorHistory's stageHistorySave
        if (!isUndoRedo) {
          stageHistorySave(editorRef.current.innerHTML);
        }
        handleContentChange();
        updateFormattingState();
      }
    }, [
      stageHistorySave,
      handleContentChange,
      updateFormattingState,
      isUndoRedo,
    ]);

    const execCommand = useCallback(
      (command: string, value: string | null = null) => {
        // Pass handleEditorInput which now correctly defers history saving during undo/redo
        execFormatCommand(command, value, editorRef, handleEditorInput);
      },
      [handleEditorInput] // handleEditorInput includes isUndoRedo dependency indirectly via stageHistorySave
    );

    const toggleBold = useCallback(() => execCommand("bold"), [execCommand]);
    const toggleItalic = useCallback(
      () => execCommand("italic"),
      [execCommand]
    );
    const toggleUnderline = useCallback(
      () => execCommand("underline"),
      [execCommand]
    );

    const { cycleTextColor, currentTextColor } = useTextColors(
      editorRef,
      primaryColor,
      secondaryColor,
      highlightColor,
      handleEditorInput
    );

    const { cycleHighlight, resetFormatting } = useHighlightStyles(
      editorRef,
      primaryColor,
      secondaryColor,
      highlightColor,
      handleEditorInput
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const cmdKey = e.ctrlKey || e.metaKey;

        if (cmdKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (
          (cmdKey && e.key.toLowerCase() === "y") ||
          (cmdKey && e.shiftKey && e.key.toLowerCase() === "z")
        ) {
          e.preventDefault();
          handleRedo();
        } else if (cmdKey && e.key.toLowerCase() === "b") {
          e.preventDefault();
          toggleBold();
        } else if (cmdKey && e.key.toLowerCase() === "i") {
          e.preventDefault();
          toggleItalic();
        } else if (cmdKey && e.key.toLowerCase() === "u") {
          e.preventDefault();
          toggleUnderline();
        }
      },
      [handleUndo, handleRedo, toggleBold, toggleItalic, toggleUnderline]
    );

    useEffect(() => {
      if (isUndoRedo && editorRef.current) {
        const content = history.items[history.index];
        if (
          typeof content === "string" &&
          editorRef.current.innerHTML !== content
        ) {
          editorRef.current.innerHTML = content;
          // After setting innerHTML, the selection is often lost or reset.
          // We need to restore it, typically to the end of the content.
          // This also triggers handleContentChange and updateFormattingState.
          handleContentChange(); // Notify parent of the change
          updateFormattingState(); // Update formatting buttons

          // Restore cursor position after DOM update
          setTimeout(() => {
            if (editorRef.current) {
              const selection = window.getSelection();
              if (selection) {
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false); // false to collapse to the end
                selection.removeAllRanges();
                selection.addRange(range);
              }
              editorRef.current.focus(); // Ensure editor has focus
            }
          }, 0);
        }
      }
    }, [isUndoRedo, history, handleContentChange, updateFormattingState]); // Added handleContentChange & updateFormattingState

    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
    }, [initialContent]);

    // useEffect(() => {
    //   if (editorRef.current) {
    //     editorRef.current.style.fontFamily = primaryFont || "sans-serif";
    //   }
    // }, [primaryFont]);

    const editorUniqueClass = useMemo(
      () => `rte-instance-${utilGenerateUniqueId("uid")}`,
      []
    );
    const cssOverrides = useMemo(
      () => `
      .${editorUniqueClass} ${HIGHLIGHT_SPAN_TAG}[${HIGHLIGHT_ATTR}="true"] {
        background-image: none !important;
        background-color: transparent !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 solid transparent !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        text-decoration: none !important;
        color: inherit !important;
        box-decoration-break: initial !important;
        -webkit-box-decoration-break: initial !important;
      }
      .${editorUniqueClass} ${HIGHLIGHT_SPAN_TAG}[${HIGHLIGHT_ATTR}="true"].border-b-4 {
        border-bottom-width: 0 !important;
      }
      .${editorUniqueClass} ${HIGHLIGHT_SPAN_TAG}[${HIGHLIGHT_ATTR}="true"].border-2 {
        border-width: 0 !important;
      }
      .${editorUniqueClass} font[color] {
        color: inherit !important;
        background-color: transparent !important;
      }
    `,
      [editorUniqueClass]
    );

    return (
      <>
        <style>{cssOverrides}</style>
        <div
          className={`w-full mx-auto bg-white rounded-lg border border-gray-200 shadow-sm ${editorUniqueClass}`}
        >
          <div
            ref={editorRef}
            className="w-full p-3 outline-none focus:ring-2 focus:ring-blue-200 transition-shadow duration-150"
            style={{ minHeight: isToolbarVisible ? height : "" }}
            contentEditable="true"
            onInput={handleEditorInput}
            onKeyDown={handleKeyDown}
            onBlur={handleContentChange}
            suppressContentEditableWarning={true}
            role="textbox"
            aria-multiline="true"
            aria-label={fieldName || "Rich Text Editor Content"}
          ></div>
          {isToolbarVisible && (
            <Toolbar
              formatting={formattingState}
              currentTextColor={currentTextColor}
              onBold={toggleBold}
              onItalic={toggleItalic}
              onUnderline={toggleUnderline}
              onCycleTextColor={cycleTextColor}
              onCycleHighlight={cycleHighlight}
              onResetFormatting={resetFormatting}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={history.index > 0}
              canRedo={history.index < history.items.length - 1}
            />
          )}
        </div>
      </>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
