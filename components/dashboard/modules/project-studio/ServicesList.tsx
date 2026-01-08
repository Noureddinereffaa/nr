import React, { useState } from 'react';
import { useBusiness } from '../../../../context/BusinessContext';
import { Plus, Sparkles } from 'lucide-react';
import ServiceForm from '../../forms/ServiceForm';
import ServiceCard from '../../services/ServiceCard';
import { Service } from '../../../../types';

const ServicesList: React.FC = () => {
    const { services, deleteService } = useBusiness();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | undefined>(undefined);

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingService(undefined);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase italic">Project Services</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">قائمة الخدمات والحلول الإستراتيجية</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 rtl:space-x-reverse overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 bg-indigo-500/20 flex items-center justify-center text-[8px] font-black text-indigo-400 border border-indigo-500/30">
                                <Sparkles size={10} />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95"
                    >
                        <Plus size={18} />
                        خدمة جديدة
                    </button>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
                {services.map((service, index) => (
                    <ServiceCard
                        key={service.id || index}
                        service={service}
                        onEdit={handleEdit}
                        onDelete={() => deleteService(service.id)}
                    />
                ))}
            </div>

            <ServiceForm
                isOpen={isFormOpen}
                onClose={handleClose}
                service={editingService}
            />
        </div>
    );
};

export default ServicesList;
