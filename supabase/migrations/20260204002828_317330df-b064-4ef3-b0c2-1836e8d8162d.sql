-- Fix overly permissive INSERT policies for notifications and audit_logs
-- These should only be insertable by admin or system functions

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create audit logs" ON public.audit_logs;

-- Notifications can be inserted by admins only (system will use service role)
CREATE POLICY "Admins can create notifications" ON public.notifications 
FOR INSERT WITH CHECK (public.is_admin());

-- Audit logs can be inserted by admins only (system will use service role)
CREATE POLICY "Admins can create audit logs" ON public.audit_logs 
FOR INSERT WITH CHECK (public.is_admin());