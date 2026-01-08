-- =====================================================
-- NR-OS v3.0: Row Level Security Policies
-- =====================================================
-- تفعيل RLS على جميع الجداول الحساسة وإنشاء سياسات الأمان

-- 1. تفعيل RLS على جميع الجداول
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 2. سياسات site_settings (مالك واحد فقط)
DROP POLICY IF EXISTS "Owner can view site_settings" ON site_settings;
CREATE POLICY "Owner can view site_settings"
  ON site_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner can update site_settings" ON site_settings;
CREATE POLICY "Owner can update site_settings"
  ON site_settings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner can insert site_settings" ON site_settings;
CREATE POLICY "Owner can insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. سياسات clients (المالك فقط)
DROP POLICY IF EXISTS "Owner can manage clients" ON clients;
CREATE POLICY "Owner can manage clients"
  ON clients FOR ALL
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

-- 4. سياسات projects (المالك فقط)
DROP POLICY IF EXISTS "Owner can manage projects" ON projects;
CREATE POLICY "Owner can manage projects"
  ON projects FOR ALL
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

-- 5. سياسات invoices (المالك فقط)
DROP POLICY IF EXISTS "Owner can manage invoices" ON invoices;
CREATE POLICY "Owner can manage invoices"
  ON invoices FOR ALL
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

-- 6. سياسات expenses (المالك فقط)
DROP POLICY IF EXISTS "Owner can manage expenses" ON expenses;
CREATE POLICY "Owner can manage expenses"
  ON expenses FOR ALL
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

-- 7. سياسات service_requests (قراءة عامة، كتابة للجميع، تحديث للمالك فقط)
DROP POLICY IF EXISTS "Anyone can create service requests" ON service_requests;
CREATE POLICY "Anyone can create service requests"
  ON service_requests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owner can view service requests" ON service_requests;
CREATE POLICY "Owner can view service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

DROP POLICY IF EXISTS "Owner can update service requests" ON service_requests;
CREATE POLICY "Owner can update service requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

DROP POLICY IF EXISTS "Owner can delete service requests" ON service_requests;
CREATE POLICY "Owner can delete service requests"
  ON service_requests FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

-- 8. سياسات articles (قراءة عامة للمنشورة، كتابة للمالك فقط)
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (
    (data->>'published')::boolean = true 
    OR auth.uid() = (SELECT user_id FROM site_settings LIMIT 1)
  );

DROP POLICY IF EXISTS "Owner can manage articles" ON articles;
CREATE POLICY "Owner can manage articles"
  ON articles FOR ALL
  USING (auth.uid() = (SELECT user_id FROM site_settings LIMIT 1));

-- 9. سياسات notifications (المستخدم يرى إشعاراته فقط)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- 10. إنشاء Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles((data->>'published')) WHERE (data->>'published')::boolean = true;
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_service_requests_created ON service_requests(created_at DESC);

-- 11. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
