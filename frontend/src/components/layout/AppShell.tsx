import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';

export function AppShell() {
  const { pathname } = useLocation();
  const immersive = pathname.startsWith('/app/scan');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full bg-canvas">
      <SideNav />
      {/* min-w-0 + w-full: vùng nội dung luôn co theo viewport, không bị phần tử con đẩy rộng ra.
           Padding dưới = chiều cao Bottom Navigation (64px) + phần nhô của nút Quét + safe area iPhone. */}
      <div
        className={`w-full min-w-0 md:pl-20 lg:pl-64 ${
        immersive ? '' : 'pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0'}`
        }>
        
        <Outlet />
      </div>
      {!immersive && <BottomNav />}
    </div>);

}