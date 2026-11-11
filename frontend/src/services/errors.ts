export type ApiErrorCode =
'network' |
'invalid_image' |
'unrecognized' |
'unauthorized' |
'not_found' |
'conflict' |
'validation' |
'storage' |
'unknown';

export class ApiError extends Error {
  code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

export function getErrorCode(error: unknown): ApiErrorCode {
  return error instanceof ApiError ? error.code : 'unknown';
}