
import React, { useState } from 'react';
import { useData } from '../../../../context/DataContext';
import { Plus, Sparkles } from 'lucide-react';
import ServiceForm from '../../forms/ServiceForm';
import ServiceCard from '../../services/ServiceCard';
import { Service } from '../../../../types';

const ServicesList: React.FC = () => {
    const { siteData, deleteService } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | undefined>(undefined);

    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleAIBenchmark = async () => {
        setIsOptimizing(true);
        // Simulate Deep Web Market Benchmark
        await new Promise(resolve => setTimeout(resolve, 6000));
        alert('تحليل AI: نوصي برفع سعر باقة SEO بنسبة 15% نظراً لارتفاع الطلب في السوق الجزائري حالياً، وإضافة "تحليل الفجوات" كخدمة إضافية.');
        setIsOptimizing(false);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            deleteService(id);
        }
    };

    const handleAddNew = () => {
        setEditingService(undefined);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Sparkles size={20} className="text-indigo-400" />
                        استوديو الخدمات
                    </h3>
                    <p className="text-slate-400 text-sm">حدد باقاتك وعروضك الاحترافية</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleAIBenchmark}
                        disabled={isOptimizing}
                        className="flex items-center gap-2 bg-slate-900 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:bg-indigo-500/10 disabled:opacity-50"
                    >
                        {isOptimizing ? 'جاري التحليل...' : 'معايرة الأسعار بالذكاء'}
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-[var(--accent-indigo)] hover:bg-[rgba(var(--accent-indigo-rgb),0.9)] text-white px-4 py-2 rounded-[var(--border-radius-elite)] text-sm font-bold transition-all shadow-lg hover:shadow-[rgba(var(--accent-indigo-rgb),0.25)]"
                    >
                        <Plus size={16} />
                        إضافة خدمة
                    </button>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(siteData?.services || []).map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}

                {(!siteData?.services || siteData.services.length === 0) && (
                    <div className="col-span-full text-slate-500 text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-slate-900/50">
                        <div className="flex justify-center mb-4">
                            <Sparkles size={48} className="opacity-20" />
                        </div>
                        <p>لا توجد خدمات مسجلة. أضف باقتك الأولى!</p>
                    </div>
                )}
            </div>

            <ServiceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingService}
            />
        </div>
    );
};

export default ServicesList;

