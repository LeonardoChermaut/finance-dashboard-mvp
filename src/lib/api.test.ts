import { ApiService } from '@/lib/api';

const mockApi = {
  fetch: jest.fn(),
  endpoint: '/test-endpoint',
  baseUrl: 'http://test-api.com',
  url: 'http://test-api.com/test-endpoint',
};

beforeEach(() => jest.clearAllMocks());

const createTestApi = () => new ApiService(mockApi);

describe('ApiService', () => {
  describe('get', () => {
    it('Fetches data from correct endpoint', async () => {
      const api = createTestApi();
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      await api.get(mockApi.endpoint);

      expect(mockApi.fetch).toHaveBeenCalledWith(
        mockApi.url,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('Appends query params to URL', async () => {
      const api = createTestApi();
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      await api.get(mockApi.endpoint, { page: 1, pageSize: 10 });

      expect(mockApi.fetch).toHaveBeenCalledWith(
        `${mockApi.url}?page=1&pageSize=10`,
        expect.any(Object),
      );
    });

    it('Returns parsed JSON response', async () => {
      const api = createTestApi();
      const responseData = { data: 'test', total: 100 };
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      });

      const result = await api.get(mockApi.endpoint);

      expect(result).toEqual(responseData);
    });

    it('Throws error for non-ok response', async () => {
      const api = createTestApi();
      mockApi.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });

      await expect(api.get(mockApi.endpoint)).rejects.toEqual({
        message: 'Not Found',
        status: 404,
      });
    });
  });

  describe('post', () => {
    it('Sends POST request with data', async () => {
      const api = createTestApi();
      const postData = { name: 'test' };
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...postData }),
      });

      await api.post(mockApi.endpoint, postData);

      expect(mockApi.fetch).toHaveBeenCalledWith(
        mockApi.url,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        }),
      );
    });

    it('Returns parsed JSON response', async () => {
      const api = createTestApi();
      const responseData = { id: 1, name: 'test' };
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      });

      const result = await api.post(mockApi.endpoint, { name: 'test' });

      expect(result).toEqual(responseData);
    });
  });

  describe('put', () => {
    it('Sends PUT request with data', async () => {
      const api = createTestApi();
      const putData = { id: 1, name: 'updated' };
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => putData,
      });

      await api.put(mockApi.endpoint, putData);

      expect(mockApi.fetch).toHaveBeenCalledWith(
        mockApi.url,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        }),
      );
    });
  });

  describe('delete', () => {
    it('Sends DELETE request', async () => {
      const api = createTestApi();
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await api.delete('/test-endpoint/1');

      expect(mockApi.fetch).toHaveBeenCalledWith(
        `${mockApi.url}/1`,
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });

    it('Sends DELETE request with data', async () => {
      const api = createTestApi();
      const deleteData = { id: 1 };
      mockApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await api.delete(`${mockApi.endpoint}/1`, deleteData);

      expect(mockApi.fetch).toHaveBeenCalledWith(
        `${mockApi.url}/1`,
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify(deleteData),
        }),
      );
    });
  });
});
