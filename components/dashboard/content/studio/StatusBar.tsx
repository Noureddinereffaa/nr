import React from 'react';
import { Clock, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface StatusBarProps {
    wordCount: number;
    readTime: number;
    saveStatus: 'saved' | 'saving' | 'unsaved';
    aiStatus: 'idle' | 'working';
}

const StatusBar: React.FC<StatusBarProps> = ({ wordCount, readTime, saveStatus, aiStatus }) => {
    return (
        <div className="h-8 bg-slate-950 border-t border-white/5 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <FileText size={12} />
                    <span>{wordCount} كلمة</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{readTime} دقيقة قراءة</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {aiStatus === 'working' && (
                    <div className="flex items-center gap-1.5 text-indigo-400">
                        <Loader2 size={12} className="animate-spin" />
                        <span>AI Generating...</span>
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    {saveStatus === 'saved' && <CheckCircle size={12} className="text-green-500" />}
                    {saveStatus === 'saving' && <Loader2 size={12} className="text-yellow-500 animate-spin" />}
                    {saveStatus === 'unsaved' && <AlertCircle size={12} className="text-orange-500" />}

                    <span className={
                        saveStatus === 'saved' ? 'text-green-500' :
                            saveStatus === 'saving' ? 'text-yellow-500' : 'text-orange-500'
                    }>
                        {saveStatus === 'saved' ? 'محفوظ' :
                            saveStatus === 'saving' ? 'جاري الحفظ...' : 'تعديلات غير محفوظة'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
