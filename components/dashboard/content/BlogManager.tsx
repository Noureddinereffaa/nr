import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useUI } from '../../../context/UIContext';
import {
    FileText, Plus, Trash2, Edit3, CheckCircle,
    ArrowRight, BarChart, Wand2
} from 'lucide-react';
import WritingWorkspace from './WritingWorkspace';

const BlogManager: React.FC = () => {
    const { siteData, updateArticle, deleteArticle, addArticle } = useData();
    const { openArticleModal } = useUI();
    const { articles, aiConfig } = siteData;

    const [editingArticle, setEditingArticle] = useState<any | null>(null);

    return (
        <div className="space-y-10">
            {/* Simple Workspace Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="text-right w-full">
                    <h2 className="text-4xl font-black text-white mb-3 flex items-center gap-4 justify-end">
                        Sovereign Writing Studio
                        <Edit3 className="text-indigo-500" size={32} />
                    </h2>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Manual Authority & Strategic AI Assistance</p>
                </div>
            </div>

            {/* Archive / Management */}
            <div>
                <div className="flex items-center justify-between mb-8" dir="rtl">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <FileText className="text-slate-500" />
                        أرشيف السيادة المعرفية
                    </h3>
                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                const newArticle = {
                                    title: 'مقال سيادي جديد',
                                    content: '',
                                    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80',
                                    category: 'General',
                                    tags: [],
                                    seoScore: 0,
                                    excerpt: '',
                                    status: 'draft' as 'draft',
                                    keywords: [],
                                    author: 'Noureddine Reffaa',
                                    readTime: '5 min',
                                    seo: {
                                        title: 'مقال سيادي جديد',
                                        description: '',
                                        keywords: [],
                                        focusKeyword: ''
                                    }
                                };
                                const newId = await addArticle(newArticle);
                                setEditingArticle({ ...newArticle, id: newId, date: new Date().toISOString(), views: 0 });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-black text-white transition-all">
                            <Plus size={16} /> مقال يدوي جديد
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {articles.length === 0 ? (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <Wand2 size={48} className="mx-auto text-slate-800 mb-6" />
                            <h4 className="text-white font-bold">لا يوجد محتوى سيادي حتى الآن</h4>
                            <p className="text-slate-500 text-sm">ابدأ ببناء إمبراطوريتك المعرفية الآن.</p>
                        </div>
                    ) : (
                        articles.map((art) => (
                            <div key={art.id} className="group bg-slate-900/40 border border-white/10 rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-700 hover:shadow-2xl">
                                <div className="aspect-[16/10] relative overflow-hidden">
                                    <img src={art.image} alt="" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                        <span className="px-4 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-white/10">{art.category}</span>
                                    </div>
                                </div>
                                <div className="p-8 text-right" dir="rtl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-500">
                                            <BarChart size={12} /> {art.views || 0} VIEWS
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase">{new Date(art.date).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">{art.title}</h4>

                                    {/* Mini SEO Score */}
                                    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-black text-xs">
                                                {art.seoScore || 90}
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-slate-500 font-black uppercase">SEO Rank</p>
                                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Optimized</p>
                                            </div>
                                        </div>
                                        <CheckCircle size={18} className="text-emerald-500" />
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex gap-3">
                                            <button onClick={() => setEditingArticle(art)} className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-2xl transition-all"><Edit3 size={18} /></button>
                                            <button onClick={() => deleteArticle(art.id)} className="p-3 bg-white/5 text-slate-400 hover:text-red-400 rounded-2xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                        <button onClick={() => setEditingArticle(art)} className="flex items-center gap-2 text-indigo-400 font-black text-xs group/link">
                                            تعديل المحتوى
                                            <ArrowRight size={16} className="rotate-180 group-hover/link:-translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Writing Workspace Overlay */}
            {
                editingArticle && (
                    <WritingWorkspace
                        article={editingArticle}
                        aiConfig={aiConfig}
                        onSave={(updatedArticle) => {
                            // Auto-save: just update data, don't close
                            updateArticle(editingArticle.id!, updatedArticle);
                        }}
                        onClose={() => {
                            // Manual close: save final state and close
                            setEditingArticle(null);
                        }}
                    />
                )
            }
        </div >
    );
};

export default BlogManager;
