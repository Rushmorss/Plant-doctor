import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatScanDateTime(iso: string): string {
  return format(new Date(iso), 'HH:mm · dd/MM/yyyy');
}

export function formatScanTime(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

export function formatScanDay(iso: string): string {
  const text = format(new Date(iso), 'EEEE, dd/MM/yyyy', { locale: vi });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatToday(): string {
  return formatScanDay(new Date().toISOString());
}

export function getDayKey(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}