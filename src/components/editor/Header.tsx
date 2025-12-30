import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  Download, 
  ChevronDown, 
  Sparkles, 
  Sun, 
  Moon,
  Settings,
  User,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  documentName: string;
  onDocumentNameChange: (name: string) => void;
  isSaved: boolean;
  onSave: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
  documentName,
  onDocumentNameChange,
  isSaved,
  onSave,
  onExportDocx,
  onExportPdf,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <header className="header-bar">
      <div className="header-left">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">
            <FileText size={18} />
          </div>
          <span className="logo-text">Papermorph</span>
        </div>

        {/* Document Title */}
        <div className="header-document">
          {isEditing ? (
            <input
              type="text"
              value={documentName}
              onChange={(e) => onDocumentNameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="document-title-input"
              autoFocus
            />
          ) : (
            <span 
              className="document-title"
              onClick={() => setIsEditing(true)}
            >
              {documentName}
            </span>
          )}
          
          {/* Save Status */}
          <span className="save-status">
            <Check size={14} className="save-status-icon" />
            <span>Saved</span>
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Save Button */}
        <button className="header-btn" onClick={onSave}>
          <Save size={16} />
          <span>Save</span>
        </button>

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="header-btn">
              <Download size={16} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dropdown-menu-content">
            <DropdownMenuItem onClick={onExportDocx}>
              Export as DOCX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPdf}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Features Button */}
        <button className="header-btn header-btn-features">
          <Sparkles size={16} />
          <span>Features</span>
        </button>

        {/* Theme Toggle */}
        <button className="header-icon-btn" onClick={onToggleTheme}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Settings */}
        <button className="header-icon-btn">
          <Settings size={18} />
        </button>

        {/* Guest Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="header-guest-btn">
              <User size={16} />
              <span>Guest</span>
              <ChevronDown size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dropdown-menu-content">
            <DropdownMenuItem>Sign In</DropdownMenuItem>
            <DropdownMenuItem>Create Account</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
