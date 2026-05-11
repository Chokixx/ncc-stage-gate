DROP POLICY IF EXISTS "anyone can insert gmat submission" ON public.gmat_submissions;
-- Sin políticas para anon/authenticated => solo el service_role (usado por el server route) puede escribir.