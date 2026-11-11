import React from 'react';
import { CloudOffIcon, RotateCcwIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Không tải được dữ liệu', message, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      role="alert"
      icon={CloudOffIcon}
      tone="danger"
      title={title}
      description={message}
      action={
      onRetry ?
      <Button variant="outline" onClick={onRetry}>
            <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
            Thử lại
          </Button> :
      undefined
      } />);


}