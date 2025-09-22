import React from "react";

interface ProgressBarProps {
  progress: number;
  indeterminate?: boolean;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  indeterminate = false,
  height = 6,
  className = "",
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`h-full ${
          indeterminate
            ? "animate-pulse bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"
            : "bg-blue-500"
        }`}
        style={{
          width: indeterminate ? "100%" : `${clampedProgress}%`,
          transition: "width 0.3s ease-in-out",
          animation: indeterminate
            ? "progress-bar-indeterminate 1.5s infinite ease-in-out"
            : "none",
          backgroundSize: indeterminate ? "200% 100%" : "initial",
        }}
      />

      {/* Animation styles for indeterminate state */}
      <style jsx>{`
        @keyframes progress-bar-indeterminate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
