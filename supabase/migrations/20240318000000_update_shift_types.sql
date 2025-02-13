-- Atualizar os tipos de turno existentes
UPDATE shifts
SET shift_type = CASE shift_type
  WHEN '🔴' THEN 'morning'
  WHEN '🟢' THEN 'afternoon'
  WHEN '🔵' THEN 'night'
  WHEN '⚪' THEN 'off'
  ELSE 'off'
END;

-- Alterar o tipo da coluna shift_type para usar um enum
CREATE TYPE shift_type AS ENUM ('morning', 'afternoon', 'night', 'off');

-- Converter a coluna para usar o novo tipo
ALTER TABLE shifts 
  ALTER COLUMN shift_type TYPE shift_type 
  USING shift_type::shift_type; 