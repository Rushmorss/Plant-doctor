import { BookOpenIcon, ChartColumnIcon, HeadsetIcon, HeartHandshakeIcon } from 'lucide-react';

export const howItWorks = [
{
  title: 'Chụp ảnh lá cây',
  description: 'Mở camera, đặt lá có dấu hiệu bất thường vào khung hướng dẫn và chụp. Hoặc chọn ảnh có sẵn.'
},
{
  title: 'AI phân tích trong vài giây',
  description: 'Mô hình thị giác máy tính tách vùng lá, tìm vết bệnh và so khớp với hơn 40 loại bệnh.'
},
{
  title: 'Nhận hướng dẫn xử lý',
  description: 'Xem tên bệnh, độ tin cậy, nguyên nhân và cách chăm sóc — viết bằng ngôn ngữ dễ hiểu.'
}];


export const visionPipeline = [
{ title: 'Tiền xử lý ảnh', description: 'Cân bằng sáng, khử nhiễu và kiểm tra độ nét.' },
{ title: 'Phân vùng lá cây', description: 'Tách lá khỏi nền đất, tay người và các vật thể khác.' },
{ title: 'Phát hiện vết bệnh', description: 'Khoanh vùng từng vết bệnh và đặc trưng màu sắc, hình dạng.' },
{ title: 'Phân loại & đánh giá', description: 'Dự đoán bệnh kèm độ tin cậy, minh bạch khi chưa chắc chắn.' }];


export const modelFacts = [
{ value: '52.000+', label: 'ảnh đồng ruộng huấn luyện' },
{ value: '40+', label: 'loại bệnh nhận diện' },
{ value: '< 3 giây', label: 'cho mỗi lần phân tích' }];


export const secondaryFeatures = [
{
  icon: BookOpenIcon,
  title: 'Thư viện bệnh cây trồng',
  description: 'Tra cứu triệu chứng, nguyên nhân và biện pháp phòng ngừa với hình ảnh thực tế.'
},
{
  icon: ChartColumnIcon,
  title: 'Lịch sử & thống kê',
  description: 'Theo dõi diễn biến bệnh trên vườn theo tuần, theo loại cây và theo khu vực.'
},
{
  icon: HeartHandshakeIcon,
  title: 'Hướng dẫn chăm sóc',
  description: 'Các bước xử lý cụ thể, ưu tiên biện pháp canh tác an toàn trước khi dùng thuốc.'
},
{
  icon: HeadsetIcon,
  title: 'Kết nối chuyên gia',
  description: 'Gửi kết quả cho kỹ sư bảo vệ thực vật khi AI chưa đủ chắc chắn hoặc bệnh nguy hiểm.'
}];