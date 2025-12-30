import { useRef, useState } from 'react';
import { Plus, X, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
}

interface FileUploadButtonProps {
  onFilesSelected?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export function FileUploadButton({ 
  onFilesSelected, 
  maxFiles = 3,
  acceptedTypes = ['.txt', '.md', '.doc', '.docx']
}: FileUploadButtonProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    return acceptedTypes.includes(ext);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    // Check total count
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!isValidFile(file)) {
        alert(`Invalid file type: ${file.name}`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large: ${file.name}`);
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // For text files, read content
      if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.content = e.target?.result as string;
        };
        reader.readAsText(file);
      }

      newFiles.push(uploadedFile);
    }

    const allFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(allFiles);
    onFilesSelected?.(allFiles);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    const updated = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(updated);
    onFilesSelected?.(updated);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Button - Simple Plus Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-primary/10"
        title="Upload files (max 3)"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Selected Files Display - Compact Badges */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                'bg-primary/10 text-primary border border-primary/20',
                'hover:bg-primary/20 transition-colors group'
              )}
            >
              <FileText className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-[80px]">{file.name.split('.')[0]}</span>
              <button
                onClick={() => removeFile(file.id)}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded"
              >
                <X className="h-2.5 w-2.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

