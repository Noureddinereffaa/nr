import React from 'react';
import { Invoice, SiteData } from '../../../types';
import { Phone, Mail, MapPin } from 'lucide-react';

interface InvoicePrintProps {
    invoice: Invoice;
    siteData: SiteData;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ invoice, siteData }) => {
    const totalPaid = (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.total - totalPaid;
    const currency = invoice.currency || 'د.ج';

    return (
        <div id="invoice-print" className="bg-white text-slate-900 p-12 max-w-[210mm] mx-auto min-h-[297mm] relative font-sans" dir="rtl">
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 -z-10 rounded-bl-full" />
            <div className="absolute top-0 right-0 w-1 bg-slate-900 h-64" />

            {/* Header Section */}
            <div className="flex justify-between items-start mb-16">
                <div className="flex items-start gap-6">
                    {siteData.brand?.logo ? (
                        <img src={siteData.brand.logo} alt="Logo" className="w-16 h-16 object-contain grayscale" />
                    ) : (
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                            {siteData.brand?.siteName?.charAt(0) || 'N'}
                        </div>
                    )}
                    <div className="text-right">
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">فاتورة حساب</h1>
                        <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Commercial Invoice</p>
                        <div className="mt-4 space-y-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">رقم الفاتورة / Invoice No.</div>
                            <div className="text-lg font-black font-mono">{invoice.invoiceNumber}</div>
                        </div>
                    </div>
                </div>

                <div className="text-left" dir="ltr">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{siteData.profile?.nameEn || siteData.profile?.name || 'NR-OS'}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{siteData.profile?.primaryTitle}</p>
                    <div className="text-xs space-y-1 font-medium text-slate-600">
                        <p>{siteData.profile?.phone}</p>
                        <p>{siteData.profile?.email}</p>
                        <p className="text-[9px] uppercase tracking-widest mt-2">{siteData.legal?.address}</p>
                    </div>
                </div>
            </div>

            {/* Client & Billing Info */}
            <div className="grid grid-cols-2 gap-12 mb-16 px-2">
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">تفاصيل العميل / Bill To</h3>
                    <div className="pr-4 border-r-2 border-slate-900">
                        <h4 className="font-black text-xl text-slate-900 tracking-tight">{invoice.clientName}</h4>
                        {invoice.clientAddress && <p className="text-sm text-slate-500 mt-1">{invoice.clientAddress}</p>}

                        {(invoice as any).legalInfo?.nif && (
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-bold text-slate-400 uppercase font-mono">
                                <div>NIF: {(invoice as any).legalInfo.nif}</div>
                                <div>NIS: {(invoice as any).legalInfo.nis}</div>
                                <div>ART: {(invoice as any).legalInfo.art}</div>
                                <div>RC: {(invoice as any).legalInfo.rc}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-left" dir="ltr">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">التواريخ / Timeline</h3>
                    <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Issued</span>
                            <span className="text-sm font-bold text-slate-900">{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valid Until</span>
                            <span className="text-sm font-bold text-slate-900">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-white font-black uppercase tracking-widest rounded">
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="py-4 px-4 text-right">الوصف / Description</th>
                            <th className="py-4 px-4 text-center w-24">الكمية / Qty</th>
                            <th className="py-4 px-4 text-center w-32">السعر / Price</th>
                            <th className="py-4 px-4 text-left w-32">الإجمالي / Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {invoice.items.map((item, idx) => (
                            <tr key={item.id} className="border-b border-slate-100">
                                <td className="py-6 px-4">
                                    <div className="font-bold text-slate-900">{item.description}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest">Professional Services</div>
                                </td>
                                <td className="py-6 px-4 text-center font-black">{item.quantity}</td>
                                <td className="py-6 px-4 text-center font-mono text-sm">{item.unitPrice.toLocaleString()}</td>
                                <td className="py-6 px-4 text-left font-mono font-black text-slate-900">{item.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Financial Summary Overlay */}
            <div className="flex justify-between items-start mb-20 px-4">
                <div className="w-1/2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">طريقة الدفع / Payment Method</h3>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-3">
                        {siteData.financials?.rip && (
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">الرقم البريدي الجاري (RIP)</p>
                                <p className="font-mono font-black text-sm text-slate-900 break-all">{siteData.financials.rip}</p>
                            </div>
                        )}
                        {siteData.financials?.ccp && (
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">رقم الحساب الجاري (CCP)</p>
                                <p className="font-mono font-black text-sm text-slate-900">{siteData.financials.ccp}</p>
                            </div>
                        )}
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed mt-4 italic">
                            * يرجى إرفاق وصل العملية بعد الدفع لضمان سرعة معالجة الطلب.
                        </p>
                    </div>
                </div>

                <div className="w-1/3 space-y-4">
                    <div className="flex justify-between text-sm text-slate-500 font-bold uppercase tracking-widest">
                        <span>المجموع / Subtotal</span>
                        <span className="font-mono text-slate-900">{invoice.subtotal.toLocaleString()} {currency}</span>
                    </div>
                    {invoice.discount > 0 && (
                        <div className="flex justify-between text-sm text-red-500 font-bold uppercase tracking-widest">
                            <span>خصم / Discount</span>
                            <span className="font-mono">-{invoice.discount.toLocaleString()} {currency}</span>
                        </div>
                    )}
                    <div className="pt-4 border-t-2 border-slate-900 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">الإجمالي / Total (TTC)</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{invoice.total.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 text-left uppercase tracking-[0.2em]" dir="ltr">
                            Amount in {currency}
                        </div>
                    </div>

                    {totalPaid > 0 && (
                        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between text-[10px] font-black uppercase tracking-widest text-green-600">
                            <span>مدفوع / Paid</span>
                            <span>{totalPaid.toLocaleString()} {currency}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Bottom */}
            <div className="absolute bottom-16 left-12 right-12">
                <div className="flex justify-between items-end">
                    <div className="text-[10px] text-slate-400 font-bold max-w-sm leading-relaxed text-right">
                        ملاحظة: هذه الفاتورة معفاة من الضريبة على القيمة المضافة (TVA non applicable) طبقاً للمادة 13 من قانون الضرائب المباشرة والرسوم المماثلة. يتم تقديم هذه الوثيقة كإثبات تجاري وصحيح للخدمات المقدمة.
                    </div>

                    {/* Authorized Stamp Signature Area */}
                    <div className="text-center w-48">
                        <div className="h-1 bg-slate-900 w-full mb-2" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">التوقيع والختم / Signature & Stamp</p>
                        <div className="h-20 flex items-center justify-center opacity-10">
                            {/* Visual representation of a stamp */}
                            <div className="w-16 h-16 border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-xs rotate-12">
                                NR-DESIGN
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Designed & Generated by NR-OS Platform © 2025</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePrint;
