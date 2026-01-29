import React, { useCallback, useState } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, Archive, AlertCircle, Check } from 'lucide-react';
import { fileUploadService, UploadResult } from '../../lib/services/fileUploadService';

/**
 * Props for the FileUploader component.
 */
export interface FileUploaderProps {
    /** Callback function triggered after successful file uploads */
    onFilesUploaded?: (results: UploadResult[]) => void;
    /** Maximum number of files allowed to be selected at once (default: 5) */
    maxFiles?: number;
    /** Maximum size for each file in Megabytes (default: 10) */
    maxSizeMB?: number;
    /** Array of allowed MIME types (e.g., ['image/png', 'application/pdf']) */
    allowedTypes?: string[];
    /** HTML accept attribute for the file input (e.g., '.jpg,.pdf') */
    accept?: string;
    /** Whether to allow selecting multiple files (default: true) */
    multiple?: boolean;
    /** Optional CSS class names for the container */
    className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onFilesUploaded,
    maxFiles = 5,
    maxSizeMB = 10,
    allowedTypes,
    accept = 'image/*,.pdf,.doc,.docx,.zip',
    multiple = true,
    className = ''
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
    const [error, setError] = useState<string>('');

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, [maxFiles]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    }, [maxFiles]);

    const handleFiles = (files: File[]) => {
        setError('');

        // Check max files
        if (selectedFiles.length + files.length > maxFiles) {
            setError(`الحد الأقصى ${maxFiles} ملفات فقط`);
            return;
        }

        // Validate each file
        const validFiles: File[] = [];
        for (const file of files) {
            const validation = fileUploadService.validateFile(file, { maxSizeMB, allowedTypes });
            if (validation.valid) {
                validFiles.push(file);
            } else {
                setError(validation.error || 'ملف غير صالح');
            }
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setError('');
        setUploadResults([]);

        try {
            const results = await fileUploadService.uploadFiles(selectedFiles, { maxSizeMB, allowedTypes });
            setUploadResults(results);

            const successfulUploads = results.filter(r => r.success);
            if (successfulUploads.length > 0 && onFilesUploaded) {
                onFilesUploaded(successfulUploads);
            }

            const failedUploads = results.filter(r => !r.success);
            if (failedUploads.length > 0) {
                setError(`فشل رفع ${failedUploads.length} ملف`);
            } else {
                // Clear selected files on complete success
                setSelectedFiles([]);
            }
        } catch (err) {
            setError('حدث خطأ أثناء رفع الملفات');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon size={20} className="text-indigo-500" />;
        if (file.type === 'application/pdf') return <FileText size={20} className="text-red-500" />;
        if (file.type.includes('zip')) return <Archive size={20} className="text-amber-500" />;
        return <File size={20} className="text-slate-500" />;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Drag & Drop Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-white/10 bg-slate-950/50 hover:border-indigo-500/50'
                    }`}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="pointer-events-none">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <Upload size={32} className="text-indigo-500" />
                    </div>
                    <p className="text-white font-bold mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
                    <p className="text-slate-500 text-sm">
                        الحد الأقصى: {maxSizeMB}MB • الأنواع المدعومة: صور، PDF، مستندات
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-400">
                            الملفات المحددة ({selectedFiles.length})
                        </p>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    جاري الرفع...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    رفع الملفات
                                </>
                            )}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-slate-900 border border-white/5 rounded-xl"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {getFileIcon(file)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-slate-500 text-xs">
                                            {fileUploadService.formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                {!uploading && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                                {uploadResults[index]?.success && (
                                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                        <Check size={16} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
