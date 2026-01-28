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
            const { error } = await supabase.from('projects').insert([{
                id,
                title: newProject.title,
                client_id: newProject.clientId || newProject.client_id,
                status: newProject.status || 'planning',
                budget: newProject.budget || 0,
                data: newProject
            }]);
            if (error) throw error;
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

        // Try to find by ID first
        let { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', code)
            .single();

        // If not found by ID, try to find by specific access code in JSON data
        // Note: usage of data->>accessCode depending on your JSON structure
        if (!data) {
            const { data: searchData } = await supabase
                .from('projects')
                .select('*')
                .textSearch('data', `'${code}'`) // Simple text search as fallback or explicit JSON filter if properly indexed
                .limit(1);

            // A better approach for JSON column if we can't use complex filters without indexing:
            // We might filter client-side if dataset is small, but for now let's rely on ID match
            // or exact match if the user enters the ID.
            // For "Sovereign" quality, we should encourage using the ID or a dedicated column.
            // Let's assume we stick to IDs for now to be safe, or implement a filter if needed.
            if (searchData && searchData.length > 0) {
                data = searchData[0];
            }
        }

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
            console.error("Error fetching project by code:", error);
            throw error;
        }

        if (!data) return null;

        const r = data;
        return {
            ...r.data,
            id: r.id,
            title: r.title || r.data?.title,
            client_id: r.client_id || r.data?.clientId,
            clientId: r.client_id || r.data?.clientId,
            status: r.status || r.data?.status || 'planning',
            budget: Number(r.budget || r.data?.budget || 0)
        };
    }
};
