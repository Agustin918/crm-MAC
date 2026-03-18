export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, _statusCode: number = 500): ApiResponse<never> {
  return {
    success: false,
    error,
  };
}

export function paginatedResponse<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export function validateBody(_body: unknown, requiredFields: string[]): { valid: boolean; missing?: string[] } {
  if (!_body || typeof _body !== 'object') {
    return { valid: false, missing: requiredFields };
  }
  
  const missing = requiredFields.filter(field => !(field in _body));
  
  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  };
}
