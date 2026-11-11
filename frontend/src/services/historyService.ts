import { scanHistory } from '../data/scanHistory';
import type { ScanRecord } from '../types/plant';
import { ApiError } from './errors';
import { getMockScenario, mockRequest } from './mockScenario';
import { readJSON, writeJSON } from './storage';

/**
 * Lịch sử nhận diện. CHỜ BACKEND: hiện lưu trên thiết bị (localStorage),
 * khởi tạo bằng dữ liệu mẫu. Kết quả mới được thêm khi người dùng phân tích ảnh.
 */
const STORAGE_KEY = 'apd.history.v1';
export const USER_SCAN_PREFIX = 'scan-';

let cache: ScanRecord[] | null = null;

function load(): ScanRecord[] {
  if (!cache) {
    cache =
    readJSON<ScanRecord[] | null>(STORAGE_KEY, null) ??
    scanHistory.map((record) => ({ ...record, source: 'mock' as const }));
  }
  return cache;
}

function persist(list: ScanRecord[]): boolean {
  cache = list;
  return writeJSON(STORAGE_KEY, list);
}

function visible(list: ScanRecord[]): ScanRecord[] {
  return getMockScenario().emptyHistory ? list.filter((r) => r.id.startsWith(USER_SCAN_PREFIX)) : list;
}

const byNewest = (a: ScanRecord, b: ScanRecord) =>
new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();

export const historyService = {
  list(signal?: AbortSignal): Promise<ScanRecord[]> {
    return mockRequest(() => [...visible(load())].sort(byNewest), 500, signal);
  },

  get(id: string, signal?: AbortSignal): Promise<ScanRecord> {
    return mockRequest(() => {
      const record = load().find((r) => r.id === id);
      if (!record) throw new ApiError('not_found', 'Không tìm thấy kết quả phân tích này. Có thể nó đã bị xóa.');
      return record;
    }, 350, signal);
  },

  /** Lưu kết quả mới. Trả về persisted=false nếu bộ nhớ thiết bị đầy (kết quả vẫn xem được trong phiên này). */
  add(record: ScanRecord): {persisted: boolean;} {
    return { persisted: persist([record, ...load()]) };
  },

  remove(id: string, signal?: AbortSignal): Promise<void> {
    return mockRequest(() => {
      persist(load().filter((r) => r.id !== id));
    }, 400, signal);
  },

  clear(signal?: AbortSignal): Promise<void> {
    return mockRequest(() => {
      persist([]);
    }, 500, signal);
  },

  createId(): string {
    return `${USER_SCAN_PREFIX}${Date.now()}`;
  }
};