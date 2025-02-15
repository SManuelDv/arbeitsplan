-- Criar o tipo enum primeiro (se ainda não existir)
DO $$ BEGIN
    CREATE TYPE shift_type_enum AS ENUM ('morning', 'afternoon', 'night', 'off');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Atualizar os valores existentes para o novo formato
UPDATE shifts
SET shift_type = CASE shift_type
    WHEN '🔴' THEN 'morning'::text
    WHEN '🟢' THEN 'afternoon'::text
    WHEN '🔵' THEN 'night'::text
    WHEN '⚪' THEN 'off'::text
    ELSE 'off'::text
END;

-- Alterar a coluna para usar o novo tipo enum
ALTER TABLE shifts 
    ALTER COLUMN shift_type TYPE shift_type_enum 
    USING shift_type::shift_type_enum; 