import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Cloud } from 'lucide-react';
import { useSync } from '../../../context/SyncContext';
import { SyncConflictModal } from '../modals/SyncConflictModal';

export const GlobalSyncButton: React.FC = () => {
    const { syncState, startSync } = useSync();
    const [showConflict, setShowConflict] = React.useState(false);

    React.useEffect(() => {
        if (syncState === 'conflict') {
            setShowConflict(true);
        }
    }, [syncState]);

    return (
        <>
            <button
                onClick={startSync}
                disabled={syncState === 'syncing'}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${syncState === 'syncing' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' : ''}
                    ${syncState === 'success' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                    ${syncState === 'error' || syncState === 'conflict' ? 'bg-red-500/10 text-red-400' : ''}
                    ${syncState === 'idle' ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : ''}
                `}
                title="مزامنة البيانات مع السحابة"
            >
                {syncState === 'syncing' && <RefreshCw size={14} className="animate-spin" />}
                {syncState === 'success' && <CheckCircle2 size={14} />}
                {(syncState === 'error' || syncState === 'conflict') && <AlertTriangle size={14} />}
                {syncState === 'idle' && <Cloud size={14} />}

                <span className="hidden sm:inline">
                    {syncState === 'syncing' && 'جاري المزامنة...'}
                    {syncState === 'success' && 'تمت المزامنة'}
                    {syncState === 'error' && 'فشل المزامنة'}
                    {syncState === 'conflict' && 'تعارض!'}
                    {syncState === 'idle' && 'مزامنة'}
                </span>
            </button>

            <SyncConflictModal isOpen={showConflict} onClose={() => setShowConflict(false)} />
        </>
    );
};
