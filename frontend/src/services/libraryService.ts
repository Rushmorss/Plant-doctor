import { crops } from '../data/crops';
import { diseases } from '../data/diseases';
import type { Crop, Disease } from '../types/plant';
import { mockRequest } from './mockScenario';

/** Thư viện bệnh cây. CHỜ BACKEND: đang đọc từ dữ liệu tĩnh trong data/. */
export const libraryService = {
  listCrops(signal?: AbortSignal): Promise<Crop[]> {
    return mockRequest(() => crops, 300, signal);
  },

  listDiseases(signal?: AbortSignal): Promise<Disease[]> {
    return mockRequest(() => diseases, 500, signal);
  },

  getDisease(id: string, signal?: AbortSignal): Promise<Disease | null> {
    return mockRequest(() => diseases.find((d) => d.id === id) ?? null, 200, signal);
  }
};