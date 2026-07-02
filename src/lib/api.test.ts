import { ApiService } from '@/lib/api';

const mockFetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const createTestApi = () =>
  new ApiService({
    baseUrl: 'http://test-api.com',
    fetch: mockFetch,
  });

describe('ApiService', () => {
  describe('get', () => {
    it('Fetches data from correct endpoint', async () => {
      const api = createTestApi();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      await api.get('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/test-endpoint',
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
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      await api.get('/test-endpoint', { page: 1, pageSize: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/test-endpoint?page=1&pageSize=10',
        expect.any(Object),
      );
    });

    it('Returns parsed JSON response', async () => {
      const api = createTestApi();
      const responseData = { data: 'test', total: 100 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      });

      const result = await api.get('/test-endpoint');

      expect(result).toEqual(responseData);
    });

    it('Throws error for non-ok response', async () => {
      const api = createTestApi();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });

      await expect(api.get('/test-endpoint')).rejects.toEqual({
        message: 'Not Found',
        status: 404,
      });
    });
  });

  describe('post', () => {
    it('Sends POST request with data', async () => {
      const api = createTestApi();
      const postData = { name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...postData }),
      });

      await api.post('/test-endpoint', postData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/test-endpoint',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        }),
      );
    });

    it('Returns parsed JSON response', async () => {
      const api = createTestApi();
      const responseData = { id: 1, name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      });

      const result = await api.post('/test-endpoint', { name: 'test' });

      expect(result).toEqual(responseData);
    });
  });

  describe('put', () => {
    it('Sends PUT request with data', async () => {
      const api = createTestApi();
      const putData = { id: 1, name: 'updated' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => putData,
      });

      await api.put('/test-endpoint/1', putData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/test-endpoint/1',
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
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await api.delete('/test-endpoint/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/test-endpoint/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });

    it('Sends DELETE request with data', async () => {
      const api = createTestApi();
      const deleteData = { id: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await api.delete('/test-endpoint/1', deleteData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/test-endpoint/1',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify(deleteData),
        }),
      );
    });
  });
});
