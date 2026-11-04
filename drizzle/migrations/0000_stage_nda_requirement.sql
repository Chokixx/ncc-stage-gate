ALTER TABLE public.stage_content
  ADD COLUMN IF NOT EXISTS nda_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nda_url text,
  ADD COLUMN IF NOT EXISTS nda_name text;

COMMENT ON COLUMN public.stage_content.nda_enabled IS 'Exigir NDA firmado por cada integrante antes de aceptar la entrega';
COMMENT ON COLUMN public.stage_content.nda_url IS 'Ruta privada del documento NDA que los equipos deben firmar';