// modules/ControlPanel/components/RichTextEditor/Toolbar.tsx
import React, { memo } from "react";
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Highlighter,
  Eraser,
} from "lucide-react";
import { FormattingState } from "./types/types";

interface ToolbarProps {
  formatting: FormattingState;
  currentTextColor: string;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onCycleTextColor: () => void;
  onCycleHighlight: () => void;
  onResetFormatting: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Divider component
const Divider = () => (
  <div className="h-5 w-px bg-gray-300 mx-1" aria-hidden="true"></div>
);

// Toolbar button component
interface ToolbarButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  ariaPressed?: boolean;
  ariaDisabled?: boolean;
  style?: React.CSSProperties;
}

const ToolbarButton = memo(
  ({
    children,
    onClick,
    title,
    active = false,
    disabled = false,
    ariaPressed,
    ariaDisabled,
    style,
  }: ToolbarButtonProps) => {
    return (
      <button
        type="button"
        className={`p-1.5 rounded ${
          active
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100"
        } transition-colors ${
          disabled ? "text-gray-300 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        title={title}
        aria-pressed={ariaPressed}
        aria-disabled={ariaDisabled}
        disabled={disabled}
        style={style}
      >
        {children}
      </button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

// Main toolbar component
const Toolbar = memo(
  ({
    formatting,
    currentTextColor,
    onBold,
    onItalic,
    onUnderline,
    onCycleTextColor,
    onCycleHighlight,
    onResetFormatting,
  }: // onUndo,
  // onRedo,
  // canUndo,
  // canRedo,
  ToolbarProps) => {
    return (
      <div
        className="border-t border-gray-200 bg-gray-50 rounded-b-lg relative"
        role="toolbar"
        aria-label="Text Formatting"
      >
        <div className="flex flex-wrap items-center px-3 py-1.5 gap-1">
          <ToolbarButton
            active={formatting.bold}
            onClick={onBold}
            title="Bold (Ctrl+B)"
            ariaPressed={formatting.bold}
          >
            <Bold size={16} />
          </ToolbarButton>

          <ToolbarButton
            active={formatting.italic}
            onClick={onItalic}
            title="Italic (Ctrl+I)"
            ariaPressed={formatting.italic}
          >
            <Italic size={16} />
          </ToolbarButton>

          <ToolbarButton
            active={formatting.underline}
            onClick={onUnderline}
            title="Underline (Ctrl+U)"
            ariaPressed={formatting.underline}
          >
            <Underline size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            onClick={onCycleTextColor}
            title="Cycle Text Color (Select Text First)"
            style={{
              color:
                currentTextColor &&
                currentTextColor.toLowerCase() !== "#ffffff" && // Check against white
                currentTextColor.toLowerCase() !== "rgb(255, 255, 255)" && // Check against rgb white
                currentTextColor.toLowerCase() !== "rgba(255, 255, 255, 1)" // Check against rgba white
                  ? currentTextColor
                  : "#6b7280", // Default icon color if text is white
            }}
          >
            <Palette
              size={16}
              strokeWidth={
                // Make stroke thinner if current color is perceived as white
                currentTextColor &&
                (currentTextColor.toLowerCase() === "#ffffff" ||
                  currentTextColor.toLowerCase() === "rgb(255, 255, 255)" ||
                  currentTextColor.toLowerCase() === "rgba(255, 255, 255, 1)")
                  ? 1.5
                  : 2
              }
            />
          </ToolbarButton>

          <ToolbarButton
            onClick={onCycleHighlight}
            title="Cycle Highlight (Select Text First)"
          >
            <Highlighter size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            onClick={onResetFormatting}
            title="Clear Formatting" // Title changed as it works without selection too
          >
            <Eraser size={16} />
          </ToolbarButton>
          <Divider />

          {/* <div>
            <ToolbarButton
              onClick={() => console.log("AI generation")}
              title="Enhance with AI" // this shows as tooltip on hover
            >
              <Sparkles className="w-[18px] h-[18px] mr-1 text-primary hover:text-[#157A73] transition-colors duration-200" />
            </ToolbarButton>
          </div> */}

          {/* undo redo future */}
          {/* <div className="flex items-center ml-auto pl-2">
            <ToolbarButton
              onClick={onUndo}
              title="Undo (Ctrl+Z)"
              disabled={!canUndo}
              ariaDisabled={!canUndo}
            >
              <RotateCcw size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={onRedo}
              title="Redo (Ctrl+Y)"
              disabled={!canRedo}
              ariaDisabled={!canRedo}
            >
              <RotateCw size={16} />
            </ToolbarButton>
          </div> */}
        </div>
      </div>
    );
  }
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
