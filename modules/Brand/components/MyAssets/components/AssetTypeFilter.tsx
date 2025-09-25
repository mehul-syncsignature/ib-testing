"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AssetTypeKeys } from '@/contexts/AssetContext/types';
import { Button } from '@/components/ui/button';

// Props remain the same
interface AssetTypeFilterProps {
  selectedType: AssetTypeKeys | 'all';
  onTypeChange: (type: AssetTypeKeys | 'all') => void;
  designCounts: Record<AssetTypeKeys | 'all', number>;
}

// Simplified config - we only need labels now. Colors are handled by state.
const ASSET_TYPE_CONFIG: Record<AssetTypeKeys | 'all', { label: string }> = {
  'all': { label: 'All Designs' },
  'social-banner': { label: 'Banners' },
  'social-post': { label: 'Posts' },
  'quote-card': { label: 'Quotes' },
  'featured-post': { label: 'Featured' },
  'mockup-post': { label: 'Mockups' },
  'textimg-post': { label: 'Text & Image' },
  'social-carousel': { label: 'Carousels' },
};

// A more polished and theme-aligned filter component
export const AssetTypeFilter: React.FC<AssetTypeFilterProps> = ({
  selectedType,
  onTypeChange,
  designCounts,
}) => {
  const assetTypes = Object.keys(ASSET_TYPE_CONFIG) as (AssetTypeKeys | 'all')[];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mb-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        {assetTypes.map((type) => {
          const count = designCounts[type] || 0;
          if (count === 0 && type !== 'all') {
            return null;
          }

          const isSelected = selectedType === type;

          return (
            <Button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm
                border-2 border-transparent transition-all duration-100 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary select-none
                ${isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <span>{ASSET_TYPE_CONFIG[type].label}</span>
              
              {/* Refined Count Badge */}
              <span className={`
                flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-full text-xs font-bold
                ${isSelected 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};
