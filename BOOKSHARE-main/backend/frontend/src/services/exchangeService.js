import api from './api';

export const exchangeService = {
  async createExchange(data) {
    const response = await api.post('/exchanges', data);
    return response.data;
  },

  async getReceivedExchanges() {
    const response = await api.get('/exchanges/received');
    return response.data;
  },

  async getSentExchanges() {
    const response = await api.get('/exchanges/sent');
    return response.data;
  },

  async updateExchangeStatus(id, estado) {
    const response = await api.put(`/exchanges/${id}/status`, { estado });
    return response.data;
  },

  async completeExchange(id) {
    const response = await api.put(`/exchanges/${id}/complete`);
    return response.data;
  }
};
