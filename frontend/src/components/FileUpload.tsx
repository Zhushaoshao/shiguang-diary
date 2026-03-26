import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // MB
  value: File[];
  onChange: (files: File[]) => void;
  preview?: boolean;
  existingFiles?: string[]; // 已有文件的文件名
  onRemoveExisting?: (filename: string) => void; // 删除已有文件的回调
}

const FileUpload = ({
  label,
  accept,
  multiple = false,
  maxFiles = 1,
  maxSize = 10,
  value,
  onChange,
  preview = true,
  existingFiles = [],
  onRemoveExisting,
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 获取文件 URL
  const getFileUrl = (filename: string) => {
    return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${filename}`;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        alert(`文件 ${file.name} 超过 ${maxSize}MB 限制`);
        continue;
      }

      // 检查文件数量
      if (value.length + validFiles.length >= maxFiles) {
        alert(`最多只能上传 ${maxFiles} 个文件`);
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* 上传区域 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-label={label}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload size={32} className="text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-primary hover:text-secondary font-medium"
            >
              点击上传
            </button>
            <span> 或拖拽文件到此处</span>
          </div>
          <p className="text-xs text-gray-500">
            {multiple ? `最多 ${maxFiles} 个文件，` : ''}
            单个文件不超过 {maxSize}MB
          </p>
        </div>
      </div>

      {/* 文件预览 */}
      {preview && (existingFiles.length > 0 || value.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* 已有文件 */}
          {existingFiles.map((filename, index) => (
            <div
              key={`existing-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-primary-300"
            >
              {accept.includes('image') ? (
                <img
                  src={getFileUrl(filename)}
                  alt={filename}
                  className="w-full h-full object-cover"
                />
              ) : accept.includes('video') ? (
                <video
                  src={getFileUrl(filename)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
              )}

              {/* 已有文件标记 */}
              <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                已有
              </div>

              {/* 删除按钮 */}
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(filename)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="删除文件"
                >
                  <X size={14} />
                </button>
              )}

              {/* 文件名 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                {filename}
              </div>
            </div>
          ))}

          {/* 新上传的文件 */}
          {value.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={getPreviewUrl(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
              )}

              {/* 删除按钮 */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="删除文件"
              >
                <X size={14} />
              </button>

              {/* 文件名 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

