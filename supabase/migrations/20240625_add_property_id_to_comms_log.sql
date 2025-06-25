ALTER TABLE public.communications_log
ADD COLUMN property_id UUID,
ADD CONSTRAINT fk_property
  FOREIGN KEY(property_id) 
  REFERENCES properties(id)
  ON DELETE SET NULL;

COMMENT ON COLUMN public.communications_log.property_id IS 'Reference to the property this communication is about'; 