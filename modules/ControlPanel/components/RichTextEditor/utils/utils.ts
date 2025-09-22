/* eslint-disable @typescript-eslint/no-explicit-any */
// modules/ControlPanel/components/RichTextEditor/utils.ts
import {
  HIGHLIGHT_SPAN_TAG,
  HIGHLIGHT_ATTR,
  HIGHLIGHT_RELATED_STYLES,
} from "../constants/constants";

/**
 * Adjusts a color's opacity
 */
export const adjustColorOpacity = (
  color: string | undefined,
  opacity: number
): string => {
  const safeColor = color || "#000000";
  try {
    if (safeColor.startsWith("#")) {
      const r = parseInt(safeColor.slice(1, 3) || "0", 16);
      const g = parseInt(safeColor.slice(3, 5) || "0", 16);
      const b = parseInt(safeColor.slice(5, 7) || "0", 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    if (safeColor.startsWith("rgba")) {
      return safeColor.replace(/[\d.]+\)$/, `${opacity})`);
    }
    if (safeColor.startsWith("rgb")) {
      return safeColor.replace("rgb", "rgba").replace(/\)$/, `, ${opacity})`);
    }
  } catch (e) {
    console.error("Error parsing color:", safeColor, e);
    return `rgba(0, 0, 0, ${opacity})`;
  }
  return `rgba(0, 0, 0, ${opacity})`;
};

/**
 * Creates a DOM element with attributes and styles
 */
export const createVirtualElement = (
  tag: string,
  attributes: Record<string, string> = {},
  styles: Record<string, string> = {}
) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  Object.entries(styles).forEach(
    ([key, value]) => (element.style[key as any] = value)
  );
  return element;
};

/**
 * Generates a unique ID for DOM elements
 */
export const generateUniqueId = (() => {
  let counter = 0;
  return (prefix = "editor") => `${prefix}${Date.now()}${counter++}`;
})();

/**
 * Cleans highlight related styles from a document fragment
 */
export const cleanHighlightFromFragment = (
  fragment: DocumentFragment
): void => {
  const elementsToProcess: HTMLElement[] = [];
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT);

  let currentNode: Node | null = walker.nextNode();
  while (currentNode) {
    if (currentNode instanceof HTMLElement) {
      if (
        currentNode.tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
        currentNode.hasAttribute(HIGHLIGHT_ATTR)
      ) {
        elementsToProcess.push(currentNode);
      } else {
        let hasHighlightStyle = false;
        for (const styleProp of HIGHLIGHT_RELATED_STYLES) {
          if (currentNode.style.getPropertyValue(styleProp)) {
            hasHighlightStyle = true;
            break;
          }
        }
        if (hasHighlightStyle) {
          elementsToProcess.push(currentNode);
        }
      }
    }
    currentNode = walker.nextNode();
  }

  elementsToProcess.forEach((el) => {
    if (
      el.tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
      el.hasAttribute(HIGHLIGHT_ATTR)
    ) {
      const tempFrag = document.createDocumentFragment();
      while (el.firstChild) {
        tempFrag.appendChild(el.firstChild);
      }
      if (el.parentNode) {
        el.parentNode.insertBefore(tempFrag, el);
        el.parentNode.removeChild(el);
      }
    } else {
      for (const styleProp of HIGHLIGHT_RELATED_STYLES) {
        el.style.removeProperty(styleProp);
      }
      if (!el.style.length) el.removeAttribute("style");
    }
  });
  fragment.normalize();
};

/**
 * Applies class-based styles to an element
 */
export const applyClassStyles = (
  element: HTMLElement,
  classNames: string,
  primaryColor?: string,
  secondaryColor?: string,
  highlightColor?: string
): void => {
  const colorMap: { [key: string]: string } = {
    primary: primaryColor || "#0000FF",
    secondary: secondaryColor || "#008080",
    highlight: highlightColor || "#FFFF00",
    "green-400": "#4ade80",
    "blue-400": "#60a5fa",
  };

  classNames.split(" ").forEach((cls) => {
    if (cls === "rounded-md") element.style.borderRadius = "0.375rem";
    else if (cls === "rounded") element.style.borderRadius = "0.25rem";
    else if (cls === "border-b-4") {
      element.style.borderBottomWidth = "4px";
      element.style.borderBottomStyle = "solid";
      if (!element.style.borderBottomColor)
        element.style.borderBottomColor = "currentColor";
    } else if (cls === "border-2") {
      element.style.borderWidth = "2px";
      element.style.borderStyle = "solid";
      if (!element.style.borderColor)
        element.style.borderColor = "currentColor";
    } else if (cls.startsWith("border-") && cls.includes("-")) {
      const parts = cls.split("-");
      if (parts.length >= 2) {
        const colorName = parts.slice(1).join("-");
        const mappedColor = colorMap[colorName];
        if (mappedColor) {
          if (cls.startsWith("border-b-")) {
            element.style.borderBottomColor = mappedColor;
            if (!element.style.borderBottomWidth)
              element.style.borderBottomWidth = "1px";
            if (!element.style.borderBottomStyle)
              element.style.borderBottomStyle = "solid";
          } else if (cls.startsWith("border-")) {
            element.style.borderColor = mappedColor;
            if (!element.style.borderWidth) element.style.borderWidth = "1px";
            if (!element.style.borderStyle) element.style.borderStyle = "solid";
          }
        }
      }
    }
  });

  if (
    (element.style.border || element.style.borderBottom) &&
    !element.style.background &&
    !element.style.backgroundColor
  ) {
    if (!element.style.padding) element.style.padding = "0 2px";
  }
};

/**
 * Executes a formatting command safely
 */
export const execFormatCommand = (
  command: string,
  value: string | null = null,
  editorRef: React.RefObject<HTMLDivElement | null>,
  callback?: () => void
) => {
  if (!editorRef.current) return;
  editorRef.current.focus(); // Ensure editor has focus
  try {
    document.execCommand(command, false, value ?? undefined);
  } catch (error) {
    console.error(`Error executing command "${command}":`, error);
  }

  if (callback) {
    requestAnimationFrame(callback);
  }
};
