// common/constants/gradients.ts

// Define gradient style types with descriptive names
export type GradientType =
  // | "none"
  | "tri-color-top-bottom"
  | "radial-tri-color"
  | "reversed-tri-color"
  | "diagonal-highlight-primary"
  | "vertical-highlight-primary"
  | "vertical-primary-highlight"
  | "diagonal-secondary-primary"
  | "solid-secondary"
  | "solid-primary"
  | "solid-highlight";

// Function to get the CSS gradient string based on gradient type and brand colors
export const getGradientStyle = (
  type: GradientType,
  primaryColor: string,
  secondaryColor: string,
  highlightColor: string
): string => {
  switch (type) {
    case "tri-color-top-bottom":
      return `linear-gradient(180deg, ${highlightColor} -11.62%, ${primaryColor} 44.19%, ${secondaryColor} 100%)`;

    case "radial-tri-color":
      return `radial-gradient(56.38% 56.38% at 50% 50%, ${primaryColor} 0%, ${secondaryColor} 100%)`;

    case "reversed-tri-color":
      return `linear-gradient(180deg, ${secondaryColor} -31.13%, ${primaryColor} 34.44%, ${highlightColor} 100%)`;

    case "diagonal-highlight-primary":
      return `linear-gradient(135deg, ${highlightColor} 0%, ${primaryColor} 100%)`;

    case "vertical-highlight-primary":
      return `linear-gradient(180deg, ${highlightColor} 0%, ${primaryColor} 69.38%)`;

    case "vertical-primary-highlight":
      return `linear-gradient(180deg, ${primaryColor} 40.25%, ${highlightColor} 100%)`;

    case "diagonal-secondary-primary":
      return `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)`;

    case "solid-secondary":
      return `linear-gradient(180deg, ${secondaryColor} 40.25%, ${secondaryColor} 100%)`;

    case "solid-primary":
      return `linear-gradient(180deg, ${primaryColor} 40.25%, ${primaryColor} 100%)`;

    case "solid-highlight":
      return `linear-gradient(180deg, ${highlightColor} 40.25%, ${highlightColor} 100%)`;
  }
};

// List of all available gradient types for randomization
export const gradientTypes: GradientType[] = [
  // "none",
  "tri-color-top-bottom",
  "radial-tri-color",
  "reversed-tri-color",
  "diagonal-highlight-primary",
  "vertical-highlight-primary",
  "vertical-primary-highlight",
  "diagonal-secondary-primary",
  "solid-secondary",
  "solid-primary",
  "solid-highlight",
];

// Get a random gradient type
export const getRandomGradientType = (): GradientType => {
  // Skip 'none' option when randomizing (index 0)
  const randomIndex =
    Math.floor(Math.random() * (gradientTypes.length - 1)) + 1;
  return gradientTypes[randomIndex];
};
