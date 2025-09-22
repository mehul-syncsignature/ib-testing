// lib/fonts.ts

const fontApiNames: Record<string, string> = {
  Roboto: "Roboto",
  Inter: "Inter",
  "Open Sans": "Open+Sans",
  Lato: "Lato",
  "DM Sans": "DM+Sans",
  Poppins: "Poppins",
  Anton: "Anton",
  Archivo: "Archivo",
  "Archivo Black": "Archivo+Black",
  "DM Serif Display": "DM+Serif+Display",
  Cantarell: "Cantarell",
  "Fjalla One": "Fjalla+One",
  "Work Sans": "Work+Sans",
  Ubuntu: "Ubuntu",
  "Big Shoulders Display": "Big+Shoulders+Display",
  "Bricolage Grotesque": "Bricolage+Grotesque",
  "Della Respira": "Della+Respira",
  "League Spartan": "League+Spartan",
  Lora: "Lora",
  Mulish: "Mulish",
  Oswald: "Oswald",
  Philosopher: "Philosopher",
  "Playfair Display": "Playfair+Display",
  "Pontano Sans": "Pontano+Sans",
  Questrial: "Questrial",
  "Roboto Mono": "Roboto+Mono",
  "Rozha One": "Rozha+One",
  Rubik: "Rubik",
  "Source Sans 3": "Source+Sans+3",
  "Space Mono": "Space+Mono",
  Syne: "Syne",
  Teko: "Teko",
  Yellowtail: "Yellowtail",
  Chivo: "Chivo",
  "PT Serif": "PT+Serif",
  "Gentium Plus": "Gentium+Plus",
  Bangers: "Bangers",
  "Bebas Neue": "Bebas+Neue",
  Montserrat: "Montserrat",
  Ultra: "Ultra",
  "Stint Ultra Expanded": "Stint+Ultra+Expanded",
  "Alfa Slab One": "Alfa+Slab+One",
  // Add more as needed
};

// Optionally, define default weights for each font
const fontDefaultWeights: Record<string, string> = {
  Roboto: "400,500,700",
  Inter: "400,500,700",
  "Open Sans": "400,700",
  Lato: "400,700",
  "DM Sans": "400,700",
  Poppins: "400,500,700",
  Anton: "400",
  Archivo: "200,300,400,500,600,700,800,900",
  "Archivo Black": "400",
  "DM Serif Display": "400",
  Cantarell: "400,700",
  "Fjalla One": "400",
  "Work Sans": "400,700",
  Ubuntu: "400,500,700",
  "Big Shoulders Display": "400,700",
  "Bricolage Grotesque": "400,700",
  "Della Respira": "400",
  "League Spartan": "400,700",
  Lora: "400,700",
  Mulish: "400,700",
  Oswald: "500",
  Philosopher: "400,700",
  "Playfair Display": "400,700",
  "Pontano Sans": "400",
  Questrial: "400",
  "Roboto Mono": "400,700",
  "Rozha One": "400",
  Rubik: "400,500,700",
  "Source Sans 3": "400,700",
  "Space Mono": "200,300,400,700",
  Syne: "400,500,600,700,800",
  Teko: "400,700",
  Yellowtail: "400",
  Chivo: "400,700",
  "PT Serif": "400,700",
  "Gentium Plus": "400,700",
  Bangers: "400",
  "Bebas Neue": "400",
  Montserrat: "200,300,400,500,600,700",
  Ultra: "400",
  "Stint Ultra Expanded": "400",
  "Alfa Slab One": "400",
  // Add more as needed
};

export function loadGoogleFont(fontName: string, weights?: string) {
  const apiName = fontApiNames[fontName];
  if (!apiName) {
    console.warn(`Font "${fontName}" not supported for dynamic loading.`);
    return;
  }
  const fontWeights = weights || fontDefaultWeights[fontName] || "400";
  const linkId = `dynamic-google-font-${apiName}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css?family=${apiName}:wght@${fontWeights}&display=swap`;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
}

export function getFontFamily(fontName: string): string {
  // Add more sophisticated fallbacks if desired
  return `${fontName}, Arial, sans-serif`;
}

export function loadBrandFonts(typography: {
  primaryFont: string;
  secondaryFont: string;
  highlightFont?: string;
}) {
  const { primaryFont, secondaryFont, highlightFont } = typography;

  // Load each unique font
  const uniqueFonts = [...new Set([primaryFont, secondaryFont, highlightFont])];

  uniqueFonts.forEach((fontName) => {
    if (fontName && fontName.trim() !== "") {
      loadGoogleFont(fontName);
    }
  });
}
