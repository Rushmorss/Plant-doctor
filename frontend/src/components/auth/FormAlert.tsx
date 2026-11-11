import React from 'react';
import { CircleAlertIcon } from 'lucide-react';

export function FormAlert({ message }: {message?: string;}) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-2.5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger-ink">
      <CircleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="min-w-0">{message}</p>
    </div>);

}