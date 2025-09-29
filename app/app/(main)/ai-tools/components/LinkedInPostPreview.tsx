/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import { MessageCircleMore, Repeat2, Send, ThumbsUp, Copy } from "lucide-react";
import { toast } from "sonner";
import LinkedInBrandMark from "./PostPreview/components/LinkedInBrandMark";
import { useTemplateWidth } from "../../design-templates/hooks/useTemplateWidth";
import { motion } from "framer-motion";

interface LinkedInPostPreviewProps {
  content: string;
  hashtags?: string[];
  imageUrl?: string;
  className?: string;
  index?: number;
}

const LinkedInPostPreview = ({
  content,
  imageUrl,
  className = "",
  index = 0,
}: LinkedInPostPreviewProps) => {
  const [showFullText, setShowFullText] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // This is the outermost ref now
  const { templateWidth } = useTemplateWidth(containerRef);

  const baseWidth = 520; 
  const scale = templateWidth > 0 ? Math.min(templateWidth / baseWidth, 1) : 1;

  const handleCopyPost = async () => {
    if (!content.trim()) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Post copied to clipboard!");
    } catch {
      toast.error("Failed to copy post");
    }
  };

  useEffect(() => {
    if (!imageUrl) {
      setIsImageLoading(false);
      return;
    }
    
    setIsImageLoading(true);
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsImageLoading(false);
    img.onerror = () => {
      console.error("Failed to load image preview.");
      setIsImageLoading(false);
    };
  }, [imageUrl]);


  useEffect(() => {
    const checkIfClamped = () => {
      const element = contentRef.current;
      if (!element || !content.trim()) {
        setIsClamped(false);
        return;
      }

      const originalClassName = element.className;
      element.className = originalClassName.replace(/line-clamp-\d+/g, "");
      
      const isContentClamped = element.scrollHeight > element.clientHeight;
      
      element.className = originalClassName;
      
      setIsClamped(isContentClamped);
    };
    
    const animationFrameId = requestAnimationFrame(checkIfClamped);

    return () => cancelAnimationFrame(animationFrameId);
  }, [content, showFullText, templateWidth, imageUrl]);


  const formatPostText = (text: string) => {
    if (!text.trim()) {
      return (
        <span className="text-gray-400 italic">
          Your post content will appear here...
        </span>
      );
    }
    const formattedText = text
      .replace(/\*\*((?:(?!\*\*).)*)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)/g, "<em>$1</em>")
      .replace(/#(\w+)/g, '<span class="text-blue-600 hover:underline cursor-pointer">#$1</span>')
      .replace(/@(\w+)/g, '<span class="text-blue-600 hover:underline cursor-pointer">@$1</span>')
      .replace(/\n/g, "<br />");

    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <motion.div
      ref={containerRef} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={`w-full ${className}`} // This div takes full width of its parent
    >
      <div 
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex mx-auto max-h-fit" // Added mx-auto here
        style={{
          maxWidth: scale > 0 ? `${baseWidth * scale}px` : '100%',
        }}
      >
        <div 
          className="w-full flex flex-col"
          style={{
            transform: scale < 1 ? `scale(${scale})` : 'none',
            transformOrigin: 'top center',
            width: scale < 1 ? `${baseWidth}px` : '100%',
          }}
        >
          {/* User Info */}
          <div className="px-4 pt-3 pb-3">
            <div className="flex items-start justify-between">
              <LinkedInBrandMark />
              {content.trim() && (
                <button
                  onClick={handleCopyPost}
                  className="text-gray-400 hover:text-[#22808D] p-2 rounded-lg hover:bg-gray-50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Copy post text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {/* Post Content */}
            <div className="px-4 mb-2 text-[#050B1B] text-base leading-relaxed">
              <div
                ref={contentRef}
                className={`transition-all duration-300 ${
                  showFullText ? "" : imageUrl ? "line-clamp-3" : "line-clamp-5"
                }`}
              >
                {formatPostText(content)}
              </div>

              {/* See more/less buttons */}
              {!showFullText && isClamped && (
                <button
                  onClick={() => setShowFullText(true)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ...see more
                </button>
              )}

              {showFullText && isClamped && (
                <button
                  onClick={() => setShowFullText(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ...see less
                </button>
              )}
            </div>

            {/* Image section */}
            {imageUrl && (
              <div className="w-full px-0.5 mt-2">
                {isImageLoading ? (
                  <div className="w-full bg-gray-200 animate-pulse aspect-video rounded-sm" />
                ) : (
                  <img
                    className="h-auto w-full object-contain"
                    src={imageUrl}
                    alt="Post preview"
                  />
                )}
              </div>
            )}
          </div>

          {/* Social Stats & Buttons */}
          <div className="mt-auto pt-2">
            <div className="px-4 py-3 border-b border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                    <span role="img" aria-label="reactions"><img src="/assets/reaction1.svg" alt="reaction1" className="w-4 h-4" /></span>
                    <span role="img" aria-label="reactions"><img src="/assets/reaction2.svg" alt="reaction2" className="w-4 h-4" /></span>
                    <span role="img" aria-label="reactions"><img src="/assets/reaction3.svg" alt="reaction3" className="w-4 h-4" /></span>
                    <span role="img" aria-label="reactions"><img src="/assets/reaction4.svg" alt="reaction4" className="w-4 h-4" /></span>
                    <span role="img" aria-label="reactions"><img src="/assets/reaction5.svg" alt="reaction5" className="w-4 h-4" /></span>
                    <span role="img" aria-label="reactions"><img src="/assets/reaction6.svg" alt="reaction6" className="w-4 h-4" /></span>
                    <span>42 reactions</span>
                </div>
                <div className="flex space-x-2">
                  <span>8 comments</span>
                  <span className="font-extrabold">·</span>
                  <span>3 reposts</span>
                </div>
              </div>
            </div>

            <div className="my-2 mx-4 flex justify-around text-[#000000BF]">
              <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors hover:bg-gray-50 rounded-lg px-3 py-2">
                <ThumbsUp className="h-4 w-4" /> <span className="text-sm font-medium">Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors hover:bg-gray-50 rounded-lg px-3 py-2">
                <MessageCircleMore className="h-4 w-4" /> <span className="text-sm font-medium">Comment</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors hover:bg-gray-50 rounded-lg px-3 py-2">
                <Repeat2 className="h-4 w-4" /> <span className="text-sm font-medium">Repost</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors hover:bg-gray-50 rounded-lg px-3 py-2">
                <Send className="h-4 w-4" /> <span className="text-sm font-medium">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LinkedInPostPreview;