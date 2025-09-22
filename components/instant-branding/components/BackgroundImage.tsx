import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundImageProps {
  /** Image source URL */
  src?: string;
  /** Background color to blend with */
  backgroundColor?: string;
  /** Opacity of the background image (0-1) */
  opacity?: number;
  /** Additional CSS classes */
  className?: string;
  /** Child content to render on top */
  children?: React.ReactNode;
  /** Custom styles for the container */
  style?: React.CSSProperties;
  /** Background size property */
  backgroundSize?: "cover" | "contain" | "auto" | string;
  /** Background position property */
  backgroundPosition?: string;
  /** Background repeat property */
  backgroundRepeat?: "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
  /** Blend mode for the background image */
  blendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  src,
  backgroundColor = "#ffffff",
  opacity = 1,
  className = "",
  children,
  style = {},
  backgroundSize = "cover",
  backgroundPosition = "center",
  backgroundRepeat = "no-repeat",
  blendMode = "normal",
}) => {
  // Create the background style object
  const backgroundStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: backgroundColor,
    ...style,
  };

  // Background image overlay style
  const imageOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: src ? `url(${src})` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    opacity,
    mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
    pointerEvents: "none", // Ensures the overlay doesn't interfere with content interactions
  };

  return (
    <div className={cn("relative", className)} style={backgroundStyle}>
      {/* Background Image Overlay */}
      {src && <div style={imageOverlayStyle} />}

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundImage;
