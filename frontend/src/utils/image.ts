export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
export const IMAGE_ACCEPT_ATTR = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MIN_IMAGE_SIDE = 224;

export type ImageValidation = {ok: true;} | {ok: false;reason: string;};

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File): ImageValidation {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const typeOk = ACCEPTED_IMAGE_TYPES.includes(file.type) || !file.type && ACCEPTED_EXTENSIONS.includes(ext);
  if (!typeOk) {
    return {
      ok: false,
      reason: `Tệp “${file.name}” không được hỗ trợ. Vui lòng chọn ảnh định dạng JPG, JPEG, PNG hoặc WEBP.`
    };
  }
  if (file.size === 0) return { ok: false, reason: 'Tệp ảnh trống hoặc bị hỏng. Vui lòng chọn ảnh khác.' };
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      reason: `Ảnh có dung lượng ${formatBytes(file.size)}, vượt quá giới hạn 10 MB. Hãy chọn ảnh khác hoặc chụp trực tiếp.`
    };
  }
  return { ok: true };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không đọc được ảnh'));
    img.src = src;
  });
}

export async function readImageDimensions(src: string): Promise<{width: number;height: number;}> {
  const img = await loadImage(src);
  return { width: img.naturalWidth, height: img.naturalHeight };
}

/** Thu nhỏ & nén ảnh thành JPEG để gửi phân tích và lưu vào lịch sử. */
export async function compressImage(src: string, maxSide = 640, quality = 0.78): Promise<string> {
  const img = await loadImage(src);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}