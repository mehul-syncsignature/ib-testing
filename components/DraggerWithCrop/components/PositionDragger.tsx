import React, { useState, useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface PositionDraggerProps {
  position: Position;
  scale: number;
  onPositionChange: (position: Position) => void;
  showPixelBackground?: boolean;
  aspectRatio?: number;
  height?: number;
  disabled?: boolean;
  onAdjustPositionClick?: () => void;
}

const PositionDragger: React.FC<PositionDraggerProps> = ({
  position,
  scale,
  onPositionChange,
  showPixelBackground = true,
  aspectRatio = 1,
  height = 200,
  disabled = false,
  // onAdjustPositionClick,
}) => {
  // State
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const startMousePositionRef = useRef<Position>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false); // Added ref to track dragging state

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (parentContainerRef.current) {
        const parentWidth = parentContainerRef.current.clientWidth;
        const calculatedHeight = Math.min(height, parentWidth / aspectRatio);
        const calculatedWidth = calculatedHeight * aspectRatio;

        setContainerSize({
          width: calculatedWidth,
          height: calculatedHeight,
        });
      }
    };

    // Initial calculation
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [aspectRatio, height]);

  // Constrain position within container bounds
  const constrainPosition = (pos: Position): Position => {
    if (containerSize.width === 0 || containerSize.height === 0) return pos;

    const handleRadius = 12; // Half of the 24px handle size
    const maxX = containerSize.width / 2 - handleRadius;
    const minX = -containerSize.width / 2 + handleRadius;
    const maxY = containerSize.height / 2 - handleRadius;
    const minY = -containerSize.height / 2 + handleRadius;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  };

  // Update position with animation frame for smooth performance
  const updatePosition = (newPosition: Position) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    // Apply constraints before updating
    const constrainedPosition = constrainPosition(newPosition);
    onPositionChange(constrainedPosition);
  };

  // Mouse event handlers
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || scale === 0) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startMousePositionRef.current.x;
      const deltaY = e.clientY - startMousePositionRef.current.y;

      const newPosition = {
        x: startPositionRef.current.x + deltaX / scale,
        y: startPositionRef.current.y + deltaY / scale,
      };

      updatePosition(newPosition);
    });
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || disabled || e.button !== 0) return;

    // Prevent default to avoid text selection and other default behaviors
    e.preventDefault();
    e.stopPropagation();

    // Set dragging state immediately
    isDraggingRef.current = true;
    setIsDragging(true);

    // Store initial positions (constrained)
    startPositionRef.current = constrainPosition(position);
    startMousePositionRef.current = { x: e.clientX, y: e.clientY };

    // Add global event listeners for mouse move and up
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Ensure position is constrained when container size changes
  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0) {
      const constrainedPos = constrainPosition(position);
      if (constrainedPos.x !== position.x || constrainedPos.y !== position.y) {
        onPositionChange(constrainedPos);
      }
    }
  }, [containerSize.width, containerSize.height]);

  // UI interaction handlers
  const handleMouseEnter = () => {
    if (!disabled) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) setIsHovering(false);
  };

  // Visibility state for the dragger handle
  const isDraggerVisible = !disabled && (isDragging || isHovering);

  // Get constrained position for rendering
  const displayPosition = constrainPosition(position);

  return (
    <div className="w-full flex flex-col items-center" ref={parentContainerRef}>
      <div
        ref={containerRef}
        className={`relative rounded-lg overflow-hidden border border-neutral-200 ${
          !disabled
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        } select-none`}
        style={{
          height: `${containerSize.height}px`,
          width: `${containerSize.width}px`,
          maxWidth: "100%",
          opacity: disabled ? 0.6 : 1,
          userSelect: "none", // Ensure no text selection
          WebkitUserSelect: "none", // Safari support
        }}
        onMouseDown={disabled ? undefined : handleMouseDown}
        onMouseEnter={disabled ? undefined : handleMouseEnter}
        onMouseLeave={disabled ? undefined : handleMouseLeave}
        title={disabled ? "" : "Click and drag to reposition"}
      >
        {/* Background */}
        <div
          className={`${
            showPixelBackground ? "bg-pixel-pattern" : "bg-neutral-100"
          } w-full h-full flex justify-center items-center relative`}
        >
          {/* Content container - positioned by scale */}
          <div
            className="relative"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
          >
            {/* Content goes here */}
          </div>

          {/* Draggable handle - always show it, just disable interaction */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              width: "24px",
              height: "24px",
              top: "50%",
              left: "50%",
              opacity: disabled ? 0.4 : isDraggerVisible ? 1 : 0.8,
              transform: `translate(calc(-50% + ${displayPosition.x}px), calc(-50% + ${displayPosition.y}px))`,
              transition: isDragging
                ? "none"
                : "transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease",
              zIndex: 10,
            }}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md border ${
                isDraggerVisible ? "border-neutral-300" : "border-neutral-400"
              } transition-colors`}
            />
          </div>

          {/* Guidelines that appear during dragging */}
          {isDragging && !disabled && (
            <>
              <div
                className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white opacity-50 pointer-events-none"
                style={{ transform: "translateY(-0.5px)" }}
              />
              <div
                className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-white opacity-50 pointer-events-none"
                style={{ transform: "translateX(-0.5px)" }}
              />
            </>
          )}
        </div>
      </div>

      {/* CSS for the dot pattern background */}
      <style jsx global>{`
        .bg-pixel-pattern {
          background-color: #f0f0f0;
          background-image: radial-gradient(
            circle,
            #d0d0d0 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default PositionDragger;
