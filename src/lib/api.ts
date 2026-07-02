import { env } from '@/constants/config';

export interface IApiError {
  message: string;
  status: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  pageSize: number;
  totalPages: number;
}

export interface IPaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ApiConfig {
  readonly baseUrl: string;
  readonly fetch: typeof globalThis.fetch;
}

const buildAuthHeaders = (user: string, pass: string): Record<string, string> => {
  if (user === '' || pass === '') {
    return {};
  }

  return {
    Authorization: `Basic ${btoa(`${user}:${pass}`)}`,
  };
};

const buildQueryString = (params?: IPaginationParams): string => {
  if (params === undefined) {
    return '';
  }

  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }

  if (params.pageSize !== undefined) {
    searchParams.append('pageSize', params.pageSize.toString());
  }

  const queryString = searchParams.toString();

  return queryString !== '' ? `?${queryString}` : '';
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.text();

    const apiError: IApiError = {
      message: error,
      status: response.status,
    };

    throw apiError;
  }

  return response.json() as Promise<T>;
};

export class ApiService {
  private readonly baseUrl: string;
  private readonly fetch: typeof globalThis.fetch;
  private readonly headers: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.fetch = config.fetch;
    this.headers = {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(env.NEXT_PUBLIC_API_USER, env.NEXT_PUBLIC_API_PASS),
    };
  }

  public async get<T>(endpoint: string, params?: IPaginationParams): Promise<T> {
    const queryString = buildQueryString(params);
    const response = await this.fetch(`${this.baseUrl}${endpoint}${queryString}`, {
      method: 'GET',
      headers: this.headers,
    });

    return handleResponse<T>(response);
  }

  public async post<T, D>(endpoint: string, data: D): Promise<T> {
    const response = await this.fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  }

  public async put<T, D>(endpoint: string, data: D): Promise<T> {
    const response = await this.fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  }

  public async delete<T, D = undefined>(endpoint: string, data?: D): Promise<T> {
    const response = await this.fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  }
}

const createApi = (): ApiService =>
  new ApiService({
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    fetch: globalThis.fetch,
  });

export const api = createApi();
