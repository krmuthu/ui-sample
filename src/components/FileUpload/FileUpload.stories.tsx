import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FileUpload, FileItem, FileType } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

// Basic example with controlled state
const BasicExample = () => {
  const [selectedType, setSelectedType] = useState<FileType>('image');
  const [files, setFiles] = useState<FileItem[]>([]);
  
  const handleFilesAdded = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      type: selectedType,
      preview: selectedType === 'image' ? URL.createObjectURL(file) : undefined,
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
  };
  
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => {
      // Revoke object URL to avoid memory leaks
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };
  
  return (
    <div className="w-full max-w-2xl p-4">
      <FileUpload
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        maxFiles={5}
        helperText="Upload up to 5 files, max 10MB each"
      />
    </div>
  );
};

// Example with upload simulation
const UploadSimulationExample = () => {
  const [selectedType, setSelectedType] = useState<FileType>('any');
  const [files, setFiles] = useState<FileItem[]>([]);
  
  const handleFilesAdded = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      type: selectedType,
      preview: selectedType === 'image' ? URL.createObjectURL(file) : undefined,
      uploading: true,
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
    
    // Simulate upload progress for each file
    newFileItems.forEach(fileItem => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, uploading: false, progress: 100 } : f
          ));
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, progress } : f
          ));
        }
      }, 300);
    });
  };
  
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };
  
  return (
    <div className="w-full max-w-2xl p-4">
      <FileUpload
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        helperText="Files will simulate upload progress"
      />
    </div>
  );
};

// Example with error handling
const ErrorHandlingExample = () => {
  const [selectedType, setSelectedType] = useState<FileType>('document');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  
  const handleFilesAdded = (newFiles: File[]) => {
    // Example validation - checking if file is too large
    const maxSize = 2 * 1024 * 1024; // 2MB
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    setError(undefined);
    
    const newFileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      type: selectedType,
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
  };
  
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (files.length === 1) {
      setError(undefined);
    }
  };
  
  return (
    <div className="w-full max-w-2xl p-4">
      <FileUpload
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        maxFileSize={2 * 1024 * 1024} // 2MB
        error={error}
        helperText="Maximum file size is 2MB"
      />
    </div>
  );
};

// Example with custom dropzone content
const CustomDropzoneExample = () => {
  const [selectedType, setSelectedType] = useState<FileType>('image');
  const [files, setFiles] = useState<FileItem[]>([]);
  
  const handleFilesAdded = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      type: selectedType,
      preview: selectedType === 'image' ? URL.createObjectURL(file) : undefined,
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
  };
  
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };
  
  const customDropzoneContent = (
    <div className="text-center">
      <div className="p-4 bg-blue-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-blue-800">Upload your images</h3>
        <p className="mt-1 text-xs text-blue-700">Drag and drop or click to browse</p>
      </div>
    </div>
  );
  
  return (
    <div className="w-full max-w-2xl p-4">
      <FileUpload
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        dropzoneContent={customDropzoneContent}
      />
    </div>
  );
};

// Example without type dropdown
const FixedTypeExample = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  
  const handleFilesAdded = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      type: 'document',
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
  };
  
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  return (
    <div className="w-full max-w-2xl p-4">
      <h3 className="text-lg font-medium mb-3">Document Upload</h3>
      <FileUpload
        selectedType="document"
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        showTypeDropdown={false}
        helperText="Upload document files only (.pdf, .doc, etc.)"
      />
    </div>
  );
};

// Simple example with fixed document type and no dropdown
const SimpleDocumentUploadExample = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  
  const handleFilesAdded = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      type: 'document',
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
  };
  
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  return (
    <div className="w-full max-w-2xl p-4">
      <h3 className="text-lg font-medium mb-3">Document Upload</h3>
      <FileUpload
        selectedType="document"
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        showTypeDropdown={false}
        helperText="Upload document files only (.pdf, .doc, etc.)"
      />
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const UploadSimulation: Story = {
  render: () => <UploadSimulationExample />,
};

export const ErrorHandling: Story = {
  render: () => <ErrorHandlingExample />,
};

export const CustomDropzone: Story = {
  render: () => <CustomDropzoneExample />,
};

export const FixedType: Story = {
  render: () => <FixedTypeExample />,
};

export const SimpleDocumentUpload: Story = {
  render: () => <SimpleDocumentUploadExample />,
};

export const Disabled: Story = {
  render: () => {
    const [selectedType, setSelectedType] = useState<FileType>('document');
    const [files] = useState<FileItem[]>([]);
    
    return (
      <div className="w-full max-w-2xl p-4">
        <FileUpload
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          files={files}
          onFilesAdded={() => {}}
          onFileRemove={() => {}}
          disabled={true}
          helperText="This upload component is disabled"
        />
      </div>
    );
  },
}; 