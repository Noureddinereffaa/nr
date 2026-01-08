import React, { useEffect, useState } from 'react';
import { Clock, User, Edit, ArrowRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface AuditLogEntry {
    id: string;
    action_type: string;
    old_value: any;
    new_value: any;
    created_at: string;
}

export const ProfileHistory: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profile_audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                if (error.code !== '42P01') { // Ignore "relation does not exist" if table missing
                    console.error('Error fetching audit logs:', error);
                }
            } else {
                setLogs(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-4 text-slate-500">جاري تحميل السجل...</div>;

    if (logs.length === 0) {
        return (
            <div className="text-center py-8 bg-slate-900 rounded-xl border border-white/5 border-dashed">
                <Clock size={32} className="mx-auto mb-3 text-slate-600" />
                <p className="text-slate-500 text-sm">لا يوجد سجل نشاط متاح حالياً</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-indigo-400" size={20} />
                سجل النشاط
            </h3>

            <div className="relative border-r-2 border-slate-800 mr-4 space-y-8">
                {logs.map((log) => (
                    <div key={log.id} className="relative mr-[-9px]">
                        <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500/50"></div>
                        <div className="pr-8">
                            <div className="bg-slate-900 border border-white/5 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                        {formatActionType(log.action_type)}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {new Date(log.created_at).toLocaleString('ar-EG')}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-300">
                                    {renderChangeDetails(log)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helpers
const formatActionType = (type: string) => {
    switch (type) {
        case 'update_profile': return 'تحديث الملف الشخصي';
        case 'change_avatar': return 'تغيير الصورة الشخصية';
        case 'update_contact': return 'تحديث الاتصال';
        default: return type.replace(/_/g, ' ');
    }
};

const renderChangeDetails = (log: AuditLogEntry) => {
    if (log.action_type === 'change_avatar') {
        return 'تم تغيير الصورة الشخصية';
    }
    // Simple JSON diff visualization could go here
    return 'تم إجراء تعديلات على البيانات';
};
