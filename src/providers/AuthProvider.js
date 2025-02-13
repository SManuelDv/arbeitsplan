import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
const AuthContext = createContext({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false
});
export function useAuthContext() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const retryCount = useRef(0);
    const maxRetries = 3;
    const profileCache = useRef({});
    // Função para buscar o perfil do usuário com retry e delay exponencial
    const fetchProfile = useCallback(async (userId) => {
        try {
            // Verificar cache primeiro
            if (profileCache.current[userId]) {
                setProfile(profileCache.current[userId]);
                return;
            }
            if (retryCount.current >= maxRetries) {
                console.error('Máximo de tentativas excedido ao buscar perfil');
                return;
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) {
                throw error;
            }
            // Se chegou aqui, temos dados válidos
            const profileData = data;
            setProfile(profileData);
            profileCache.current[userId] = profileData;
            retryCount.current = 0;
        }
        catch (error) {
            console.error('Erro ao buscar perfil:', error);
            if (error.code === 'PGRST116' || retryCount.current >= maxRetries) {
                // Criar perfil padrão se a tabela não existe ou após máximo de tentativas
                const defaultProfile = {
                    id: userId,
                    email: user?.email || '',
                    role: 'normal',
                    full_name: user?.user_metadata?.full_name || null,
                    avatar_url: null,
                    department: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                setProfile(defaultProfile);
                profileCache.current[userId] = defaultProfile;
                return;
            }
            retryCount.current++;
            const delay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
            await fetchProfile(userId);
        }
    }, [user]);
    useEffect(() => {
        let mounted = true;
        const updateState = async (session) => {
            if (!mounted)
                return;
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.id);
            }
            else {
                setProfile(null);
                retryCount.current = 0;
                // Limpar cache ao fazer logout
                profileCache.current = {};
            }
            setLoading(false);
        };
        // Verificar sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            updateState(session);
        });
        // Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            updateState(session);
        });
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);
    const value = {
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin'
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
