import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle, ClipboardList, User, Sparkles } from 'lucide-react';
import { RequestWizardProvider, useRequestWizard } from './RequestWizardContext';

// Placeholder Steps
const Step1Service = () => {
    const { data, updateData } = useRequestWizard();
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">تفاصيل الخدمة</h3>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <label className="block text-sm text-slate-400 mb-2">نوع الخدمة</label>
                <input
                    type="text"
                    value={data.serviceTitle}
                    disabled
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white opacity-70 cursor-not-allowed"
                />
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-2">نوع الباقة (اختياري)</label>
                <select
                    value={data.packageType}
                    onChange={(e) => updateData({ packageType: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                >
                    <option value="">اختر باقة...</option>
                    <option value="basic">الأساسية</option>
                    <option value="pro">الاحترافية</option>
                    <option value="enterprise">المتقدمة</option>
                </select>
            </div>
        </div>
    );
};

const Step2Project = () => {
    const { data, updateData } = useRequestWizard();
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">تفاصيل المشروع</h3>
            <div>
                <label className="block text-sm text-slate-400 mb-2">وصف المشروع</label>
                <textarea
                    value={data.projectDetails}
                    onChange={(e) => updateData({ projectDetails: e.target.value })}
                    className="w-full h-32 bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none resize-none"
                    placeholder="اشرح فكرتك بالتفصيل..."
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">الميزانية المتوقعة</label>
                    <select
                        value={data.budgetRange}
                        onChange={(e) => updateData({ budgetRange: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                        <option value="">حدد الميزانية...</option>
                        <option value="low">أقل من 1000$</option>
                        <option value="medium">1000$ - 5000$</option>
                        <option value="high">5000$ - 10000$</option>
                        <option value="enterprise">أكثر من 10000$</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">المدة الزمنية</label>
                    <select
                        value={data.timeline}
                        onChange={(e) => updateData({ timeline: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                        <option value="">حدد المدة...</option>
                        <option value="urgent">عاجل (أقل من أسبوع)</option>
                        <option value="normal">عادي (2-4 أسابيع)</option>
                        <option value="flexible">مرن (أكثر من شهر)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const Step3Contact = () => {
    const { data, updateData } = useRequestWizard();
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">بيانات التواصل</h3>
            <div>
                <label className="block text-sm text-slate-400 mb-2">الاسم الكامل</label>
                <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => updateData({ clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">البريد الإلكتروني</label>
                    <input
                        type="email"
                        value={data.clientEmail}
                        onChange={(e) => updateData({ clientEmail: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        dir="ltr"
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">رقم الهاتف</label>
                    <input
                        type="tel"
                        value={data.clientPhone}
                        onChange={(e) => updateData({ clientPhone: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        dir="ltr"
                    />
                </div>
            </div>
        </div>
    );
};

const Step4Review = () => {
    const { data } = useRequestWizard();
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">مراجعة الطلب</h3>
                <p className="text-slate-400">يرجى التأكد من صحة البيانات قبل الإرسال</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-slate-400">الخدمة</span>
                    <span className="font-bold text-white">{data.serviceTitle}</span>
                </div>
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-slate-400">الميزانية</span>
                    <span className="font-bold text-white">{data.budgetRange === 'medium' ? 'متوسطة' : data.budgetRange}</span>
                </div>
                <div className="p-4 border-b border-white/5">
                    <span className="text-slate-400 block mb-2">التفاصيل</span>
                    <p className="text-sm text-white bg-slate-950 p-3 rounded-lg border border-white/5">
                        {data.projectDetails || 'لا توجد تفاصيل إضافية'}
                    </p>
                </div>
                <div className="p-4 flex justify-between items-center bg-indigo-500/5">
                    <span className="text-slate-400">العميل</span>
                    <span className="font-bold text-indigo-300">{data.clientName}</span>
                </div>
            </div>
        </div>
    );
};

const WizardContent = ({ onClose }: { onClose: () => void }) => {
    const { currentStep, totalSteps, nextStep, prevStep, submitRequest, isSubmitting } = useRequestWizard();

    const steps = [
        { id: 1, title: 'الخدمة', icon: Sparkles, component: <Step1Service /> },
        { id: 2, title: 'المشروع', icon: ClipboardList, component: <Step2Project /> },
        { id: 3, title: 'التواصل', icon: User, component: <Step3Contact /> },
        { id: 4, title: 'المراجعة', icon: CheckCircle, component: <Step4Review /> },
    ];

    const handleNext = () => {
        if (currentStep === totalSteps) {
            submitRequest();
        } else {
            nextStep();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                <div>
                    <h2 className="text-xl font-bold text-white">طلب خدمة جديدة</h2>
                    <p className="text-sm text-slate-400">خطوة {currentStep} من {totalSteps}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-800 w-full">
                <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {steps[currentStep - 1].component}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 flex justify-between items-center bg-slate-950/50">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="px-6 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                    رجوع
                </button>

                <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>جاري الإرسال...</>
                    ) : (
                        <>
                            {currentStep === totalSteps ? 'إرسال الطلب' : 'التالي'}
                            {currentStep !== totalSteps && <ArrowLeft size={18} />}
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export const RequestWizard: React.FC<{ isOpen: boolean; onClose: () => void; initialData?: any }> = ({ isOpen, onClose, initialData }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <RequestWizardProvider initialData={initialData} onClose={onClose}>
                    <WizardContent onClose={onClose} />
                </RequestWizardProvider>
            </div>
        </AnimatePresence>
    );
};
