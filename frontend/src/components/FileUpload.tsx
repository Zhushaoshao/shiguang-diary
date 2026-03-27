import { useMemo, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Film, Sparkles } from 'lucide-react';
import { useToastStore } from '../store/toastStore';
import MediaImage from './MediaImage';

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
  const showToast = useToastStore((state) => state.showToast);
  const isImageUpload = accept.includes('image');
  const isVideoUpload = accept.includes('video');

  const previewUrls = useMemo(
    () => value.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [value]
  );
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
        showToast(`文件 ${file.name} 超过 ${maxSize}MB 限制`, 'error', 3200);
        continue;
      }

      // 检查文件数量
      if (value.length + validFiles.length >= maxFiles) {
        showToast(`最多只能上传 ${maxFiles} 个文件`, 'info');
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
      showToast(`已添加 ${validFiles.length} 个文件`, 'success');
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="label-paper mb-0">{label}</label>
        <span className="text-xs text-neutral-secondary whitespace-nowrap">
          {existingFiles.length + value.length}/{maxFiles}
        </span>
      </div>

      {/* 上传区域 */}
      <div
        className={`card-paper !p-0 overflow-hidden border-2 border-dashed ${
          dragActive
            ? 'border-primary-500 bg-primary-50/60 shadow-glow'
            : 'border-neutral-border hover:border-primary-300'
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

        <div className="px-5 py-8 sm:px-6 sm:py-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-paper ${dragActive ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500'}`}>
              {isVideoUpload ? <Film size={26} /> : <Upload size={26} />}
            </div>
            <div>
              <p className="text-sm sm:text-base font-medium text-neutral-ink">
                {dragActive ? '松开即可开始添加文件' : '拖拽文件到此处，或点击选择文件'}
              </p>
              <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
                {multiple ? `最多 ${maxFiles} 个文件，` : ''}单个文件不超过 {maxSize}MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-paper-primary"
            >
              <Sparkles size={16} />
              <span>选择文件</span>
            </button>
          </div>
        </div>
      </div>

      {/* 文件预览 */}
      {preview && (existingFiles.length > 0 || value.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {existingFiles.map((filename, index) => (
            <div
              key={`existing-${index}`}
              className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-bg border border-primary-200 shadow-paper-sm"
            >
              {isImageUpload ? (
                <MediaImage
                  src={getFileUrl(filename)}
                  alt={filename}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              ) : isVideoUpload ? (
                <video src={getFileUrl(filename)} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-secondary">
                  <ImageIcon size={32} />
                </div>
              )}

              <div className="absolute top-2 left-2 badge-paper bg-primary-500 text-white text-[11px] px-2 py-1">
                已有
              </div>

              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(filename)}
                  className="absolute top-2 right-2 icon-action-btn w-8 h-8 rounded-full bg-red-600 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="删除文件"
                >
                  <X size={14} />
                </button>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-[11px] p-2 truncate">
                {filename}
              </div>
            </div>
          ))}

          {previewUrls.map(({ file, url }, index) => (
            <div
              key={`new-${file.name}-${index}`}
              className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-bg border border-neutral-border shadow-paper-sm"
            >
              {file.type.startsWith('image/') ? (
                <MediaImage
                  src={url}
                  alt={file.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              ) : file.type.startsWith('video/') ? (
                <video src={url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-secondary">
                  <ImageIcon size={32} />
                </div>
              )}

              <div className="absolute top-2 left-2 badge-paper bg-emerald-500 text-white text-[11px] px-2 py-1">
                新增
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 icon-action-btn w-8 h-8 rounded-full bg-red-600 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="删除文件"
              >
                <X size={14} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-[11px] p-2 truncate">
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

