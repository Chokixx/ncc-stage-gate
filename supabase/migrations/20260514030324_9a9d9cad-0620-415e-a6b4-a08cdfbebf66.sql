
-- Conservar solo el primer envío por equipo
DELETE FROM public.gmat_submissions a
USING public.gmat_submissions b
WHERE a.team = b.team
  AND a.submitted_at > b.submitted_at;

-- Restricción única por equipo
ALTER TABLE public.gmat_submissions
ADD CONSTRAINT gmat_submissions_team_unique UNIQUE (team);
