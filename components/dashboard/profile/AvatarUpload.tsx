import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface AvatarUploadProps {
    currentAvatar: string;
    onUploadComplete: (url: string | null) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onUploadComplete }) => {
    const [preview, setPreview] = useState<string | null>(currentAvatar);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('يرجى اختيار صورة');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        await uploadToSupabase(file);
    };

    const uploadToSupabase = async (file: File) => {
        setUploading(true);
        try {
            if (!supabase) throw new Error("Supabase client not initialized");

            const fileExt = file.name.split('.').pop();
            const fileName = `avatar-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from('user-uploads')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage
                .from('user-uploads')
                .getPublicUrl(filePath);

            onUploadComplete(data.publicUrl);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`فشل رفع الصورة: ${error.message || 'Error'}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-4 border-indigo-600 shadow-xl">
                    {preview ? (
                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-900">
                            <Camera size={48} />
                        </div>
                    )}
                </div>

                {/* Upload Button Overlay */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-3 bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 hover:scale-110 active:scale-95 group-hover:block"
                >
                    {uploading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Upload size={20} className="text-white" />
                    )}
                </button>

                {/* Remove Button */}
                {preview && (
                    <button
                        onClick={() => {
                            setPreview(null);
                            onUploadComplete(null);
                        }}
                        className="absolute top-0 left-0 p-2 bg-rose-600 rounded-full shadow-lg hover:bg-rose-700 transition-all scale-0 group-hover:scale-100"
                    >
                        <X size={16} className="text-white" />
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">
                    اضغط لتغيير الصورة
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                    PNG, JPG, GIF (Max 2MB)
                </p>
            </div>
        </div>
    );
};
