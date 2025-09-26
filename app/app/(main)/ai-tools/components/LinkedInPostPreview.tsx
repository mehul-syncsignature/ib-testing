/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import { MessageCircleMore, Repeat2, Send, ThumbsUp, Copy } from "lucide-react";
import { toast } from "sonner";
import LinkedInBrandMark from "./PostPreview/components/LinkedInBrandMark";

interface LinkedInPostPreviewProps {
  content: string;
  hashtags?: string[];
  imageUrl?: string;
}

const LinkedInPostPreview = ({
  content,
  imageUrl,
}: // hashtags = ["LINKEDIN"],
LinkedInPostPreviewProps) => {
  const [showFullText, setShowFullText] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyPost = async () => {
    if (!content.trim()) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Post copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy post");
    }
  };

  // Check if content would be clamped when content changes
  useEffect(() => {
    const checkIfClamped = () => {
      const element = contentRef.current;
      if (!element || !content.trim()) {
        setIsClamped(false);
        return;
      }

      // Store original classes and styles
      const originalClasses = element.className;
      const originalMaxHeight = element.style.maxHeight;

      // Temporarily remove all line-clamp classes and max-height to measure full content
      element.className = element.className
        .replace(/line-clamp-\d+/g, "")
        .replace(/line-clamp-none/g, "");
      element.style.maxHeight = "none";

      const fullHeight = element.scrollHeight;

      // Apply line-clamp-3 to measure clamped height
      element.classList.add("line-clamp-3");
      const clampedHeight = element.clientHeight;

      // Restore original classes and styles
      element.className = originalClasses;
      element.style.maxHeight = originalMaxHeight;

      // Content is clampable if full height exceeds clamped height
      setIsClamped(fullHeight > clampedHeight);
    };

    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(checkIfClamped, 10);

    return () => clearTimeout(timeoutId);
  }, [content]); // Only depend on content

  const formatPostText = (text: string) => {
    if (!text.trim()) {
      return (
        <span className="text-gray-400 italic">
          Your post content will appear here...
        </span>
      );
    }

    // Process markdown-style formatting
    let formattedText = text;

    // Handle bold text (**text**) - make sure to handle nested formatting
    formattedText = formattedText.replace(
      /\*\*((?:(?!\*\*).)*)\*\*/g,
      "<strong>$1</strong>"
    );

    // Handle italic text (*text*) - avoid matching ** patterns
    formattedText = formattedText.replace(
      /(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)/g,
      "<em>$1</em>"
    );

    // Handle hashtags
    formattedText = formattedText.replace(
      /#(\w+)/g,
      '<span class="text-blue-600 hover:underline cursor-pointer">#$1</span>'
    );

    // Handle mentions
    formattedText = formattedText.replace(
      /@(\w+)/g,
      '<span class="text-blue-600 hover:underline cursor-pointer">@$1</span>'
    );

    // Convert line breaks to HTML breaks
    formattedText = formattedText.replace(/\n/g, "<br />");

    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-3  max-w-lg mx-auto">
      {/* User Info */}
      <div className="px-4 pb-3">
        <div className="flex items-start justify-between">
          <LinkedInBrandMark />
          {content.trim() && (
            <button
              onClick={handleCopyPost}
              className="text-gray-400 hover:text-[#22808D] p-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
              title="Copy post text"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="h-[710px] overflow-y-auto scrollbar-hide">
        {/* Post Content */}
        <div className="text-[#050B1B] text-base leading-relaxed">
          <div className="px-4 mb-2">
            <div
              ref={contentRef}
              className={`mb-2 ${
                showFullText ? "line-clamp-none" : "line-clamp-3"
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
                ...more
              </button>
            )}

            {showFullText && isClamped && (
              <button
                onClick={() => setShowFullText(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ...less
              </button>
            )}
          </div>
        </div>

        {/* Hashtags */}
        {/* <div className="mt-4 text-[#1E7498] text-sm font-semibold">
        {hashtags.map((tag, index) => (
          <span key={index} className="mr-2">
            #{tag}
          </span>
        ))}
      </div> */}

        {/* Image section */}
        {imageUrl && (
          <div className="w-full  ">
            <img
              className="h-full w-full"
              src={imageUrl}
              alt="preview post img"
            />
          </div>
        )}
      </div>

      {/* Social Stats & Buttons */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span role="img" aria-label="thumbs-up">
              <img src="./assets/reaction1.svg" alt="reaction1" />
            </span>
            <span role="img" aria-label="clapping-hands">
              <img src="./assets/reaction2.svg" alt="reaction2" />
            </span>
            <span role="img" aria-label="heart">
              <img src="./assets/reaction3.svg" alt="reaction3" />
            </span>
            <span role="img" aria-label="light-bulb">
              <img src="./assets/reaction4.svg" alt="reaction4" />
            </span>
            <span role="img" aria-label="hugging-face">
              <img src="./assets/reaction5.svg" alt="reaction5" />
            </span>
            <span role="img" aria-label="hugging-face">
              <img src="./assets/reaction6.svg" alt="reaction6" />
            </span>
            <span>42 reactions</span>
          </div>
          <div className="flex space-x-2">
            <span className="font-xs">8 comments</span>
            <span className="font-extrabold">·</span>
            <span className="font-xs">3 reposts</span>
          </div>
        </div>
      </div>

      <div className="my-4 mx-4 flex justify-around text-[#000000BF]">
        <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors">
          <ThumbsUp className="h-5 w-5" />
          <span className="font-sm">Like</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors">
          <MessageCircleMore className="h-5 w-5" />

          <span className="font-sm">Comment</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors">
          <Repeat2 className="h-5 w-5" />
          <span className="font-sm">Repost</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors">
          <Send className="h-5 w-5" />
          <span className="font-sm">Send</span>
        </button>
      </div>
    </div>
  );
};

export default LinkedInPostPreview;
