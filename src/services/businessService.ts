import { Business, BusinessStatus } from '../types';
import api from './api';

// Helper to normalize backend snake_case fields to camelCase
const normalize = (b: any): Business => ({
  id: b.id,
  ownerId: b.ownerId,
  name: b.name,
  category: b.category,
  description: b.description,
  phone: b.phone,
  lat: b.lat,
  lng: b.lng,
  status: b.status as BusinessStatus,
  createdAt: b.createdAt,
  imageUrl: b.imageUrl,
  rating: b.rating,
  locationName: b.locationName,
});

export const businessService = {
  /** GET /api/businesses — public, returns only approved listings */
  getBusinesses: async (): Promise<Business[]> => {
    const { data } = await api.get('/api/businesses');
    return data.map(normalize);
  },

  /** GET /api/businesses/mine — current user's own listings */
  getMyBusinesses: async (): Promise<Business[]> => {
    const { data } = await api.get('/api/businesses/mine');
    return data.map(normalize);
  },

  /** GET /api/businesses/pending — admin/superadmin only */
  getPendingBusinesses: async (): Promise<Business[]> => {
    const { data } = await api.get('/api/businesses/pending');
    return data.map(normalize);
  },

  /** POST /api/businesses — create a new business listing */
  createBusiness: async (
    payload: Omit<Business, 'id' | 'status' | 'createdAt' | 'ownerId'>
  ): Promise<Business> => {
    const { data } = await api.post('/api/businesses', {
      name: payload.name,
      category: payload.category,
      description: payload.description,
      phone: payload.phone,
      lat: payload.lat,
      lng: payload.lng,
      locationName: payload.locationName,
      imageUrl: payload.imageUrl,
    });
    return normalize(data);
  },

  /** PUT /api/businesses/:id — update an existing listing */
  updateBusiness: async (
    id: string,
    payload: Omit<Business, 'id' | 'status' | 'createdAt' | 'ownerId'>
  ): Promise<Business> => {
    const { data } = await api.put(`/api/businesses/${id}`, {
      name: payload.name,
      category: payload.category,
      description: payload.description,
      phone: payload.phone,
      lat: payload.lat,
      lng: payload.lng,
      locationName: payload.locationName,
      imageUrl: payload.imageUrl,
    });
    return normalize(data);
  },

  /** PUT /api/businesses/:id/status — admin only */
  updateBusinessStatus: async (id: string, status: BusinessStatus): Promise<Business> => {
    const { data } = await api.put(`/api/businesses/${id}/status`, { status });
    return normalize(data);
  },

  /** GET /api/businesses/upload-url */
  getUploadUrl: async (fileName: string, contentType: string): Promise<{ url: string; key: string; is_mock: boolean }> => {
    const { data } = await api.get('/api/businesses/upload-url', {
      params: { file_name: fileName, content_type: contentType }
    });
    return data;
  },

  /** Direct upload to S3 (or mock) */
  uploadImage: async (file: File): Promise<string> => {
    const { url, key, is_mock } = await businessService.getUploadUrl(file.name, file.type);
    
    // Direct upload to S3 via PUT
    await api.put(url, file, {
      headers: { 'Content-Type': file.type }
    });
    
    // Return the final S3 key or URL
    return is_mock ? `mock:///${key}` : key;
  },

  /** POST /api/ai/assistant */
  askAI: async (query: string, businessId?: string): Promise<string> => {
    const { data } = await api.post('/api/ai/assistant', null, {
      params: { query, business_id: businessId }
    });
    return data.response;
  },

  /** DELETE /api/businesses/:id */
  deleteBusiness: async (id: string): Promise<void> => {
    await api.delete(`/api/businesses/${id}`);
  },
};
