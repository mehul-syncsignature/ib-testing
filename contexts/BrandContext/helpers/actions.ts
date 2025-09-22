// contexts/BrandContext/helpers/actions.ts
import { BrandState, Brand } from "../types";

export const actions = {
  setColors: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    colors: Partial<Brand["config"]["colors"]>
  ) => {
    setState((prev) => {
      const newColors = { ...prev.brand.config.colors, ...colors };
      // Only update if colors actually changed
      if (
        JSON.stringify(newColors) === JSON.stringify(prev.brand.config.colors)
      ) {
        return prev;
      }
      const newState = {
        ...prev,
        brand: {
          ...prev.brand,
          config: {
            ...prev.brand.config,
            colors: newColors,
          },
        },
        isDirty: true,
      };
      
      return newState;
    });
  },

  setOriginalColors: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    originalColors: Partial<Brand["config"]["originalColors"]>
  ) => {
    setState((prev) => {
      const newOriginalColors = {
        ...prev.brand.config.originalColors,
        ...originalColors,
      };
      // Only update if originalColors actually changed
      if (
        JSON.stringify(newOriginalColors) ===
        JSON.stringify(prev.brand.config.originalColors)
      ) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          config: {
            ...prev.brand.config,
            originalColors: newOriginalColors,
          },
        },
        isDirty: true,
      };
    });
  },

  setTypography: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    typography: Partial<Brand["config"]["typography"]>
  ) => {
    setState((prev) => {
      const newTypography = { ...prev.brand.config.typography, ...typography };
      // Only update if typography actually changed
      if (
        JSON.stringify(newTypography) ===
        JSON.stringify(prev.brand.config.typography)
      ) {
        return prev;
      }
      const newState = {
        ...prev,
        brand: {
          ...prev.brand,
          config: {
            ...prev.brand.config,
            typography: newTypography,
          },
        },
        isDirty: true,
      };
      
      return newState;
    });
  },

  setIsDarkMode: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    isDarkMode: boolean
  ) => {
    setState((prev) => {
      // Only update if isDarkMode actually changed
      if (prev.brand.config.isDarkMode === isDarkMode) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          config: {
            ...prev.brand.config,
            isDarkMode,
          },
        },
        isDirty: true,
      };
    });
  },

  setMonochrome: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    monochrome: boolean
  ) => {
    setState((prev) => {
      // Only update if isDarkMode actually changed
      if (prev.brand.config.monochrome === monochrome) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          config: {
            ...prev.brand.config,
            monochrome,
          },
        },
        isDirty: true,
      };
    });
  },

  setName: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    name: string
  ) => {
    setState((prev) => {
      // Only update if name actually changed
      if (prev.brand.name === name) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          name,
        },
        isDirty: true,
      };
    });
  },

  setSocialLinks: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    socialLinks: Partial<Brand["socialLinks"]>
  ) => {
    setState((prev) => {
      // Filter out undefined values to maintain Record<string, string> type
      const filteredSocialLinks = Object.fromEntries(
        Object.entries(socialLinks).filter(([, value]) => value !== undefined)
      ) as Record<string, string>;

      const newSocialLinks = {
        ...prev.brand.socialLinks,
        ...filteredSocialLinks,
      };
      // Only update if socialLinks actually changed
      if (
        JSON.stringify(newSocialLinks) ===
        JSON.stringify(prev.brand.socialLinks)
      ) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          socialLinks: newSocialLinks,
        },
        isDirty: true,
      };
    });
  },

  setBrandImages: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    brandImages: string[]
  ) => {
    setState((prev) => {
      // Only update if brandImages actually changed
      if (
        JSON.stringify(brandImages) === JSON.stringify(prev.brand.brandImages)
      ) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          brandImages,
        },
        isDirty: true,
      };
    });
  },

  setInfoQuestions: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    infoQuestions: Partial<Brand["infoQuestions"]>
  ) => {
    setState((prev) => {
      const newInfoQuestions = {
        ...prev.brand.infoQuestions,
        ...infoQuestions,
      };
      // Only update if infoQuestions actually changed
      if (
        JSON.stringify(newInfoQuestions) ===
        JSON.stringify(prev.brand.infoQuestions)
      ) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          infoQuestions: newInfoQuestions,
        },
        isDirty: true,
      };
    });
  },

  setBrandMark: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    brandMark: Partial<Brand["brandMark"]>
  ) => {
    setState((prev) => {
      const newBrandMark = { ...prev.brand.brandMark, ...brandMark };
      // Only update if brandMark actually changed
      if (
        JSON.stringify(newBrandMark) === JSON.stringify(prev.brand.brandMark)
      ) {
        return prev;
      }
      return {
        ...prev,
        brand: {
          ...prev.brand,
          brandMark: newBrandMark,
        },
        isDirty: true,
      };
    });
  },

  setBrand: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    brand: Brand
  ) => {
    setState((prev) => ({
      ...prev,
      brand,
    }));
  },

  setBrands: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    brands: Brand[]
  ) => {
    setState((prev) => ({
      ...prev,
      brands,
    }));
  },

  setIsDirty: (
    setState: React.Dispatch<React.SetStateAction<BrandState>>,
    isDirty: boolean
  ) => {
    setState((prev) => {
      // Only update if isDirty actually changed
      if (prev.isDirty === isDirty) {
        return prev;
      }
      return {
        ...prev,
        isDirty,
      };
    });
  },
};
