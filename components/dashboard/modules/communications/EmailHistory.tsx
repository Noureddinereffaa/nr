import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../../lib/supabase';
import { Mail, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

interface EmailLog {
    id: string;
    created_at: string;
    recipient: string;
    subject: string;
    status: 'sent' | 'failed';
    error_message?: string;
}

const EmailHistory: React.FC = () => {
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        setIsLoading(true);
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('email_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (!error && data) {
                setLogs(data as EmailLog[]);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <HistoryIcon />
                    سجل المراسلات
                </h3>
                <button onClick={fetchLogs} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-right" dir="rtl">
                    <thead className="bg-slate-950 text-slate-500 text-xs font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4">المستلم</th>
                            <th className="px-6 py-4">الموضوع</th>
                            <th className="px-6 py-4">التوقيت</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 font-bold ${log.status === 'sent' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {log.status === 'sent' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                            {log.status === 'sent' ? 'تم الإرسال' : 'فشل'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{log.recipient}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {log.subject}
                                        {log.error_message && (
                                            <p className="text-[10px] text-red-500 mt-1">{log.error_message}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {new Date(log.created_at).toLocaleString('ar-EG')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    {isLoading ? 'جاري التحميل...' : 'لا توجد سجلات بعد'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const HistoryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
);

export default EmailHistory;
