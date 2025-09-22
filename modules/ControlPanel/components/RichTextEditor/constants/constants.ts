// modules/ControlPanel/components/RichTextEditor/constants.ts

// DOM related constants
export const HIGHLIGHT_SPAN_TAG = "span";
export const HIGHLIGHT_ATTR = "data-rte-highlight";
export const MAX_HISTORY_SIZE = 30;

// Style properties that need to be cleaned when removing highlights
export const HIGHLIGHT_RELATED_STYLES = [
  "background",
  "background-color",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-width",
  "border-style",
  "border-color",
  "border-bottom-width",
  "border-bottom-style",
  "border-bottom-color",
  "border-radius", // Added/Ensured
];

// Selection throttle delay
export const SELECTION_THROTTLE_DELAY = 100;
