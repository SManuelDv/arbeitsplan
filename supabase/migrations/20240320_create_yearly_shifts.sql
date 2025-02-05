-- Criar a função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar enum para tipos de turno anual
CREATE TYPE yearly_shift_type AS ENUM ('🔴', '🟢', '🔵', '⚪');
CREATE TYPE yearly_team_type AS ENUM ('A', 'B', 'C', 'D');

-- Criar tabela de turnos anuais
CREATE TABLE IF NOT EXISTS yearly_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    team yearly_team_type NOT NULL,
    shift_type yearly_shift_type NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES auth.users(id),
    
    -- Garantir que não haja duplicatas para a mesma data/equipe/ano
    UNIQUE(date, team, year)
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_yearly_shifts_updated_at
    BEFORE UPDATE ON yearly_shifts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE yearly_shifts ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Usuários podem ver todos os turnos anuais"
    ON yearly_shifts FOR SELECT
    TO authenticated
    USING (true);

-- Permitir inserção/atualização apenas para o próprio usuário
CREATE POLICY "Usuários podem gerenciar seus próprios turnos anuais"
    ON yearly_shifts FOR ALL
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by); 