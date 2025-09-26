"use client";
import { Clock } from "lucide-react";

interface RecentCardProps {
  isActive: boolean;
  onClick: () => void;
}

export const RecentCard = ({ isActive, onClick }: RecentCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#F1F3F3] relative flex flex-col
        w-[250px] h-[200px] rounded-lg overflow-hidden 
        shadow-md cursor-pointer border border-[#E8E8E8] 
        hover:border-primary transition-colors duration-200 ${
          isActive ? "border-primary border-2" : ""
        }`}
    >
      {/* Recent mockup */}
      <div className="absolute w-[60%] h-[200px] top-[20px] left-[20%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2" />
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded" />
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1" />
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow bg-blue-100 my-1" />
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded" />
                <div className="w-4 h-1 bg-[#EBEBEB] rounded" />
                <div className="w-4 h-1 bg-[#EBEBEB] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform label */}
      <div className="absolute bottom-0 left-0 right-0 w-full flex items-center px-3 py-2 bg-[#F1F3F3] border-t border-[#E1E3E3]">
        <div className="flex items-center">
          <Clock size={20} className="text-gray-600 mr-2" />
          <span className="text-sm text-gray-700">Recent</span>
        </div>
      </div>
    </div>
  );
};
