"use client";
import { motion } from "framer-motion";
import { LayoutTemplate } from "lucide-react";

export const BrandSectionHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <LayoutTemplate width={14} height={14} />
        <h2 className="ml-2 text-sm font-medium uppercase">Browse templates</h2>
      </motion.div>
    </div>
  );
};
