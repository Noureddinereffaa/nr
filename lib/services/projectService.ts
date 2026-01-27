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
    }
};
