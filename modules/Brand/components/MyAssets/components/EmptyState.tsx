"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Palette, Plus, Sparkles, MessageSquare, Star, Layers, ImageIcon, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import { AssetTypeKeys } from '@/contexts/AssetContext/types';

interface EmptyStateProps {
  selectedType: AssetTypeKeys | 'all';
}

const EMPTY_STATE_CONFIG: Record<AssetTypeKeys | 'all', {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  'all': {
    title: 'Your Canvas is Ready',
    description: 'Start creating amazing designs and they will appear here. Your creative journey begins with a single click.',
    cta: 'Create Your First Design',
    href: '/dashboard',
    icon: Palette
  },
  'social-banner': {
    title: 'No Social Banners Yet',
    description: 'Design stunning social media banners that make your brand stand out across all platforms.',
    cta: 'Create Social Banner',
    href: '/editor/social-banner',
    icon: Sparkles
  },
  'social-post': {
    title: 'Ready to Post?',
    description: 'Design engaging social media posts that capture attention and build your audience.',
    cta: 'Create Social Post',
    href: '/editor/social-post',
    icon: Plus
  },
  'quote-card': {
    title: 'Share Some Wisdom',
    description: 'Design beautiful, shareable quote cards that inspire and motivate your followers.',
    cta: 'Create Quote Card',
    href: '/editor/quote-card',
    icon: MessageSquare
  },
  'featured-post': {
    title: 'Highlight Your Best',
    description: 'Create eye-catching designs for your featured posts to draw in more readers.',
    cta: 'Create Featured Post',
    href: '/editor/featured-post',
    icon: Star
  },
  'mockup-post': {
    title: 'Showcase Your Work',
    description: 'Present your products and ideas professionally with polished mockup designs.',
    cta: 'Create Mockup Post',
    href: '/editor/mockup-post',
    icon: Layers
  },
  'textimg-post': {
    title: 'Words and Pictures',
    description: 'Combine powerful text with striking images for maximum impact on your audience.',
    cta: 'Create Text & Image Post',
    href: '/editor/textimg-post',
    icon: ImageIcon
  },
  'social-carousel': {
    title: 'Tell a Bigger Story',
    description: 'Design engaging carousels to guide your audience through a compelling narrative.',
    cta: 'Create Carousel',
    href: '/editor/social-carousel',
    icon: RotateCcw
  },
};

const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ selectedType }) => {
  const config = EMPTY_STATE_CONFIG[selectedType];
  const IconComponent = config.icon;

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center bg-transparent p-4">
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1 }}
        className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl bg-card p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          variants={FADE_IN_VARIANTS}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10"
        >
          <IconComponent className="h-10 w-10 text-primary" />
        </motion.div>

        {/* Content */}
        <motion.div
          variants={FADE_IN_VARIANTS}
          className="flex flex-col gap-2"
        >
          <h2 className="text-2xl font-semibold text-foreground">
            {config.title}
          </h2>
          <p className="text-muted-foreground">
            {config.description}
          </p>
        </motion.div>

        <motion.div variants={FADE_IN_VARIANTS}>
          <Button asChild size="lg">
            <Link href={config.href}>
              <Plus className="mr-2 h-4 w-4" />
              {config.cta}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};