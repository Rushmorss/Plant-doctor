import React, { useId, useState } from "react";
import { CircleAlertIcon, EyeIcon, EyeOffIcon, BoxIcon } from "lucide-react";
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: BoxIcon;
  error?: string;
  hint?: string;
}
export function TextField({
  label,
  icon: Icon,
  error,
  hint,
  id,
  type = 'text',
  className = '',
  ...rest
}: TextFieldProps) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const isPassword = type === 'password';
  return <div className={`min-w-0 ${className}`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />}
        <input id={inputId} type={isPassword && visible ? 'text' : type} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? messageId : undefined} className={`h-12 w-full min-w-0 rounded-xl border bg-surface text-base text-ink placeholder:text-muted/80 transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-4 disabled:bg-canvas disabled:text-muted sm:text-[15px] ${error ? 'border-danger focus:ring-danger/10' : 'border-line focus:border-primary focus:ring-primary/10'} ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}`} {...rest} />
        {isPassword && <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:text-ink">
            {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>}
      </div>
      {error ? <p id={messageId} className="mt-1.5 flex items-start gap-1.5 text-sm text-danger-ink">
          <CircleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p> : hint ? <p id={messageId} className="mt-1.5 text-sm text-muted">
          {hint}
        </p> : null}
    </div>;
}