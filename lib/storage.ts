import { supabase } from './supabase';

const BUCKET_NAME = 'images';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., 'articles', 'logos', 'avatars')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
    if (!supabase) {
        console.error('Supabase not configured');
        return null;
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '31536000', // 1 year cache
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (err) {
        console.error('Upload failed:', err);
        return null;
    }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteImage(url: string): Promise<boolean> {
    if (!supabase) return false;

    try {
        // Extract path from URL
        const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
        if (urlParts.length < 2) return false;

        const path = urlParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Delete failed:', err);
        return false;
    }
}

/**
 * List images in a folder
 * @param folder - The folder to list
 */
export async function listImages(folder: string = ''): Promise<string[]> {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(folder, {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error || !data) return [];

        return data
            .filter(item => !item.id.endsWith('/')) // Filter out folders
            .map(item => {
                const { data: urlData } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(`${folder}/${item.name}`);
                return urlData.publicUrl;
            });
    } catch (err) {
        console.error('List failed:', err);
        return [];
    }
}
