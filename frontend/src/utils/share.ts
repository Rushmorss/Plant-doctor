export type ShareResult = 'shared' | 'copied' | 'failed';

export async function shareText(title: string, text: string): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'failed';
    }
  }
  return copyText(text);
}

export async function copyText(text: string): Promise<ShareResult> {
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}