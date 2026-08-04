import { fetchProperties, getPropertyById, getPrimaryPhotoUrl } from '../client';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('API Client Module', () => {
  //query string test
  test('fetchProperties formats non-empty filter parameters into URL query string', async () => {
    const mockResponse = { results: [{ id: 1, city: 'Austin' }], total: 1 };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const filters = { city: 'Austin', minPrice: '200000', beds: '2' };
    const data = await fetchProperties(filters);

    expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=Austin&minPrice=200000&beds=2');
    expect(data).toEqual(mockResponse);
  });

  //error path test
  test('fetchProperties throws expected Error when server responds with non-200 status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Database query failed' }),
    });

    await expect(fetchProperties()).rejects.toThrow('Database query failed');
  });

  //helper function test
  test('getPrimaryPhotoUrl returns first image URL or default fallback placeholder', () => {
    const validPhotoArray = JSON.stringify(['https://example.com/house.jpg']);
    const defaultPlaceholder = 'https://via.placeholder.com/400x300?text=No+Image+Available';

    expect(getPrimaryPhotoUrl(validPhotoArray)).toBe('https://example.com/house.jpg');
    expect(getPrimaryPhotoUrl(null)).toBe(defaultPlaceholder);
    expect(getPrimaryPhotoUrl('{ invalid json')).toBe(defaultPlaceholder);
  });
});