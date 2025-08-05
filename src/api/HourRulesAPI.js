import axios from '../lib/axios';

const API_BASE_URL = '/hour-rules';

export const HourRulesAPI = {
  // Obtener las reglas actuales (público)
  async getCurrentRules() {
    try {
      const response = await axios.get(`${API_BASE_URL}/current`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reglas de horarios:', error);
      throw error;
    }
  },

  // Actualizar las reglas (requiere autenticación y permisos de admin)
  async updateRules(rules) {
    try {
      const response = await axios.put(`${API_BASE_URL}/update`, { rules });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar reglas de horarios:', error);
      throw error;
    }
  },

  // Obtener historial de cambios (requiere autenticación y permisos de admin)
  async getHistory() {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de reglas:', error);
      throw error;
    }
  }
}; 