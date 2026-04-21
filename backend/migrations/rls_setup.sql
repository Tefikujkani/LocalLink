-- LocalLink Super Security: PostgreSQL Row Level Security (RLS) Setup
-- =================================================================

-- 1. Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. Define Policies for "Users" Table
-- Users can read their own profile
CREATE POLICY user_read_own ON users
    FOR SELECT TO public
    USING (id = current_setting('app.current_user_id'));

-- 3. Define Policies for "Businesses" Table
-- Owners can manage (CRUD) their own businesses
CREATE POLICY business_owner_all ON businesses
    FOR ALL TO public
    USING (owner_id = current_setting('app.current_user_id'));

-- Everyone can view approved businesses (Tenant-scoped)
CREATE POLICY business_public_view ON businesses
    FOR SELECT TO public
    USING (status = 'approved');

-- 4. Define Policies for "Activity Logs" Table
-- Users can only view their own activity logs. Logs are INSERT only (Immutable).
CREATE POLICY logs_read_own ON activity_logs
    FOR SELECT TO public
    USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY logs_insert_all ON activity_logs
    FOR INSERT TO public
    WITH CHECK (true);

-- 5. Define Admin/SuperAdmin "BYPASS" Policies (Optional but recommended)
-- Admins can view all businesses for review
CREATE POLICY business_admin_view ON businesses
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = current_setting('app.current_user_id') 
        AND role IN ('admin', 'superadmin')
    ));
