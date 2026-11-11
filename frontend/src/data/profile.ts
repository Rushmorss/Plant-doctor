import { images } from './images';

export const userProfile = {
  fullName: 'Nguyễn Thị Lan',
  firstName: 'Lan',
  email: 'lan.nguyen@nongnghiep.vn',
  phone: '0912 345 678',
  role: 'Kỹ sư nông nghiệp',
  organization: 'HTX Rau sạch Đà Lạt',
  location: 'Đà Lạt, Lâm Đồng',
  memberSince: '03/2025',
  avatar: images.avatar,
  stats: { scans: 128, diseases: 74, crops: 6 }
};

export const userRoles = ['Nông dân', 'Sinh viên nông nghiệp', 'Kỹ sư nông nghiệp', 'Chuyên gia BVTV'];