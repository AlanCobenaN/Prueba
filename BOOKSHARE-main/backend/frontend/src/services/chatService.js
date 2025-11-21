import api from './api';

export const chatService = {
  async sendMessage(destinatarioId, contenido) {
    const response = await api.post('/chat/send', {
      destinatarioId,
      contenido
    });
    return response.data;
  },

  async getConversation(userId) {
    const response = await api.get(`/chat/${userId}`);
    return response.data;
  },

  async getConversations() {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};
