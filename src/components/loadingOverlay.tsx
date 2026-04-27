import React from "react";

interface LoadingOverlayProps {
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ className = "" }) => (
  <div
    className={`absolute inset-0 backdrop-blur-[.5px] flex items-center justify-center z-10 ${className}`}
  >
    <div className="w-10 h-10 border-4 border-geekblue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default LoadingOverlay;
