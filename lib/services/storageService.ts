import { supabase, isSupabaseConfigured } from '../supabase';

export const storageService = {
    /**
     * Uploads a file to a specified bucket.
     */
    async uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
        if (!isSupabaseConfigured() || !supabase) return null;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error(`[Storage] Upload error in ${bucket}:`, error);
            throw error;
        }

        // Return the public URL or the path
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    },

    /**
     * Gets a signed URL for a private file.
     */
    async getSignedUrl(bucket: string, path: string, expires: number = 3600): Promise<string | null> {
        if (!isSupabaseConfigured() || !supabase) return null;

        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expires);

        if (error) {
            console.error(`[Storage] Signed URL error:`, error);
            return null;
        }

        return data.signedUrl;
    },

    /**
     * Deletes a file from storage.
     */
    async deleteFile(bucket: string, path: string): Promise<void> {
        if (!isSupabaseConfigured() || !supabase) return;

        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error(`[Storage] Delete error:`, error);
            throw error;
        }
    },

    /**
     * Lists files in a directory.
     */
    async listFiles(bucket: string, path: string = ''): Promise<any[]> {
        if (!isSupabaseConfigured() || !supabase) return [];

        const { data, error } = await supabase.storage
            .from(bucket)
            .list(path, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            console.error(`[Storage] List error:`, error);
            return [];
        }

        return data;
    }
};
