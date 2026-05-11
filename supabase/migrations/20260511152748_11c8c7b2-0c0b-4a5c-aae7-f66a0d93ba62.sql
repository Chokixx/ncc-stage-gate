CREATE TABLE public.gmat_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gmat_submissions ENABLE ROW LEVEL SECURITY;

-- Permitir que cualquier visitante envíe (insert) su intento.
CREATE POLICY "anyone can insert gmat submission"
  ON public.gmat_submissions
  FOR INSERT
  WITH CHECK (true);

-- Nadie puede leer / actualizar / borrar desde el cliente.
-- Los organizadores acceden a los registros desde el dashboard de Cloud.