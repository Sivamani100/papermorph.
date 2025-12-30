import React from 'react';
import { useUserStore } from '@/state/useUserStore';
import { FileText, Hash, Type } from 'lucide-react';

interface StatusBarProps {
  currentPage: number;
  totalPages: number;
  wordCount: number;
  characterCount: number;
  documentName: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  currentPage,
  totalPages,
  wordCount,
  characterCount,
  documentName
}) => {
  const { theme } = useUserStore();

  return (
    <div className={`flex items-center justify-between px-4 py-2 text-sm border-t transition-colors ${
      theme === 'dark' 
        ? 'bg-[#000000] border-gray-800 text-gray-300' 
        : 'bg-[#ffffff] border-gray-200 text-gray-600'
    }`}>
      {/* Left side - Document info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="truncate max-w-[250px] font-medium">{documentName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="font-medium">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Right side - Statistics */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <span className="font-medium">{wordCount} words</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="font-medium">{characterCount} characters</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
