-- Restrict stage_content from public reads; access via server functions only.
DROP POLICY IF EXISTS "stage_content public read" ON public.stage_content;

-- Ensure RLS is enforced on sensitive tables (no SELECT policy = denied to anon/authenticated)
ALTER TABLE public.stage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gmat_submissions ENABLE ROW LEVEL SECURITY;
