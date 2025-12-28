import React from 'react';
import { Service } from '../../../types';
import { Check, Clock, Edit2, Trash2, Star, Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ServiceCardProps {
    service: Service;
    onEdit: (service: Service) => void;
    onDelete: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
    // Dynamic Icon
    const IconComponent = (LucideIcons as any)[service.icon] || Package;

    return (
        <div className={`relative p-6 rounded-2xl border transition-all duration-300 group flex flex-col h-full ${service.popular
                ? 'bg-slate-900/80 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                : 'bg-slate-900/40 border-white/5 hover:border-white/10'
            }`}>
            {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    الأكثر طلباً
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${service.popular ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                    <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">{service.description}</p>
            </div>

            {/* Pricing */}
            <div className="text-center mb-6 pb-6 border-b border-white/5">
                <div className="text-sm text-slate-500 mb-1">{service.priceLabel || 'يبدأ من'}</div>
                <div className="text-3xl font-black text-white">
                    {service.price?.toLocaleString()} <span className="text-sm font-normal text-slate-500">د.ج</span>
                </div>
                {service.duration && (
                    <div className="flex items-center justify-center gap-1 text-xs text-indigo-400 mt-2 bg-indigo-500/10 py-1 px-3 rounded-full w-fit mx-auto">
                        <Clock size={12} />
                        {service.duration}
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8 flex-1">
                {(service.features || []).slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-green-400 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(service)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                >
                    <Edit2 size={14} /> تعديل
                </button>
                <button
                    onClick={() => onDelete(service.id)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                >
                    <Trash2 size={14} /> حذف
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
