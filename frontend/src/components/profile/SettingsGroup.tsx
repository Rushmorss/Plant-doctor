import React from 'react';

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <section>
      <h2 className="px-1 text-sm font-semibold text-muted">{title}</h2>
      <ul className="mt-2 divide-y divide-line/70 rounded-3xl bg-surface px-2 shadow-soft">{children}</ul>
    </section>);

}