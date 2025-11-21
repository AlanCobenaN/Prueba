import api from './api';

export const bookService = {
  async getAllBooks(params) {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async getMyBooks() {
    const response = await api.get('/books/my-books');
    return response.data;
  },

  async createBook(formData) {
    const response = await api.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateBook(id, formData) {
    const response = await api.put(`/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }
};
