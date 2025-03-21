import React, { useState, useRef, ChangeEvent } from 'react';
import clsx from 'clsx';

export type FileType = 'image' | 'document' | 'video' | 'audio' | 'any';

export interface FileItem {
  /**
   * Unique identifier for the file
   */
  id: string;
  
  /**
   * Original file object
   */
  file: File;
  
  /**
   * Preview URL for images
   */
  preview?: string;
  
  /**
   * File type
   */
  type: FileType;
  
  /**
   * Upload progress (0-100)
   */
  progress?: number;
  
  /**
   * Error message if upload failed
   */
  error?: string;
  
  /**
   * Whether the file is currently uploading
   */
  uploading?: boolean;
}

export interface FileTypeOption {
  /**
   * Value of the option
   */
  value: FileType;
  
  /**
   * Display label
   */
  label: string;
  
  /**
   * Accepted file extensions
   */
  accept: string;
  
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
}

export interface FileUploadProps {
  /**
   * Selected file type
   */
  selectedType: FileType;
  
  /**
   * Callback when file type changes
   * Only required when showTypeDropdown is true
   */
  onTypeChange?: (type: FileType) => void;
  
  /**
   * Available file type options
   */
  typeOptions?: FileTypeOption[];
  
  /**
   * Whether to show the file type dropdown
   * @default true
   */
  showTypeDropdown?: boolean;
  
  /**
   * Files that have been uploaded
   */
  files: FileItem[];
  
  /**
   * Callback when files are added
   */
  onFilesAdded: (files: File[]) => void;
  
  /**
   * Callback when a file is removed
   */
  onFileRemove: (fileId: string) => void;
  
  /**
   * Maximum number of files allowed
   * @default Infinity
   */
  maxFiles?: number;
  
  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxFileSize?: number;
  
  /**
   * Allow multiple file selection
   * @default true
   */
  multiple?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom drop zone content
   */
  dropzoneContent?: React.ReactNode;
  
  /**
   * Whether component is disabled
   */
  disabled?: boolean;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Help text
   */
  helperText?: string;
}

const DEFAULT_TYPE_OPTIONS: FileTypeOption[] = [
  {
    value: 'image',
    label: 'Images',
    accept: '.jpg,.jpeg,.png,.gif,.webp',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: 'document',
    label: 'Documents',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    value: 'video',
    label: 'Videos',
    accept: '.mp4,.webm,.avi,.mov,.wmv',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: 'audio',
    label: 'Audio',
    accept: '.mp3,.wav,.ogg,.m4a',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    value: 'any',
    label: 'Any File',
    accept: '*',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

/**
 * Format file size to human readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUpload: React.FC<FileUploadProps> = ({
  selectedType,
  onTypeChange = () => {},
  typeOptions = DEFAULT_TYPE_OPTIONS,
  showTypeDropdown = true,
  files = [],
  onFilesAdded,
  onFileRemove,
  maxFiles = Infinity,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  className = '',
  dropzoneContent,
  disabled = false,
  error,
  helperText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Find the current file type option
  const selectedTypeOption = typeOptions.find(option => option.value === selectedType) || typeOptions[0];
  
  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const fileList = Array.from(e.target.files);
    
    // Filter files by size
    const validFiles = fileList.filter(file => file.size <= maxFileSize);
    
    // Check if adding these files would exceed the max file count
    const totalFiles = files.length + validFiles.length;
    const filesToAdd = totalFiles > maxFiles 
      ? validFiles.slice(0, maxFiles - files.length) 
      : validFiles;
    
    if (filesToAdd.length > 0) {
      onFilesAdded(filesToAdd);
    }
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    
    const fileList = Array.from(e.dataTransfer.files);
    
    // Filter files by size and file type
    const typeOption = typeOptions.find(option => option.value === selectedType) || typeOptions[0];
    const extensions = typeOption.accept.split(',').filter(ext => ext !== '*');
    
    const validFiles = fileList.filter(file => {
      // Check file size
      if (file.size > maxFileSize) return false;
      
      // Always accept if file type is 'any'
      if (typeOption.value === 'any') return true;
      
      // Check file extension
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      return extensions.includes(fileExt);
    });
    
    // Check if adding these files would exceed the max file count
    const totalFiles = files.length + validFiles.length;
    const filesToAdd = totalFiles > maxFiles 
      ? validFiles.slice(0, maxFiles - files.length) 
      : validFiles;
    
    if (filesToAdd.length > 0) {
      onFilesAdded(filesToAdd);
    }
  };
  
  // Handle clicking the dropzone to open file dialog
  const handleDropzoneClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  // Handle type dropdown toggle
  const handleTypeToggle = () => {
    if (disabled) return;
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
  };
  
  // Handle type selection
  const handleTypeSelect = (type: FileType) => {
    onTypeChange(type);
    setIsTypeDropdownOpen(false);
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Determine if we should show the file limit warning
  const reachedFileLimit = files.length >= maxFiles;
  
  // Default dropzone content
  const defaultDropzoneContent = (
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-2 flex text-gray-600">
        <span>Drag and drop your files, or</span>
        <button className="mx-1 font-medium text-blue-600 hover:text-blue-500" onClick={(e) => { e.stopPropagation(); handleDropzoneClick(); }}>
          browse
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {reachedFileLimit 
          ? `Maximum ${maxFiles} files reached` 
          : `${selectedTypeOption.label} (${selectedTypeOption.accept}) up to ${formatFileSize(maxFileSize)}`}
      </p>
    </div>
  );
  
  return (
    <div className={clsx('space-y-4', className)}>
      {/* File type dropdown and upload area */}
      <div className="flex flex-col sm:flex-row gap-2">
        {showTypeDropdown && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className={clsx(
                'flex items-center justify-between w-full sm:w-48 px-4 py-2 border rounded-md shadow-sm text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                disabled 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              )}
              onClick={handleTypeToggle}
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={isTypeDropdownOpen}
            >
              <div className="flex items-center">
                <span className="mr-2">{selectedTypeOption.icon}</span>
                <span>{selectedTypeOption.label}</span>
              </div>
              <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isTypeDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 overflow-auto text-base max-h-60" role="listbox">
                  {typeOptions.map(option => (
                    <li
                      key={option.value}
                      className={clsx(
                        'cursor-pointer select-none relative py-2 pl-3 pr-9 flex items-center',
                        selectedType === option.value
                          ? 'text-blue-900 bg-blue-50'
                          : 'text-gray-900 hover:bg-gray-100'
                      )}
                      role="option"
                      aria-selected={selectedType === option.value}
                      onClick={() => handleTypeSelect(option.value)}
                    >
                      <span className="mr-2">{option.icon}</span>
                      <span className="block truncate">{option.label}</span>
                      
                      {selectedType === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div
          className={clsx(
            'flex-1 border-2 border-dashed rounded-md p-4 flex justify-center items-center cursor-pointer',
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
            error ? 'border-red-300' : ''
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropzoneClick}
          aria-disabled={disabled}
        >
          {dropzoneContent || defaultDropzoneContent}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={selectedTypeOption.accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled || reachedFileLimit}
          />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files ({files.length}{maxFiles !== Infinity && ` / ${maxFiles}`})</h3>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
            {files.map(file => (
              <li key={file.id} className="px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50">
                <div className="flex items-center min-w-0">
                  {/* File type icon */}
                  <div className="flex-shrink-0 mr-3">
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt={file.file.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                        {typeOptions.find(option => option.value === file.type)?.icon || 
                         typeOptions.find(option => option.value === 'any')?.icon}
                      </div>
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                      {file.error && (
                        <span className="ml-2 text-red-500">{file.error}</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Progress bar for uploading files */}
                  {file.uploading && typeof file.progress === 'number' && (
                    <div className="w-24 bg-gray-200 rounded-full h-2 ml-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Remove button */}
                {!file.uploading && (
                  <button
                    type="button"
                    className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => onFileRemove(file.id)}
                    disabled={disabled}
                  >
                    <span className="sr-only">Remove file</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 