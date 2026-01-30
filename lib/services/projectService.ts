import { supabase, isSupabaseConfigured } from '../supabase';
import { Project } from '../../types';

export const projectService = {
    async getAll(): Promise<Project[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        // Fetch structured columns + data blob
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        // Merge structured properties into the project object
        return data.map((r: any) => ({
            ...r.data,
            id: r.id,
            title: r.title || r.data?.title,
            client_id: r.client_id || r.data?.clientId,
            clientId: r.client_id || r.data?.clientId,
            status: r.status || r.data?.status || 'planning',
            budget: Number(r.budget || r.data?.budget || 0)
        }));
    },

    async create(project: Partial<Project>): Promise<Project> {
        const id = project.id || 'p-' + Date.now();
        const newProject = { ...project, id } as Project;

        if (isSupabaseConfigured() && supabase) {
            const { error: insertError } = await supabase.from('projects').insert([{
                id,
                title: newProject.title,
                client_id: newProject.clientId || newProject.client_id,
                status: newProject.status || 'planning',
                budget: newProject.budget || 0,
                data: newProject
            }]);
            if (insertError) {
                console.error('[projectService] Supabase insert error:', insertError);
                throw insertError;
            }
        }

        return newProject;
    },

    async update(id: string, updates: Partial<Project>, currentData: Project): Promise<Project> {
        const updatedProject = { ...currentData, ...updates };

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('projects').update({
                title: updatedProject.title,
                client_id: updatedProject.clientId || updatedProject.client_id,
                status: updatedProject.status,
                budget: updatedProject.budget,
                data: updatedProject,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
        }

        return updatedProject;
    },

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
        }
    },

    async getByCode(code: string): Promise<Project | null> {
        if (!isSupabaseConfigured() || !supabase) return null;

        // Optimized lookup for production: Check ID first (primary way portal works)
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', code.trim())
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("[projectService] Error fetching project by code:", error);
            throw error;
        }

        if (!data) return null;

        return {
            ...data.data,
            id: data.id,
            title: data.title || data.data?.title,
            client_id: data.client_id || data.data?.clientId,
            clientId: data.client_id || data.data?.clientId,
            clientEmail: data.data?.clientEmail,
            status: data.status || data.data?.status || 'planning',
            budget: Number(data.budget || data.data?.budget || 0)
        };
    },

    /**
     * Finds projects associated with a specific email address.
     * Uses optimized JSONB filtering for production performance.
     */
    async getByEmail(email: string): Promise<Project[]> {
        if (!isSupabaseConfigured() || !supabase) return [];

        const normalizedEmail = email.trim().toLowerCase();

        // Database-side filtering on the JSONB field 'data->>clientEmail'
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .or(`data->>clientEmail.eq.${normalizedEmail}`);

        if (error) {
            console.error("[projectService] Failed to fetch by email:", error);
            throw error;
        }

        if (!data) return [];

        return data.map((r: any) => ({
            ...r.data,
            id: r.id,
            title: r.title || r.data?.title,
            client_id: r.client_id || r.data?.clientId,
            clientId: r.client_id || r.data?.clientId,
            clientEmail: r.data?.clientEmail,
            status: r.status || r.data?.status || 'planning',
            budget: Number(r.budget || r.data?.budget || 0)
        }));
    },

    /**
     * Retrieves all projects associated with a specific client ID.
     */
    async getProjectsByClientId(clientId: string): Promise<Project[]> {
        if (!isSupabaseConfigured() || !supabase) return [];

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('client_id', clientId);

        if (error) throw error;
        if (!data) return [];

        return data.map((r: any) => ({
            ...r.data,
            id: r.id,
            title: r.title || r.data?.title,
            client_id: r.client_id || r.data?.clientId,
            clientId: r.client_id || r.data?.clientId,
            status: r.status || r.data?.status || 'planning',
            budget: Number(r.budget || r.data?.budget || 0)
        }));
    }
};
