import { useState, useCallback } from 'react';
import { Project } from '../types';
import { projectService } from '../services/projectService';
import Logger from '../logger';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await projectService.getAll();
            setProjects(data);
        } catch (error) {
            Logger.error("Error fetching projects", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addProject = useCallback(async (project: Partial<Project>) => {
        try {
            const newProject = await projectService.create(project);
            setProjects(prev => [...prev, newProject]);
            return newProject;
        } catch (error) {
            Logger.error("Error adding project", error);
            throw error;
        }
    }, []);

    const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
        try {
            const current = projects.find(p => p.id === id);
            if (!current) return;
            const updated = await projectService.update(id, updates, current);
            setProjects(prev => prev.map(p => p.id === id ? updated : p));
            return updated;
        } catch (error) {
            Logger.error("Error updating project", error);
            throw error;
        }
    }, [projects]);

    const deleteProject = useCallback(async (id: string) => {
        try {
            await projectService.delete(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            Logger.error("Error deleting project", error);
            throw error;
        }
    }, []);

    return {
        projects,
        setProjects,
        isLoading,
        refreshProjects,
        addProject,
        updateProject,
        deleteProject
    };
};
