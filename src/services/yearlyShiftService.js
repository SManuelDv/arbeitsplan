import { supabase } from '@/config/supabaseClient';
class YearlyShiftService {
    constructor() {
        Object.defineProperty(this, "checkAuth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error || !session) {
                    throw new Error('Usuário não autenticado');
                }
                return session;
            }
        });
        Object.defineProperty(this, "getYearShifts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (year) => {
                try {
                    await this.checkAuth();
                    const { data, error } = await supabase
                        .from('yearly_shifts')
                        .select('*')
                        .eq('year', year)
                        .order('date');
                    if (error)
                        throw error;
                    return data;
                }
                catch (error) {
                    console.error('[YearlyShiftService] Erro ao buscar turnos:', error);
                    throw new Error('Não foi possível carregar os turnos anuais');
                }
            }
        });
        Object.defineProperty(this, "updateShift", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (shift) => {
                try {
                    const session = await this.checkAuth();
                    // Verificar se já existe um turno para esta data e equipe
                    const { data: existingShift, error: findError } = await supabase
                        .from('yearly_shifts')
                        .select('*')
                        .eq('date', shift.date)
                        .eq('team', shift.team)
                        .eq('year', shift.year)
                        .single();
                    if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows returned
                        throw findError;
                    }
                    if (existingShift) {
                        // Se existe, atualizar
                        const { data: updatedShift, error: updateError } = await supabase
                            .from('yearly_shifts')
                            .update({ shift_type: shift.shift_type })
                            .eq('id', existingShift.id)
                            .select()
                            .single();
                        if (updateError)
                            throw updateError;
                        return updatedShift;
                    }
                    else {
                        // Se não existe, criar
                        const { data: newShift, error: createError } = await supabase
                            .from('yearly_shifts')
                            .insert([{
                                ...shift,
                                created_by: session.user.id
                            }])
                            .select()
                            .single();
                        if (createError)
                            throw createError;
                        return newShift;
                    }
                }
                catch (error) {
                    console.error('[YearlyShiftService] Erro ao atualizar turno:', error);
                    throw new Error('Não foi possível atualizar o turno');
                }
            }
        });
    }
}
export const yearlyShiftService = new YearlyShiftService();
