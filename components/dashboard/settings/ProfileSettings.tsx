import React from 'react';
import { useData } from '../../../context/DataContext';
import { User, MapPin, Briefcase, Phone, Mail, MessageCircle, Globe, Linkedin, Facebook, Instagram, Twitter, Youtube, Video } from 'lucide-react';

const ProfileSettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();
    const profile = (siteData.profile || {}) as any;
    const contactInfo = siteData.contactInfo || {} as any;

    const handleProfileChange = (field: string, value: any) => {
        updateSiteData({
            profile: { ...profile, [field]: value }
        });
    };

    const handleContactChange = (field: string, value: any) => {
        updateSiteData({
            contactInfo: { ...contactInfo, [field]: value }
        });
    };

    const handleSocialChange = (platform: string, value: string) => {
        updateSiteData({
            contactInfo: {
                ...contactInfo,
                socials: { ...(contactInfo.socials || {}), [platform]: value }
            }
        });
    };

    return (
        <div className="space-y-8">
            {/* Personal Identity Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="text-indigo-400" size={20} />
                    الهوية الشخصية
                </h3>

                <div className="grid gap-6">
                    {/* Personal Info */}
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                        <h4 className="font-bold text-slate-300 mb-2">المعلومات الأساسية</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">الاسم الكامل</label>
                                <input
                                    type="text"
                                    value={profile?.name || ''}
                                    onChange={(e) => handleProfileChange('name', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">المسمى الوظيفي</label>
                                <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                    <Briefcase size={16} className="text-slate-500" />
                                    <input
                                        type="text"
                                        value={profile?.primaryTitle || ''}
                                        onChange={(e) => handleProfileChange('primaryTitle', e.target.value)}
                                        className="flex-1 bg-transparent border-none text-white outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                        <h4 className="font-bold text-slate-300 mb-2">الصورة الشخصية</h4>
                        <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-white/10 overflow-hidden shrink-0">
                                {profile?.photoUrl ? (
                                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <User size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-slate-400 block">رابط الصورة (Square Image URL)</label>
                                <input
                                    type="text"
                                    value={profile?.photoUrl || ''}
                                    onChange={(e) => handleProfileChange('photoUrl', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white text-sm font-mono"
                                    dir="ltr"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Phone className="text-emerald-400" size={20} />
                    معلومات الاتصال
                </h3>

                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <p className="text-xs text-slate-500 mb-4">هذه المعلومات مرتبطة تلقائياً بجميع صفحات الموقع (الهيرو، الفوتر، نماذج التواصل، CTAs).</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">رقم الهاتف</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Phone size={16} className="text-emerald-500" />
                                <input
                                    type="text"
                                    value={contactInfo?.phone || ''}
                                    onChange={(e) => handleContactChange('phone', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white outline-none"
                                    dir="ltr"
                                    placeholder="+213 555 000 000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">رابط واتساب</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <MessageCircle size={16} className="text-green-500" />
                                <input
                                    type="text"
                                    value={contactInfo?.whatsapp || ''}
                                    onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white outline-none"
                                    dir="ltr"
                                    placeholder="https://wa.me/213..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">البريد الإلكتروني</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Mail size={16} className="text-blue-400" />
                                <input
                                    type="email"
                                    value={contactInfo?.email || ''}
                                    onChange={(e) => handleContactChange('email', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white outline-none"
                                    dir="ltr"
                                    placeholder="contact@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">العنوان / الموقع</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <MapPin size={16} className="text-red-400" />
                                <input
                                    type="text"
                                    value={contactInfo?.address || ''}
                                    onChange={(e) => handleContactChange('address', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white outline-none"
                                    placeholder="المدينة، البلد"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Links Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="text-purple-400" size={20} />
                    روابط وسائل التواصل الاجتماعي
                </h3>

                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">LinkedIn</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Linkedin size={16} className="text-[#0077b5]" />
                                <input type="text" value={contactInfo?.socials?.linkedin || ''} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none" dir="ltr" placeholder="https://linkedin.com/in/..." />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Facebook</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Facebook size={16} className="text-[#1877f2]" />
                                <input type="text" value={contactInfo?.socials?.facebook || ''} onChange={(e) => handleSocialChange('facebook', e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none" dir="ltr" placeholder="https://facebook.com/..." />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Instagram</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Instagram size={16} className="text-pink-500" />
                                <input type="text" value={contactInfo?.socials?.instagram || ''} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none" dir="ltr" placeholder="https://instagram.com/..." />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">X (Twitter)</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Twitter size={16} className="text-slate-300" />
                                <input type="text" value={contactInfo?.socials?.twitter || ''} onChange={(e) => handleSocialChange('twitter', e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none" dir="ltr" placeholder="https://x.com/..." />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">TikTok</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Video size={16} className="text-white" />
                                <input type="text" value={contactInfo?.socials?.tiktok || ''} onChange={(e) => handleSocialChange('tiktok', e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none" dir="ltr" placeholder="https://tiktok.com/@..." />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">YouTube</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                                <Youtube size={16} className="text-red-500" />
                                <input type="text" value={contactInfo?.socials?.youtube || ''} onChange={(e) => handleSocialChange('youtube', e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none" dir="ltr" placeholder="https://youtube.com/@..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;

