import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSystem } from './SystemContext';

type SyncState = 'idle' | 'syncing' | 'success' | 'error' | 'conflict';

interface SyncContextType {
    syncState: SyncState;
    lastSync: Date | null;
    startSync: () => Promise<void>;
    resolveConflict: (resolution: 'local' | 'server') => Promise<void>;
    serverData: any | null; // Data from server in case of conflict
}

const SyncContext = createContext<SyncContextType | null>(null);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { siteData, updateSiteData } = useSystem();
    const [syncState, setSyncState] = useState<SyncState>('idle');
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [serverData, setServerData] = useState<any | null>(null);

    const startSync = async () => {
        if (!supabase) {
            console.warn("Supabase not configured");
            return;
        }

        setSyncState('syncing');
        try {
            // 1. Fetch server version
            const { data: serverRecord, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('id', 'main')
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore not found, treat as initial sync
                throw error;
            }

            // 2. Conflict Detection Logic
            // Simple logic: If server has data and local also has changes... 
            // For now, let's just assume we want to pull server data if it's newer, 
            // OR push local if we explicitly clicked sync (implying "Save to Cloud").

            // Actually, "Global Sync" usually means "Push my changes" OR "Get latest".
            // Let's implement a "Smart Push/Pull".

            // If strictly "Profile Sync", we should check timestamps.
            // Since we don't have robust local timestamps yet, let's look for a conflict flag or diff.

            const serverDate = serverRecord?.updated_at ? new Date(serverRecord.updated_at) : null;

            // Simulator: Trigger conflict if server has different data (simplified)
            // Real implementation: Compare specific fields or hash

            if (serverRecord) {
                // Check if server is newer than our last sync
                if (lastSync && serverDate && serverDate > lastSync) {
                    // Potential conflict or just update
                    // Let's set conflict if we have unsaved local changes? 
                    // For now, let's just Simulate Conflict for the UI demo if params say so, 
                    // or just update local if it's a pull.
                }

                // For this phase, let's just Sync: Push Local to Server (Last Write Wins)
                // UNLESS we want to demo Conflict Resolution.

                // Let's allow "Conflict" state to be manually triggered or if server data is vastly different?
                // We'll stick to simple "Upsert" for now unless we detect a specific "remote change" flag.
            }

            // Perform Upsert (Push Local to Server)
            const { error: upsertError } = await supabase
                .from('site_settings')
                .upsert({
                    id: 'main',
                    ...siteData,
                    updated_at: new Date().toISOString()
                });

            if (upsertError) throw upsertError;

            setLastSync(new Date());
            setSyncState('success');
            setTimeout(() => setSyncState('idle'), 2000);

        } catch (error) {
            console.error("Sync failed:", error);
            setSyncState('error');
            setTimeout(() => setSyncState('idle'), 3000);
        }
    };

    const resolveConflict = async (resolution: 'local' | 'server') => {
        if (resolution === 'local') {
            // Force push local
            await startSync();
        } else {
            // Pull server
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('*').eq('id', 'main').single();
            if (data) {
                updateSiteData(data); // Assuming updateSiteData can take full object
                setLastSync(new Date());
                setSyncState('success');
            }
        }
        setServerData(null);
    };

    return (
        <SyncContext.Provider value={{ syncState, lastSync, startSync, resolveConflict, serverData }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) throw new Error('useSync must be used within SyncProvider');
    return context;
};
