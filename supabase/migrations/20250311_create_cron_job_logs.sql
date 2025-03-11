
-- Table to store cron job execution logs
CREATE TABLE IF NOT EXISTS public.cron_job_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_name TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on job_name for faster queries
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_job_name ON public.cron_job_logs(job_name);

-- Create an index on created_at for faster time-based queries
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_created_at ON public.cron_job_logs(created_at);

-- Grant permissions for authenticated users (optional, remove if not needed)
ALTER TABLE public.cron_job_logs ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view the cron job logs
CREATE POLICY admin_read_cron_job_logs ON public.cron_job_logs
  FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_admin = true));
