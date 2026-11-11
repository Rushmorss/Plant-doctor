import type { ScanOutcome } from '../types/plant';
import { ApiError } from './errors';

/**
 * Kịch bản mô phỏng dùng cho chế độ mock. Được điều khiển từ Controls panel (props của App)
 * để kiểm thử các trạng thái: AI không chắc chắn, không nhận diện được, mất kết nối Backend…
 */
export interface MockScenario {
  scanOutcome: ScanOutcome;
  emptyHistory: boolean;
  apiFailure: boolean;
}

let scenario: MockScenario = { scanOutcome: 'confident', emptyHistory: false, apiFailure: false };

export function setMockScenario(next: MockScenario): void {
  scenario = next;
}

export function getMockScenario(): MockScenario {
  return scenario;
}

export function mockDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const id = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(id);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

export const NETWORK_ERROR_MESSAGE = 'Không thể kết nối máy chủ. Kiểm tra kết nối mạng rồi thử lại.';

/** Bọc một thao tác mock với độ trễ mạng và khả năng mô phỏng lỗi kết nối. */
export async function mockRequest<T>(fn: () => T, ms = 500, signal?: AbortSignal): Promise<T> {
  await mockDelay(ms, signal);
  if (scenario.apiFailure) throw new ApiError('network', NETWORK_ERROR_MESSAGE);
  return fn();
}