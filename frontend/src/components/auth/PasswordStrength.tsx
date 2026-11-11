import React from 'react';
import { getPasswordStrength } from '../../utils/validation';

const labels = ['Rất yếu', 'Yếu', 'Khá', 'Mạnh'];
const colors = ['bg-line', 'bg-danger', 'bg-warning', 'bg-primary'];

export function PasswordStrength({ password }: {password: string;}) {
  const strength = getPasswordStrength(password);
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex flex-1 gap-1" aria-hidden="true">
        {[1, 2, 3].map((i) =>
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${strength >= i ? colors[strength] : 'bg-line'}`} />

        )}
      </div>
      <span className="shrink-0 text-xs font-medium text-muted">Độ mạnh: {labels[strength]}</span>
    </div>);

}