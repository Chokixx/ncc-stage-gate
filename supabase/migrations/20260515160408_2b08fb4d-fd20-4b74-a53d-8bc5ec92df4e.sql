-- Tabla de contenido por etapa
CREATE TABLE public.stage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage TEXT NOT NULL UNIQUE CHECK (stage IN ('alpha','beta','delta')),
  intro TEXT NOT NULL DEFAULT '',
  sponsor_name TEXT NOT NULL DEFAULT '',
  sponsor_logo_url TEXT,
  sponsor_link TEXT,
  case_pdf_url TEXT,
  case_pdf_name TEXT,
  case_data_url TEXT,
  case_data_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stage_content public read"
ON public.stage_content
FOR SELECT
USING (true);

-- Trigger para updated_at usando función existente
CREATE TRIGGER stage_content_updated_at
BEFORE UPDATE ON public.stage_content
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- Filas iniciales para cada etapa
INSERT INTO public.stage_content (stage) VALUES ('alpha'), ('beta'), ('delta');

-- Bucket público para archivos de etapas
INSERT INTO storage.buckets (id, name, public)
VALUES ('stage-files', 'stage-files', true)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública de los archivos de etapas
CREATE POLICY "stage-files public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'stage-files');
