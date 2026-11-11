import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function LogoutSheet({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <BottomSheet open={open} onClose={onClose} title="Đăng xuất khỏi tài khoản?">
      <p className="text-[15px] leading-relaxed text-ink/80">
        Lịch sử nhận diện vẫn được lưu trên thiết bị này. Bạn có thể đăng nhập lại bất cứ lúc nào.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={onClose}>
          Ở lại
        </Button>
        <Button
          variant="danger"
          size="lg"
          onClick={() => {
            logout();
            toast.success('Đã đăng xuất');
            navigate('/login', { replace: true });
          }}>
          
          Đăng xuất
        </Button>
      </div>
    </BottomSheet>);

}