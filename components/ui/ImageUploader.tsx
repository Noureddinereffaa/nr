import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { uploadImage } from '../../lib/storage';

interface ImageUploaderProps {
    currentImage?: string;
    onUpload: (url: string) => void;
    folder?: string;
    label?: string;
    aspectRatio?: string; // e.g., "16/9", "1/1", "4/3"
    maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    currentImage,
    onUpload,
    folder = 'general',
    label = 'رفع صورة',
    aspectRatio = '16/9',
    maxSizeMB = 5
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('نوع الملف غير مدعوم. استخدم JPG, PNG, GIF أو WebP');
            return false;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setError(`حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB}MB`);
            return false;
        }

        setError(null);
        return true;
    };

    const handleFile = useCallback(async (file: File) => {
        if (!validateFile(file)) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        setUploadStatus('idle');

        const url = await uploadImage(file, folder);

        setIsUploading(false);

        if (url) {
            setUploadStatus('success');
            setPreview(url);
            onUpload(url);
            setTimeout(() => setUploadStatus('idle'), 2000);
        } else {
            setUploadStatus('error');
            setError('فشل رفع الصورة. حاول مرة أخرى.');
        }
    }, [folder, onUpload, maxSizeMB]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-3" dir="rtl">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {label}
            </label>

            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden
                    ${isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 hover:border-indigo-500/50 bg-slate-900/30 hover:bg-slate-900/50'
                    }
                `}
                style={{ aspectRatio }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="hidden"
                />

                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                                className="p-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Upload Status Indicator */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <Loader2 size={32} className="text-indigo-500 animate-spin" />
                            </div>
                        )}
                        {uploadStatus === 'success' && (
                            <div className="absolute top-4 right-4 p-2 bg-green-500 rounded-full">
                                <Check size={16} className="text-white" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <div className={`p-4 rounded-2xl ${isDragging ? 'bg-indigo-500' : 'bg-white/5'} transition-colors`}>
                            {isUploading ? (
                                <Loader2 size={32} className="text-indigo-500 animate-spin" />
                            ) : (
                                <Upload size={32} className={isDragging ? 'text-white' : 'text-indigo-500'} />
                            )}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm mb-1">
                                {isDragging ? 'أفلت الصورة هنا' : 'اسحب وأفلت أو انقر للرفع'}
                            </p>
                            <p className="text-slate-500 text-[10px]">
                                JPG, PNG, GIF, WebP • حتى {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-4 py-2 rounded-xl">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
