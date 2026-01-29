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
 * File Upload Service
 * 
 * Provides a standardized way to handle file uploads throughout the application.
 * Supports validation, Supabase Storage integration, and local simulation for development.
 * 
 * @module fileUploadService
 */
export const fileUploadService = {
    /**
     * Uploads a single file to Supabase Storage or simulates it if not configured.
     * 
     * @param {File} file - The browser File object to upload.
     * @param {FileUploadOptions} [options={}] - Custom upload options (bucket, folder, etc.).
     * @returns {Promise<UploadResult>} The result of the upload operation including the public URL.
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
     * Uploads multiple files sequentially.
     * 
     * @param {File[]} files - Array of File objects.
     * @param {FileUploadOptions} [options={}] - Shared upload options for all files.
     * @returns {Promise<UploadResult[]>} Array of upload results.
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
     * Validates a file against size and type constraints.
     * 
     * @param {File} file - The File object to validate.
     * @param {FileUploadOptions} [options={}] - Validation constraints.
     * @returns {{ valid: boolean; error?: string }} An object indicating if the file is valid.
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
     * Deletes a file from Supabase Storage.
     * 
     * @param {string} filePath - The path to the file within the bucket.
     * @param {string} [bucket='attachments'] - The storage bucket name.
     * @returns {Promise<boolean>} Success indicator.
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
     * Returns a representative emoji icon for the given MIME type.
     * 
     * @param {string} fileType - The MIME type of the file.
     * @returns {string} An emoji string.
     */
    getFileIcon(fileType: string): string {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType === 'application/pdf') return '📄';
        if (fileType.includes('word')) return '📝';
        if (fileType.includes('zip')) return '📦';
        return '📎';
    },

    /**
     * Formats file size from bytes to a human-readable string (e.g., 2.5 MB).
     * 
     * @param {number} bytes - Size in bytes.
     * @returns {string} Formatted size string.
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Simulates a file upload by generating a local Object URL.
     * Useful for development without Supabase credentials.
     * 
     * @param {File} file - The file to "upload".
     * @returns {UploadResult} A successful upload result with a local blob URL.
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
