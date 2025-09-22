// modules/ControlPanel/components/RichTextEditor/types.ts

export interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string, fieldName: string) => void;
  fieldName?: string;
  label?: string;
  height?: string;
  isToolbarVisible?: boolean;
}

// HighlightColor can be kept if needed elsewhere, but StyledHighlight is primary for current logic
export interface HighlightColor {
  name: string;
  color: string;
}

export interface StyledHighlight {
  name: string;
  color: string; // Main background color, 'transparent' for "None"
  padding?: string; // e.g., "1px 4px"
  borderRadius?: string; // e.g., "4px"
  borderBottom?: string; // For traditional underline styles
  textDecoration?: string; // For modern underline styles
  textDecorationThickness?: string;
  textDecorationSkipInk?: string;
  textUnderlineOffset?: string;
  backgroundImage?: string; // For gradient background effects
  display?: string; // To control display type
}

export interface FormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface EditorHistory {
  items: string[];
  index: number;
}

export interface TextColorState {
  index: number;
  color: string;
}
