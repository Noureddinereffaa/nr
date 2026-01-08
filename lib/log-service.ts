import { supabase, isSupabaseConfigured } from './supabase';
import { SystemActivity } from '../types';

export const LogService = {
    /**
     * Log a system activity.
     */
    async log(activity: Omit<SystemActivity, 'id' | 'date'>) {
        const newLog: SystemActivity = {
            ...activity,
            id: crypto.randomUUID(),
            date: new Date().toISOString()
        };

        console.log(`[SYSTEM_${activity.type.toUpperCase()}]`, activity.label, activity.metadata);

        if (isSupabaseConfigured() && supabase) {
            try {
                // We use a simplified insert. Ensure the 'activity_log' table has 'data' column
                await supabase.from('activity_log').insert([{
                    id: newLog.id,
                    data: newLog
                }]);
            } catch (err) {
                console.error("Failed to persist system log:", err);
            }
        }

        // Dispatch global event for local listeners (like UI Notification system)
        window.dispatchEvent(new CustomEvent('system-activity', { detail: newLog }));

        return newLog;
    },

    // Shortcuts
    async success(label: string, type: SystemActivity['type'], metadata?: any) {
        return this.log({ label, type, status: 'success', metadata });
    },

    async error(label: string, type: SystemActivity['type'], error: any) {
        return this.log({
            label,
            type,
            status: 'error',
            metadata: { message: error.message || error, stack: error.stack }
        });
    },

    async info(label: string, type: SystemActivity['type'], metadata?: any) {
        return this.log({ label, type, status: 'info', metadata });
    },

    async warning(label: string, type: SystemActivity['type'], metadata?: any) {
        return this.log({ label, type, status: 'warning', metadata });
    }
};
