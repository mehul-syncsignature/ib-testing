/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Image from "next/image";

/**
 * Modifies an SVG with new dimensions and colors
 * @param svg - The original SVG as a string, React element, or URL/path
 * @param width - New width to apply (can be number or string with units like '100px')
 * @param height - New height to apply (can be number or string with units like '100px')
 * @param color - New fill color to apply (e.g. '#FF0000', 'red', etc.)
 * @returns Modified SVG as a string or a React element with the applied stylings
 */
import { StaticImageData } from "next/image";
import { fetchAwsAsset } from "@/lib/aws-s3";

export function modifySvg(
  svg:
    | string
    | React.ReactElement
    | React.ComponentType
    | StaticImageData
    | undefined,
  width?: string | number,
  height?: string | number,
  color?: string,
  position?: string,
  size?: string
): React.ReactElement | null {
  // Auto-detect AWS asset keys and convert to URLs
  if (
    typeof svg === "string" &&
    !svg.includes("/") &&
    !svg.startsWith("<svg")
  ) {
    // Simple string without path separators or SVG content = AWS key
    // Use API proxy for SVGs to avoid CORS issues
    if (svg) {
      svg = fetchAwsAsset(svg, "svg");
    }
  }
  // For Next.js imported SVGs (which are just static image paths)
  if (typeof svg === "object" && svg !== null && "src" in svg) {
    // Prepare properties for the image element
    const widthValue =
      typeof width === "number"
        ? width
        : parseInt(String(width), 10) || undefined;
    const heightValue =
      typeof height === "number"
        ? height
        : parseInt(String(height), 10) || undefined;

    if (color) {
      // For SVGs with color, we need to create a wrapper with mask
      const wrapperProps: React.HTMLAttributes<HTMLDivElement> = {
        style: {
          width: `${width}`,
          height: `${height}`,
          position: "relative",
          maskImage: `url(${typeof svg === "string" ? svg : svg.src})`,
          WebkitMaskImage: `url(${typeof svg === "string" ? svg : svg.src})`,
          maskSize: `${size}`,
          WebkitMaskSize: `${size}`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: `${position}`,
          WebkitMaskPosition: `${position}`,
          backgroundColor: color,
        },
      };

      return React.createElement("div", wrapperProps);
    } else {
      // Without color, just use the image component
      const imageProps = {
        src: svg,
        width: widthValue,
        height: heightValue,
        alt: "SVG Image",
        style: {
          width: typeof width === "number" ? `${width}px` : String(width),
          height: typeof height === "number" ? `${height}px` : String(height),
        },
      };
      return React.createElement(Image, imageProps);
    }
  }

  // For string SVGs
  let svgString: string | undefined;

  if (typeof svg === "string") {
    // Check if it starts with '<svg' which indicates it's raw SVG content
    if (svg.trim().toLowerCase().startsWith("<svg")) {
      svgString = svg;
    } else {
      // For path strings, we'll use the same mask approach for coloring
      if (color) {
        const wrapperProps: React.HTMLAttributes<HTMLDivElement> = {
          style: {
            width: typeof width === "number" ? `${width}px` : String(width),
            height: typeof height === "number" ? `${height}px` : String(height),
            position: "relative",
            maskImage: `url(${svg})`,
            WebkitMaskImage: `url(${svg})`,
            maskSize: `${size}`,
            WebkitMaskSize: `${size}`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: `${position}`,
            WebkitMaskPosition: `${position}`,
            backgroundColor: color,
          },
        };

        return React.createElement("div", wrapperProps);
      } else {
        // Without color, just use the image component
        const imageProps = {
          src: svg,
          width:
            typeof width === "number"
              ? width
              : parseInt(String(width), 10) || undefined,
          height:
            typeof height === "number"
              ? height
              : parseInt(String(height), 10) || undefined,
          alt: "SVG Image",
          style: {
            width: typeof width === "number" ? `${width}px` : String(width),
            height: typeof height === "number" ? `${height}px` : String(height),
          },
        };

        return React.createElement(Image, imageProps);
      }
    }
  } else if (typeof svg === "function") {
    // If it's a React component, render it
    const SvgComponent = svg;
    const componentProps = {
      width: width,
      height: height,
      fill: color,
      style: {
        width: width,
        height: height,
        fill: color,
      },
    } as React.ComponentProps<typeof SvgComponent>;

    return React.createElement(SvgComponent, componentProps);
  } else if (React.isValidElement(svg)) {
    // If it's a React element, clone it with new props
    const elementProps = {
      width: width,
      height: height,
      fill: color,
      style: {
        ...((svg.props as React.HTMLAttributes<HTMLElement>).style || {}),
        width: width,
        height: height,
        fill: color,
      },
    };

    return React.cloneElement(svg, elementProps);
  } else {
    return null;
  }

  // If we have a string SVG and we're in a browser environment, modify it
  if (svgString && typeof window !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");
      const svgElement = doc.querySelector("svg");

      // Check if the document has an SVG element
      if (!svgElement) {
        throw new Error("Invalid SVG format");
      }

      // Apply width if provided
      if (width !== undefined) {
        const widthValue =
          typeof width === "number" ? `${width}px` : String(width);
        svgElement.setAttribute("width", widthValue);
      }

      // Apply height if provided
      if (height !== undefined) {
        const heightValue =
          typeof height === "number" ? `${height}px` : String(height);
        svgElement.setAttribute("height", heightValue);
      }

      // Apply color if provided
      if (color) {
        svgElement.setAttribute("fill", color);

        const elementsWithFill = svgElement.querySelectorAll(
          '[fill]:not([fill="none"])'
        );
        elementsWithFill.forEach((el) => {
          el.setAttribute("fill", color);
        });

        const colorableElements = svgElement.querySelectorAll(
          "path, rect, circle, ellipse, polygon, polyline"
        );
        colorableElements.forEach((el) => {
          if (
            !el.hasAttribute("fill") ||
            el.getAttribute("fill") === "currentColor"
          ) {
            el.setAttribute("fill", color);
          }
        });
      }

      // Convert back to string
      const modifiedSvgString = new XMLSerializer().serializeToString(doc);

      // Return as a React element with dangerouslySetInnerHTML
      const divProps = {
        dangerouslySetInnerHTML: { __html: modifiedSvgString },
        style: { display: "inline-block" },
      };

      return React.createElement("div", divProps);
    } catch (error) {
      return null;
    }
  }

  return null;
}

// Example usage in your component:
// const svgElement = modifySvg(EllipseSvg, 100, 100, "#000000");
// Then use it directly in your JSX: {svgElement}
