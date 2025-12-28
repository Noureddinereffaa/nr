---
description: دليل ربط Vercel بقاعدة بيانات Supabase لـ NR-OS
---

# دليل ربط Vercel بقاعدة بيانات Supabase (NR-OS)

لضمان عمل النظام بكفاءة بعد الرفع على Vercel، يجب إعداد المتغيرات البيئية (Environment Variables) وتهيئة قاعدة البيانات. اتبع الخطوات التالية:

## 1. الحصول على بيانات الاتصال
انتقل إلى لوحة تحكم **Supabase** الخاصة بمشروعك:
1. اذهب إلى **Project Settings** > **API**.
2. انسخ القيم التالية:
   - `Project URL` (سيكون هذا `VITE_SUPABASE_URL`)
   - `anon public` key (سيكون هذا `VITE_SUPABASE_ANON_KEY`)

## 2. إعداد المتغيرات في Vercel
1. انتقل إلى لوحة تحكم **Vercel** وافتح مشروع `nr-os`.
2. اذهب إلى **Settings** > **Environment Variables**.
3. أضف المتغيرين التاليين بدقة:
   - **Key:** `VITE_SUPABASE_URL` | **Value:** (الرابط الذي نسخته)
   - **Key:** `VITE_SUPABASE_ANON_KEY` | **Value:** (المفتاح الذي نسخته)
4. اضغط على **Save**.
5. قم بإعادة نشر المشروع لضمان تفعيل القيم الجديدة (**Deployments** > **Redeploy**).

## 3. تهيئة قاعدة البيانات (مهم جداً)
إذا كانت هذه هي المرة الأولى لربط المشروع، يجب إنشاء الجداول اللازمة:
1. في Supabase، انتقل إلى **SQL Editor**.
2. قم بتشغيل الأكواد الموجودة في الملفات التالية (بالترتيب):
   - [supabase_migration.sql](file:///c:/Users/DELL/ns-reffaa/nr-os/supabase_migration.sql): يحتوي على هيكلية الجداول الأساسية.
   - [secure_migration.sql](file:///c:/Users/DELL/ns-reffaa/nr-os/secure_migration.sql): يحتوي على إعدادات الأمان والبحث.

## 4. التحقق من الاتصال
بمجرد اكتمال الرفع، يمكنك الدخول إلى لوحة التحكم (Dashboard) في موقعك المرفوع.
- إذا ظهرت البيانات الافتراضية، فهذا يعني أن الاتصال ناجح.
- يمكنك التحقق من سجلات Vercel (**Logs**) للتأكد من عدم وجود أخطاء في الاتصال.

> [!TIP]
> تأكد دائماً أن أسماء المتغيرات تبدأ بـ `VITE_` لكي يتمكن Vite من التعرف عليها في بيئة الإنتاج.
