/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// modules/ControlPanel/components/RichTextEditor/hooks/hooks.ts
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  EditorHistory,
  FormattingState,
  StyledHighlight,
} from "../types/types";
import {
  MAX_HISTORY_SIZE,
  SELECTION_THROTTLE_DELAY,
  HIGHLIGHT_SPAN_TAG,
  HIGHLIGHT_ATTR,
} from "../constants/constants";
import {
  execFormatCommand,
  generateUniqueId as utilGenerateUniqueId,
} from "../utils/utils";

const adjustColorOpacity = (() => {
  const cache = new Map();
  return (color: string | undefined, opacity: number): string => {
    if (!color) return `rgba(0, 0, 0, ${opacity})`;
    const cacheKey = `${color}-${opacity}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    let result = `rgba(0, 0, 0, ${opacity})`;
    try {
      if (color.startsWith("#")) {
        const r = parseInt(color.slice(1, 3) || "0", 16);
        const g = parseInt(color.slice(3, 5) || "0", 16);
        const b = parseInt(color.slice(5, 7) || "0", 16);
        result = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      } else if (color.startsWith("rgba")) {
        result = color.replace(/[\d.]+\)$/, `${opacity})`);
      } else if (color.startsWith("rgb")) {
        result = color.replace("rgb", "rgba").replace(/\)$/, `, ${opacity})`);
      }
    } catch (e) {
      console.error("Error parsing color:", color, e);
    }
    cache.set(cacheKey, result);
    return result;
  };
})();

export const useEditorHistory = (
  initialContent: string
): [
  EditorHistory,
  (content: string) => void,
  () => void,
  () => void,
  boolean
] => {
  const historyRef = useRef<string[]>([initialContent]);
  const historyIndexRef = useRef<number>(0);
  const [isUndoRedo, setIsUndoRedo] = useState<boolean>(false);
  const contentForHistoryRef = useRef<string>(initialContent);
  const contentChangeTimeoutRef = useRef<number | null>(null);
  const isUpdatingRef = useRef(false);
  const [historyState, setHistoryState] = useState<EditorHistory>({
    items: historyRef.current,
    index: historyIndexRef.current,
  });

  const stageHistorySave = useCallback(
    (content: string) => {
      if (
        !isUndoRedo &&
        !isUpdatingRef.current &&
        content !== contentForHistoryRef.current
      ) {
        isUpdatingRef.current = true;
        contentForHistoryRef.current = content;
        if (contentChangeTimeoutRef.current)
          window.clearTimeout(contentChangeTimeoutRef.current);
        contentChangeTimeoutRef.current = window.setTimeout(() => {
          const currentIndex = historyIndexRef.current;
          const currentHistory = historyRef.current;
          if (content !== currentHistory[currentIndex]) {
            const newHistory = currentHistory.slice(0, currentIndex + 1);
            if (newHistory.length >= MAX_HISTORY_SIZE) newHistory.shift();
            newHistory.push(content);
            historyRef.current = newHistory;
            historyIndexRef.current = newHistory.length - 1;
            setHistoryState({
              items: newHistory,
              index: newHistory.length - 1,
            });
          }
          isUpdatingRef.current = false;
          contentChangeTimeoutRef.current = null;
        }, 300);
      }
    },
    [isUndoRedo]
  );

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      setIsUndoRedo(true);
      historyIndexRef.current -= 1;
      setHistoryState((prev) => ({ ...prev, index: historyIndexRef.current }));
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      setIsUndoRedo(true);
      historyIndexRef.current += 1;
      setHistoryState((prev) => ({ ...prev, index: historyIndexRef.current }));
    }
  }, []);

  useEffect(() => {
    if (isUndoRedo) {
      const timeoutId = setTimeout(() => setIsUndoRedo(false), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isUndoRedo, historyState.index]);

  useEffect(() => {
    return () => {
      if (contentChangeTimeoutRef.current)
        window.clearTimeout(contentChangeTimeoutRef.current);
    };
  }, []);

  return [historyState, stageHistorySave, handleUndo, handleRedo, isUndoRedo];
};

export const useFormattingState = (
  editorRef: React.RefObject<HTMLDivElement | null>
): [FormattingState, () => void] => {
  const [formattingState, setFormattingState] = useState<FormattingState>({
    bold: false,
    italic: false,
    underline: false,
  });
  const prevFormattingRef = useRef<FormattingState>({ ...formattingState });
  const updateFormattingStateTimeoutRef = useRef<number | null>(null);

  const updateFormattingState = useCallback(() => {
    if (updateFormattingStateTimeoutRef.current)
      window.clearTimeout(updateFormattingStateTimeoutRef.current);
    updateFormattingStateTimeoutRef.current = window.setTimeout(() => {
      try {
        if (!editorRef.current) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!editorRef.current.contains(range.commonAncestorContainer)) return;
        const newBold = document.queryCommandState("bold");
        const newItalic = document.queryCommandState("italic");
        const newUnderline = document.queryCommandState("underline");
        if (
          newBold !== prevFormattingRef.current.bold ||
          newItalic !== prevFormattingRef.current.italic ||
          newUnderline !== prevFormattingRef.current.underline
        ) {
          prevFormattingRef.current = {
            bold: newBold,
            italic: newItalic,
            underline: newUnderline,
          };
          setFormattingState(prevFormattingRef.current);
        }
      } catch (error) {
        prevFormattingRef.current = {
          bold: false,
          italic: false,
          underline: false,
        };
        setFormattingState(prevFormattingRef.current);
      }
      updateFormattingStateTimeoutRef.current = null;
    }, 0);
  }, [editorRef]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !editorRef.current) return;
      for (let i = 0; i < selection.rangeCount; i++) {
        if (
          editorRef.current.contains(
            selection.getRangeAt(i).commonAncestorContainer
          )
        ) {
          updateFormattingState();
          break;
        }
      }
    };
    const throttledSelectionChange = () => {
      if (updateFormattingStateTimeoutRef.current)
        window.clearTimeout(updateFormattingStateTimeoutRef.current);
      updateFormattingStateTimeoutRef.current = window.setTimeout(() => {
        handleSelectionChange();
        updateFormattingStateTimeoutRef.current = null;
      }, SELECTION_THROTTLE_DELAY);
    };
    document.addEventListener("selectionchange", throttledSelectionChange, {
      passive: true,
    });
    return () => {
      document.removeEventListener("selectionchange", throttledSelectionChange);
      if (updateFormattingStateTimeoutRef.current)
        window.clearTimeout(updateFormattingStateTimeoutRef.current);
    };
  }, [editorRef, updateFormattingState]);

  return [formattingState, updateFormattingState];
};

// Helper function to check if a node or its relevant parent matches a highlight style by name
function isNodeOrParentMatchingHighlight(
  node: Node,
  highlightToMatch: StyledHighlight,
  editorNode: HTMLElement | null
): boolean {
  let currentNode: Node | null = node;
  while (currentNode && currentNode !== editorNode) {
    // Stop if we hit the editor boundary or null
    if (
      currentNode instanceof HTMLElement &&
      currentNode.tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
      currentNode.hasAttribute(HIGHLIGHT_ATTR)
    ) {
      // Found a highlight span, check if it's the one we're looking for by name
      return currentNode.dataset.rteHighlightName === highlightToMatch.name;
    }
    currentNode = currentNode.parentNode;
  }
  return false; // Reached editor boundary or null without finding a matching highlight span
}

export const useHighlightStyles = (
  editorRef: React.RefObject<HTMLDivElement | null>,
  primaryColor?: string,
  secondaryColor?: string,
  highlightColor?: string,
  onContentChange?: () => void
) => {
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const brandColors = useMemo(
    () => ({
      primary: primaryColor || "#0000FF",
      secondary: secondaryColor || "#008080",
      highlight: highlightColor || "#FFFF00",
    }),
    [primaryColor, secondaryColor, highlightColor]
  );

  const allHighlights = useMemo<StyledHighlight[]>(
    () => [
      {
        name: "Rounded Highlight",
        color: adjustColorOpacity(brandColors.highlight, 0.6),
        padding: "0px 13px",
        borderRadius: "13px",
      },
      {
        name: "Square Highlight",
        color: adjustColorOpacity(brandColors.highlight, 0.6),
        padding: "0px 13px",
        borderRadius: "0px",
      },
      {
        name: "Marker Highlight",
        color: "transparent",
        padding: "2px 2px",
        backgroundImage: `linear-gradient(to top, ${adjustColorOpacity(
          brandColors.highlight,
          0.6
        )} 40%, transparent 40%)`,
        borderRadius: "2px",
        display: "inline",
      },
      
      {
        name: "None",
        color: "transparent",
        padding: "0px",
        borderRadius: "0px",
      },
    ],
    [brandColors]
  );

  const isMatchingHighlightForMerging = useCallback(
    (node: Node, highlightToMatch: StyledHighlight): boolean => {
      if (
        !(
          node instanceof HTMLElement &&
          node.tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
          node.hasAttribute(HIGHLIGHT_ATTR)
        )
      ) {
        return false;
      }
      return (
        node.dataset.rteHighlightName === highlightToMatch.name &&
        node.style.backgroundColor === highlightToMatch.color &&
        node.style.padding === highlightToMatch.padding &&
        node.style.borderRadius === highlightToMatch.borderRadius &&
        node.style.borderBottom === highlightToMatch.borderBottom &&
        node.style.textDecoration === highlightToMatch.textDecoration &&
        node.style.textDecorationThickness ===
          highlightToMatch.textDecorationThickness &&
        node.style.textDecorationSkipInk ===
          highlightToMatch.textDecorationSkipInk &&
        node.style.textUnderlineOffset ===
          highlightToMatch.textUnderlineOffset &&
        node.style.backgroundImage === highlightToMatch.backgroundImage &&
        node.style.display === highlightToMatch.display
      );
    },
    []
  );

  const isHighlightSessionRef = useRef<boolean>(false);
  const lastSelectionRangeRef = useRef<Range | null>(null);

  const applyHighlightStyle = useCallback(
    (highlight: StyledHighlight, selectAll?: boolean) => {
      const selection = window.getSelection();
      if (!editorRef.current || !selection) {
        return;
      }

      let range: Range;
      if (selectAll) {
        editorRef.current.focus();
        range = document.createRange();
        range.selectNodeContents(editorRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
        isHighlightSessionRef.current = false;
      } else if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);

        if (
          lastSelectionRangeRef.current &&
          (range.startContainer !==
            lastSelectionRangeRef.current.startContainer ||
            range.startOffset !== lastSelectionRangeRef.current.startOffset ||
            range.endContainer !== lastSelectionRangeRef.current.endContainer ||
            range.endOffset !== lastSelectionRangeRef.current.endOffset)
        ) {
          isHighlightSessionRef.current = false;
        }
      } else {
        return;
      }

      if (range.collapsed || range.toString().trim() === "") {
        if (!selectAll || highlight.name !== "None") {
          if (highlight.name !== "None") isHighlightSessionRef.current = false;
          return;
        }
      }

      lastSelectionRangeRef.current = range.cloneRange();

      if (highlight.name !== "None" && !isHighlightSessionRef.current) {
        const nodesInSelection = getNodesInSelectionRange(range);
        if (nodesInSelection.length > 0) {
          let isSelectionUniformlyStyledWithTarget = true;
          let hasMeaningfulContent = false;

          for (const node of nodesInSelection) {
            if (
              (node.nodeType === Node.TEXT_NODE &&
                (node.textContent || "").trim() === "") ||
              (node === editorRef.current &&
                nodesInSelection.length === 1 &&
                selectAll)
            ) {
              continue;
            }

            hasMeaningfulContent = true;

            if (
              !isNodeOrParentMatchingHighlight(
                node,
                highlight,
                editorRef.current
              )
            ) {
              isSelectionUniformlyStyledWithTarget = false;
              break;
            }
          }

          if (hasMeaningfulContent && isSelectionUniformlyStyledWithTarget) {
            return;
          }
        }
      }

      isHighlightSessionRef.current = true;

      const originalRangeBeforeMarkers = range.cloneRange();
      const uniqueIdMarker = utilGenerateUniqueId("hm");
      const startMarkerId = `s${uniqueIdMarker}`;
      const endMarkerId = `e${uniqueIdMarker}`;
      const startMarker = document.createElement("span");
      startMarker.id = startMarkerId;
      startMarker.setAttribute("data-rte-marker", "true");
      startMarker.style.display = "none";
      const endMarker = document.createElement("span");
      endMarker.id = endMarkerId;
      endMarker.setAttribute("data-rte-marker", "true");
      endMarker.style.display = "none";

      const startRange = range.cloneRange();
      startRange.collapse(true);
      startRange.insertNode(startMarker);
      const endRange = range.cloneRange();
      endRange.collapse(false);
      endRange.insertNode(endMarker);

      const processRange = document.createRange();
      const startMarkerEl = document.getElementById(startMarkerId);
      const endMarkerEl = document.getElementById(endMarkerId);

      if (
        !startMarkerEl ||
        !endMarkerEl ||
        !startMarkerEl.parentNode ||
        !endMarkerEl.parentNode
      ) {
        startMarker.remove();
        endMarker.remove();
        selection.removeAllRanges();
        selection.addRange(originalRangeBeforeMarkers);
        if (onContentChange) onContentChange();
        return;
      }

      processRange.setStartAfter(startMarkerEl);
      processRange.setEndBefore(endMarkerEl);

      const isNoneHighlight = highlight.name === "None";
      const selectedFragment = processRange.extractContents();

      const processNodeRecursive = (
        node: Node,
        currentHighlightStyle: StyledHighlight
      ): Node | DocumentFragment => {
        if (node.nodeType === Node.TEXT_NODE) {
          const textContent = node.textContent || "";
          if (!isNoneHighlight && textContent.trim() === "") {
            return node.cloneNode(true);
          }
          if (isNoneHighlight) {
            return node.cloneNode(true);
          }

          const wrapper = document.createElement(HIGHLIGHT_SPAN_TAG);
          wrapper.setAttribute(HIGHLIGHT_ATTR, "true");
          wrapper.dataset.rteHighlightName = currentHighlightStyle.name;
          wrapper.style.backgroundColor = currentHighlightStyle.color;
          if (currentHighlightStyle.padding)
            wrapper.style.padding = currentHighlightStyle.padding;
          if (currentHighlightStyle.borderRadius)
            wrapper.style.borderRadius = currentHighlightStyle.borderRadius;
          if (currentHighlightStyle.borderBottom)
            wrapper.style.borderBottom = currentHighlightStyle.borderBottom;
          if (currentHighlightStyle.textDecoration)
            wrapper.style.textDecoration = currentHighlightStyle.textDecoration;
          if (currentHighlightStyle.textDecorationThickness)
            wrapper.style.textDecorationThickness =
              currentHighlightStyle.textDecorationThickness;
          if (currentHighlightStyle.textDecorationSkipInk)
            wrapper.style.textDecorationSkipInk =
              currentHighlightStyle.textDecorationSkipInk;
          if (currentHighlightStyle.textUnderlineOffset)
            wrapper.style.textUnderlineOffset =
              currentHighlightStyle.textUnderlineOffset;
          if (currentHighlightStyle.backgroundImage)
            wrapper.style.backgroundImage =
              currentHighlightStyle.backgroundImage;
          if (currentHighlightStyle.display)
            wrapper.style.display = currentHighlightStyle.display;

          wrapper.style.boxDecorationBreak = "clone";
          // @ts-ignore
          wrapper.style.webkitBoxDecorationBreak = "clone";
          wrapper.appendChild(node.cloneNode(true));
          return wrapper;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (
            element.tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
            element.hasAttribute(HIGHLIGHT_ATTR)
          ) {
            const fragment = document.createDocumentFragment();
            Array.from(element.childNodes).forEach((child) =>
              fragment.appendChild(
                processNodeRecursive(child, currentHighlightStyle)
              )
            );
            return fragment;
          } else if (element.hasAttribute("data-rte-marker")) {
            return document.createDocumentFragment();
          } else {
            const clonedElement = element.cloneNode(false) as HTMLElement;
            Array.from(element.childNodes).forEach((child) =>
              clonedElement.appendChild(
                processNodeRecursive(child, currentHighlightStyle)
              )
            );
            return clonedElement;
          }
        }
        return node.cloneNode(true);
      };

      const processedFragment = document.createDocumentFragment();
      Array.from(selectedFragment.childNodes).forEach((childNode) => {
        processedFragment.appendChild(
          processNodeRecursive(childNode, highlight)
        );
      });

      if (processedFragment.textContent?.trim() === "" && !isNoneHighlight) {
        startMarkerEl.remove();
        endMarkerEl.remove();
        selection.removeAllRanges();
        selection.addRange(originalRangeBeforeMarkers);
        if (onContentChange) onContentChange();
        return;
      }

      processRange.insertNode(processedFragment);

      const finalRange = document.createRange();
      if (
        startMarkerEl.nextSibling &&
        startMarkerEl.nextSibling !== endMarkerEl
      ) {
        finalRange.setStartBefore(startMarkerEl.nextSibling);
        if (
          endMarkerEl.previousSibling &&
          endMarkerEl.previousSibling !== startMarkerEl
        ) {
          finalRange.setEndAfter(endMarkerEl.previousSibling);
        } else {
          finalRange.setStartBefore(startMarkerEl.nextSibling); // Corrected: should be nextSibling
          finalRange.collapse(true);
        }
      } else {
        finalRange.setStartAfter(startMarkerEl);
        finalRange.collapse(true);
      }

      selection.removeAllRanges();
      selection.addRange(finalRange);

      const parentOfStartMarker = startMarkerEl.parentNode;
      startMarkerEl.remove();
      endMarkerEl.remove();

      if (parentOfStartMarker) {
        normalizeNodeAndChildren(
          parentOfStartMarker,
          isMatchingHighlightForMerging,
          allHighlights
        );
      } else if (editorRef.current) {
        normalizeNodeAndChildren(
          editorRef.current,
          isMatchingHighlightForMerging,
          allHighlights
        );
      }

      editorRef.current.focus();
      if (onContentChange) onContentChange();
    },
    [
      editorRef,
      onContentChange,
      isMatchingHighlightForMerging,
      allHighlights,
    ] // Corrected: brandColors
  );

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (editorRef.current && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!editorRef.current.contains(range.commonAncestorContainer)) {
          isHighlightSessionRef.current = false;
          return;
        }
      } else {
        isHighlightSessionRef.current = false;
        return;
      }
    };

    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [editorRef]);

  const cycleHighlight = useCallback(() => {
    const selection = window.getSelection();
    if (!editorRef.current || !selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    if (range.collapsed && range.toString().trim() === "") {
      isHighlightSessionRef.current = false;
      return;
    }

    let currentAppliedIndex = -1;
    const nodes = getNodesInSelectionRange(range);
    if (nodes.length > 0) {
      for (const hl of allHighlights) {
        if (
          hl.name !== "None" &&
          isNodeOrParentMatchingHighlight(nodes[0], hl, editorRef.current)
        ) {
          currentAppliedIndex = allHighlights.indexOf(hl);
          break;
        }
      }
    }

    let nextIndexToApply: number;
    if (currentAppliedIndex !== -1) {
      nextIndexToApply = (currentAppliedIndex + 1) % allHighlights.length;
    } else {
      nextIndexToApply = (highlightIndex + 1) % allHighlights.length;
      if (
        allHighlights[nextIndexToApply].name === "None" &&
        allHighlights.length > 1
      ) {
        nextIndexToApply = (nextIndexToApply + 1) % allHighlights.length;
      }
    }

    applyHighlightStyle(allHighlights[nextIndexToApply]);
    setHighlightIndex(nextIndexToApply);
  }, [highlightIndex, allHighlights, applyHighlightStyle, editorRef]);

  const resetFormatting = useCallback(() => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    let selectAllMode = false;

    if (
      !selection ||
      selection.rangeCount === 0 ||
      (selection.rangeCount > 0 && selection.getRangeAt(0).collapsed)
    ) {
      selectAllMode = true;
    } else if (
      selection.rangeCount > 0 &&
      !editorRef.current.contains(
        selection.getRangeAt(0).commonAncestorContainer
      )
    ) {
      selectAllMode = true;
    }

    const noneHighlight = allHighlights.find((h) => h.name === "None");
    if (noneHighlight) {
      applyHighlightStyle(noneHighlight, selectAllMode);
    }

    requestAnimationFrame(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        if (selectAllMode) {
          const currentSelection = window.getSelection();
          if (currentSelection) {
            const selectAllRange = document.createRange();
            selectAllRange.selectNodeContents(editorRef.current);
            currentSelection.removeAllRanges();
            currentSelection.addRange(selectAllRange);
          }
        }
        execFormatCommand("removeFormat", null, editorRef, onContentChange);
      }
    });
  }, [applyHighlightStyle, editorRef, onContentChange, allHighlights]);

  return {
    cycleHighlight,
    resetFormatting,
    highlightIndex,
    allHighlights,
    applyHighlightStyle,
  };
};

function getNodesInSelectionRange(range: Range): Node[] {
  const nodes: Node[] = [];
  const container = range.commonAncestorContainer;

  if (
    range.startContainer === range.endContainer &&
    range.startContainer.nodeType === Node.TEXT_NODE
  ) {
    if ((range.startContainer.textContent || "").trim() !== "") {
      nodes.push(range.startContainer);
    }
    return nodes;
  }

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);

        if (range.intersectsNode(node)) {
          if (node.nodeType === Node.TEXT_NODE) {
            return (node.textContent || "").trim() === ""
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  let currentNode;
  while ((currentNode = walker.nextNode())) {
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      // Additional check to ensure element actually contributes to selection
      // or contains relevant text, beyond just intersecting.
      // This part can be tricky; TreeWalker's intersectsNode usually does a good job.
    }
    nodes.push(currentNode);
  }

  if (nodes.length === 0 && range.toString().trim() !== "") {
    let node = range.startContainer;
    if (
      node.nodeType === Node.TEXT_NODE &&
      range.intersectsNode(node) &&
      (node.textContent || "").trim() !== ""
    ) {
      nodes.push(node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.firstChild &&
      node.firstChild.nodeType === Node.TEXT_NODE &&
      range.intersectsNode(node.firstChild) &&
      (node.firstChild.textContent || "").trim() !== ""
    ) {
      nodes.push(node.firstChild);
    }
  }
  return nodes;
}

function normalizeNodeAndChildren(
  startNode: Node,
  isVisuallyMatchingHighlightFn: (
    node: Node,
    highlightToMatch: StyledHighlight
  ) => boolean,
  highlightsList: StyledHighlight[]
) {
  if (!startNode) return;
  let modified = true;
  let iterations = 0;
  const MAX_NORMALIZE_ITERATIONS = 20;

  while (modified && iterations < MAX_NORMALIZE_ITERATIONS) {
    modified = false;
    iterations++;
    const childNodes = Array.from(startNode.childNodes);

    for (let i = 0; i < childNodes.length; i++) {
      const n = childNodes[i];
      if (!n.parentNode) continue;

      if (
        n.nodeType === Node.ELEMENT_NODE &&
        (n as HTMLElement).tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
        (n as HTMLElement).hasAttribute(HIGHLIGHT_ATTR)
      ) {
        const currentEl = n as HTMLElement;
        const currentHighlightName = currentEl.dataset.rteHighlightName;
        const currentHighlightStyleDef = highlightsList.find(
          (h) => h.name === currentHighlightName
        );

        if (
          currentHighlightStyleDef &&
          currentHighlightStyleDef.name !== "None"
        ) {
          let nextEl = currentEl.nextSibling;
          while (
            nextEl &&
            nextEl.nodeType === Node.TEXT_NODE &&
            (nextEl.textContent || "").trim() === ""
          ) {
            const tempNext = nextEl.nextSibling;
            // @ts-ignore
            nextEl.parentNode.removeChild(nextEl);
            nextEl = tempNext;
            modified = true;
          }

          if (
            nextEl &&
            nextEl.nodeType === Node.ELEMENT_NODE &&
            isVisuallyMatchingHighlightFn(nextEl, currentHighlightStyleDef)
          ) {
            const siblingToMerge = nextEl as HTMLElement;
            while (siblingToMerge.firstChild) {
              currentEl.appendChild(siblingToMerge.firstChild);
            }
            // @ts-ignore
            siblingToMerge.parentNode.removeChild(siblingToMerge);
            modified = true;
            break;
          }
        }
      }

      if (
        n.nodeType === Node.ELEMENT_NODE &&
        (n as HTMLElement).tagName.toLowerCase() === HIGHLIGHT_SPAN_TAG &&
        (n as HTMLElement).hasAttribute(HIGHLIGHT_ATTR) &&
        (n as HTMLElement).dataset.rteHighlightName !== "None" &&
        (n.textContent || "").trim() === ""
      ) {
        // @ts-ignore
        n.parentNode.removeChild(n);
        modified = true;
        break;
      }
    }

    startNode.normalize();
  }

  if (iterations >= MAX_NORMALIZE_ITERATIONS) {
    console.warn(
      "Max normalization iterations reached for a node. DOM might not be fully normalized.",
      startNode
    );
  }
}

export const useTextColors = (
  editorRef: React.RefObject<HTMLDivElement | null>,
  primaryColor?: string,
  secondaryColor?: string,
  highlightColor?: string,
  onContentChange?: () => void
) => {
  const [colorState, setColorState] = useState(() => ({
    index: 3,
    color: "#000000",
  }));

  const colors = useMemo(() => {
    // Renamed to colors for clarity, it's not a ref object
    return [secondaryColor, highlightColor, "#ffffff"];
  }, [secondaryColor, highlightColor]);

  useEffect(() => {
    // Corrected: Access colors directly, not colors.current
    const currentColorIndex = colors.indexOf(colorState.color);
    if (currentColorIndex === -1) {
      setColorState({
        index: colors.length - 1,
        color: colors[colors.length - 1]!,
      });
    } else if (currentColorIndex !== colorState.index) {
      setColorState((prevState) => ({
        ...prevState,
        index: currentColorIndex,
      }));
    }
  }, [colors, colorState.color, colorState.index]);

  const cycleTextColor = useCallback(() => {
    const selection = window.getSelection();
    if (!editorRef.current || !selection?.rangeCount || selection.isCollapsed)
      return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    const nextIndex = (colorState.index + 1) % colors.length;
    const nextColor = colors[nextIndex];

    execFormatCommand("foreColor", nextColor, editorRef, onContentChange);
    setColorState({ index: nextIndex, color: nextColor! });
  }, [colorState.index, editorRef, onContentChange, colors]); // Corrected: colors in dependency array

  return {
    cycleTextColor,
    currentTextColor: colorState.color,
    colorIndex: colorState.index,
  };
};
