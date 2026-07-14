-- Add super_admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- College premium status table
CREATE TABLE IF NOT EXISTS public.college_premium (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  college_slug TEXT NOT NULL UNIQUE,
  premium_active BOOLEAN NOT NULL DEFAULT false,
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.college_premium TO authenticated;
GRANT ALL ON public.college_premium TO service_role;
ALTER TABLE public.college_premium ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view premium status"
  ON public.college_premium FOR SELECT TO authenticated USING (true);
CREATE POLICY "Platform admins manage premium"
  ON public.college_premium FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'platform_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

-- Notifications table (for college admin dashboards)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users update their own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reported reviews table (for admin moderation)
CREATE TABLE IF NOT EXISTS public.reported_reviews (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id TEXT NOT NULL,
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
GRANT SELECT, INSERT ON public.reported_reviews TO authenticated;
GRANT ALL ON public.reported_reviews TO service_role;
ALTER TABLE public.reported_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can report reviews"
  ON public.reported_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Platform admins view all reports"
  ON public.reported_reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'platform_admin') OR auth.uid() = reported_by);

-- updated_at trigger for college_premium
CREATE TRIGGER college_premium_set_updated_at BEFORE UPDATE ON public.college_premium
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Super admin policies
CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins manage assignments"
  ON public.college_admin_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins manage premium"
  ON public.college_premium FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));