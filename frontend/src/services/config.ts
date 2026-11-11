/**
 * Cấu hình kết nối Backend.
 *
 * CHỜ BACKEND: Dự án hiện chưa có API. Toàn bộ service đang chạy ở chế độ 'mock'
 * với dữ liệu mẫu và kết quả AI mô phỏng. Khi Backend sẵn sàng, đặt `baseUrl`,
 * chuyển `mode` sang 'api' và bổ sung adapter HTTP trong từng service theo tài liệu API thật.
 * Không tự tạo endpoint giả trong frontend.
 */
export const apiConfig = {
  baseUrl: '',
  mode: 'mock' as 'mock' | 'api'
};

export const isMockMode = apiConfig.mode === 'mock';