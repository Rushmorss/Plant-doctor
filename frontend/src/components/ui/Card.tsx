import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article';
  padding?: 'none' | 'list' | 'md';
}

const paddings = {
  none: '',
  list: 'p-2 md:p-3',
  md: 'p-5 md:p-6'
};

/** Bề mặt nội dung chuẩn. min-w-0 để không bao giờ đẩy grid/flex cha tràn ngang. */
export function Card({ as: Tag = 'section', padding = 'md', className = '', children, ...rest }: CardProps) {
  return (
    <Tag className={`min-w-0 rounded-3xl bg-surface shadow-soft ${paddings[padding]} ${className}`} {...rest}>
      {children}
    </Tag>);

}