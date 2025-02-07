-- Adiciona o campo department à tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department VARCHAR(50);

-- Atualiza as políticas de segurança para incluir o novo campo
ALTER POLICY "Usuários podem ver seus próprios perfis" ON profiles
    USING (auth.uid() = id);

ALTER POLICY "Usuários podem atualizar seus próprios perfis" ON profiles
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Garante que administradores possam ver todos os perfis
CREATE POLICY IF NOT EXISTS "Administradores podem ver todos os perfis" ON profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Garante que administradores possam atualizar todos os perfis
CREATE POLICY IF NOT EXISTS "Administradores podem atualizar todos os perfis" ON profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    ); 