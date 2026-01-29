import { supabase, isSupabaseConfigured } from '../supabase';

export interface FileUploadOptions {
    maxSizeMB?: number;
    allowedTypes?: string[];
    bucket?: string;
    folder?: string;
}

export interface UploadResult {
    success: boolean;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    error?: string;
}

const DEFAULT_OPTIONS: FileUploadOptions = {
    maxSizeMB: 10,
    allowedTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-zip-compressed'
    ],
    bucket: 'attachments',
    folder: 'requests'
};

/**
 * File Upload Service for handling file uploads to Supabase Storage
 */
export const fileUploadService = {
    /**
     * Upload a file to Supabase Storage
     */
    async uploadFile(file: File, options: FileUploadOptions = {}): Promise<UploadResult> {
        const opts = { ...DEFAULT_OPTIONS, ...options };

        try {
            // Validate file
            const validation = this.validateFile(file, opts);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            // Check if Supabase is configured
            if (!isSupabaseConfigured() || !supabase) {
                console.warn('Supabase not configured, simulating upload');
                return this.simulateUpload(file);
            }

            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const extension = file.name.split('.').pop();
            const fileName = `${timestamp}-${randomString}.${extension}`;
            const filePath = `${opts.folder}/${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(opts.bucket!)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(opts.bucket!)
                .getPublicUrl(filePath);

            return {
                success: true,
                fileUrl: urlData.publicUrl,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            };

        } catch (error) {
            console.error('File upload error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الملف'
            };
        }
    },

    /**
     * Upload multiple files
     */
    async uploadFiles(files: File[], options: FileUploadOptions = {}): Promise<UploadResult[]> {
        const results: UploadResult[] = [];

        for (const file of files) {
            const result = await this.uploadFile(file, options);
            results.push(result);
        }

        return results;
    },

    /**
     * Validate file before upload
     */
    validateFile(file: File, options: FileUploadOptions = {}): { valid: boolean; error?: string } {
        const opts = { ...DEFAULT_OPTIONS, ...options };

        // Check file size
        const maxSizeBytes = (opts.maxSizeMB || 10) * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return {
                valid: false,
                error: `حجم الملف يتجاوز الحد الأقصى (${opts.maxSizeMB}MB)`
            };
        }

        // Check file type
        if (opts.allowedTypes && opts.allowedTypes.length > 0) {
            if (!opts.allowedTypes.includes(file.type)) {
                return {
                    valid: false,
                    error: 'نوع الملف غير مدعوم'
                };
            }
        }

        return { valid: true };
    },

    /**
     * Delete file from storage
     */
    async deleteFile(filePath: string, bucket: string = 'attachments'): Promise<boolean> {
        if (!isSupabaseConfigured() || !supabase) {
            console.warn('Supabase not configured');
            return true; // Simulate success
        }

        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([filePath]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('File deletion error:', error);
            return false;
        }
    },

    /**
     * Get file type icon
     */
    getFileIcon(fileType: string): string {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType === 'application/pdf') return '📄';
        if (fileType.includes('word')) return '📝';
        if (fileType.includes('zip')) return '📦';
        return '📎';
    },

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Simulate upload for development/testing
     */
    simulateUpload(file: File): UploadResult {
        return {
            success: true,
            fileUrl: URL.createObjectURL(file),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        };
    }
};
