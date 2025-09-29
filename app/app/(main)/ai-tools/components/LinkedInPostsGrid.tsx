"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinkedInPostPreview from "./LinkedInPostPreview";

interface LinkedInPost {
  id: string;
  content: string;
  imageUrl?: string;
  hashtags?: string[];
}

interface LinkedInPostsGridProps {
  posts: LinkedInPost[];
  className?: string;
}

export const LinkedInPostsGrid: React.FC<LinkedInPostsGridProps> = ({
  posts,
  className = "",
}) => {
  const gridClasses = useMemo(() => {
    // Responsive grid that adapts to different screen sizes with larger posts
    return "grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8";
  }, []);

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        Generate your first LinkedIn post to see it appear here
      </p>
    </motion.div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      <AnimatePresence mode="wait">
        {!posts ? (
          <EmptyState />
        ) : (
          <motion.div
            key="posts-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={gridClasses}
          >
            {posts.map((post, index) => (
              <LinkedInPostPreview
                key={post.id}
                content={post.content}
                imageUrl={post.imageUrl}
                hashtags={post.hashtags}
                index={index}
                className="w-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkedInPostsGrid;