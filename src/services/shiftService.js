import { supabase } from '@/config/supabaseClient';
class ShiftService {
    async checkAuth() {
        console.log('[ShiftService] Verificando autenticação');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[ShiftService] Sessão atual:', session);
        if (error) {
            console.error('[ShiftService] Erro ao verificar autenticação:', error);
            throw error;
        }
        if (!session) {
            console.error('[ShiftService] Usuário não autenticado');
            throw new Error('Usuário não autenticado');
        }
        return session;
    }
    async getShifts(startDate, endDate) {
        try {
            await this.checkAuth();
            console.log('[ShiftService] Buscando turnos de', startDate, 'até', endDate);
            const { data, error } = await supabase
                .from('shifts')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date');
            if (error) {
                console.error('[ShiftService] Erro ao buscar turnos:', error);
                throw error;
            }
            return data;
        }
        catch (error) {
            console.error('[ShiftService] Erro ao buscar turnos:', error);
            throw new Error('Não foi possível carregar os turnos');
        }
    }
    async create(shift) {
        try {
            await this.checkAuth();
            console.log('[ShiftService] Criando turno:', shift);
            const { data, error } = await supabase
                .from('shifts')
                .insert([shift])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('[ShiftService] Erro ao criar turno:', error);
            throw new Error('Não foi possível criar o turno');
        }
    }
    async update(id, shift) {
        try {
            await this.checkAuth();
            console.log('[ShiftService] Atualizando turno:', id, shift);
            const { data, error } = await supabase
                .from('shifts')
                .update(shift)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('[ShiftService] Erro ao atualizar turno:', error);
            throw new Error('Não foi possível atualizar o turno');
        }
    }
    async delete(id) {
        try {
            await this.checkAuth();
            console.log('[ShiftService] Excluindo turno:', id);
            const { error } = await supabase
                .from('shifts')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
        }
        catch (error) {
            console.error('[ShiftService] Erro ao excluir turno:', error);
            throw new Error('Não foi possível excluir o turno');
        }
    }
    async getByEmployeeId(employeeId, startDate, endDate) {
        try {
            await this.checkAuth();
            console.log('[ShiftService] Buscando turnos do funcionário:', employeeId);
            const { data, error } = await supabase
                .from('shifts')
                .select('*')
                .eq('employee_id', employeeId)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date');
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('[ShiftService] Erro ao buscar turnos do funcionário:', error);
            throw new Error('Não foi possível carregar os turnos do funcionário');
        }
    }
    async updateShift(employeeId, date, data) {
        try {
            await this.checkAuth();
            console.log('[ShiftService] Atualizando turno do funcionário:', employeeId, date, data);
            // Primeiro, verificar se já existe um turno para esta data e funcionário
            const { data: existingShift, error: findError } = await supabase
                .from('shifts')
                .select('*')
                .eq('employee_id', employeeId)
                .eq('date', date)
                .single();
            if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw findError;
            }
            if (existingShift) {
                // Se existe, atualizar
                const { data: updatedShift, error: updateError } = await supabase
                    .from('shifts')
                    .update(data)
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
                    .from('shifts')
                    .insert([{
                        employee_id: employeeId,
                        date,
                        ...data
                    }])
                    .select()
                    .single();
                if (createError)
                    throw createError;
                return newShift;
            }
        }
        catch (error) {
            console.error('[ShiftService] Erro ao atualizar turno:', error);
            throw new Error('Não foi possível atualizar o turno');
        }
    }
}
export const shiftService = new ShiftService();
