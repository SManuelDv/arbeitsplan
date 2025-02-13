import { api } from '@/lib/axios';
export const shiftService = {
    // Buscar turnos de um período
    getShifts: async (startDate, endDate) => {
        const { data } = await api.get('/shifts', {
            params: { startDate, endDate }
        });
        return data;
    },
    // Atualizar um turno
    updateShift: async (shift) => {
        const { data } = await api.put(`/shifts/${shift.id}`, shift);
        return data;
    },
    // Criar um novo turno
    createShift: async (shift) => {
        const { data } = await api.post('/shifts', shift);
        return data;
    },
    // Salvar turno (cria ou atualiza)
    saveShift: async (shift) => {
        if (shift.id) {
            return shiftService.updateShift(shift);
        }
        return shiftService.createShift(shift);
    }
};
