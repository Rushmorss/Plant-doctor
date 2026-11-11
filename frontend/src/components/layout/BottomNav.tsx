import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../data/navigation';

export function BottomNav() {
  const items = navItems.filter((item) => !item.desktopOnly);

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      
      <ul className="mx-auto grid h-16 w-full max-w-lg grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.primary) {
            return (
              <li key={item.to} className="flex min-w-0 justify-center">
                <NavLink
                  to={item.to}
                  aria-label="Quét cây trồng"
                  className="-mt-6 flex flex-col items-center gap-1">
                  
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lift ring-[5px] ring-surface transition-transform duration-150 ease-out active:scale-95">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-semibold text-primary">{item.label}</span>
                </NavLink>
              </li>);

          }
          return (
            <li key={item.to} className="min-w-0">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                `flex h-full min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[11px] font-medium transition-colors duration-150 ${
                isActive ? 'text-primary' : 'text-muted'}`

                }>
                
                {({ isActive }) =>
                <>
                    <Icon className="h-[22px] w-[22px] shrink-0" strokeWidth={isActive ? 2.4 : 1.9} aria-hidden="true" />
                    <span className="max-w-full truncate">{item.label}</span>
                  </>
                }
              </NavLink>
            </li>);

        })}
      </ul>
    </nav>);

}