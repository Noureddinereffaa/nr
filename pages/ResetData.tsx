import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetData: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem('nr_full_platform_data');
    } catch (e) {
      // ignore
    }
    // small delay for UX, then navigate home
    setTimeout(() => navigate('/', { replace: true }), 300);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-black mb-4">إعادة ضبط البيانات</h2>
        <p className="text-slate-400">جارٍ إعادة تعيين الإعدادات للنسخة الافتراضية، سيتم تحويلك للصفحة الرئيسية...</p>
      </div>
    </div>
  );
};

export default ResetData;
