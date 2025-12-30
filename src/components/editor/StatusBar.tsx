import React from 'react';

interface StatusBarProps {
  documentName: string;
  currentPage: number;
  totalPages: number;
  isSaved: boolean;
  wordCount: number;
  characterCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  documentName,
  currentPage,
  totalPages,
  isSaved,
  wordCount,
  characterCount,
}) => {
  return (
    <footer className="status-bar">
      <div className="status-bar-left">
        <span className="status-document-name">{documentName}</span>
      </div>
      
      <div className="status-bar-center">
        <span className="status-page">Page {currentPage} of {totalPages}</span>
        <span className="status-divider">|</span>
        <span className="status-saved">{isSaved ? 'Saved' : 'Unsaved'}</span>
      </div>
      
      <div className="status-bar-right">
        <span className="status-words">Words: {wordCount}</span>
        <span className="status-chars">Characters: {characterCount}</span>
      </div>
    </footer>
  );
};

export default StatusBar;
