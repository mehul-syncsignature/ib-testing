/* eslint-disable @next/next/no-img-element */
import { MessageCircleMore, Repeat, Send, ThumbsUp } from "lucide-react";
import LinkedInBrandMark from "./PostPreview/components/LinkedInBrandMark";

interface LinkedInPostPreviewProps {
  content: string;
  hashtags?: string[];
}

const LinkedInPostPreview = ({
  content,
}: // hashtags = ["LINKEDIN"],
LinkedInPostPreviewProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-3  max-w-lg mx-auto">
      {/* User Info */}
      <div className="px-4">
        <LinkedInBrandMark />
      </div>

      {/* Post Content */}
      <div className="text-[#050B1B] text-base leading-relaxed">
        <div className="px-4 mb-2">
          <p className="mb-2">{content}</p>
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
      <div className="w-full  ">
        <img
          className="h-full w-full"
          src="https://assets.dev.instantbranding.ai/user-assets/325cad67-e963-42d3-96d8-6f2d05215328/1758804452918-upload.png"
          alt="preview post img"
        />
      </div>

      {/* Social Stats & Buttons */}
      <div className="flex px-4 items-center justify-between border-b  border-gray-200 py-3">
        <div className="flex items-center space-x-2">
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
        </div>
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <span className="font-xs">88</span>
          <span className="font-extrabold">·</span>
          <span className="font-xs">4 Comments</span>
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
          <Repeat className="h-5 w-5" />
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
