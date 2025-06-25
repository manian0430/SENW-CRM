ALTER TABLE public.team_members
ADD COLUMN is_in_lead_rotation BOOLEAN DEFAULT FALSE;

UPDATE public.team_members
SET is_in_lead_rotation = TRUE
WHERE role = 'Agent'; 