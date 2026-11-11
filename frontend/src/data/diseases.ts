import type { Disease } from '../types/plant';
import { images } from './images';

export const diseases: Disease[] = [
{
  id: 'tomato-late-blight',
  cropId: 'tomato',
  name: 'Bệnh mốc sương',
  scientificName: 'Phytophthora infestans',
  pathogenType: 'Nấm noãn',
  image: images.tomatoBlight,
  severity: 'high',
  summary:
  'Bệnh lây lan rất nhanh khi trời ẩm và mát, có thể làm cháy rụi cả ruộng cà chua chỉ trong 7–10 ngày.',
  symptoms: [
  'Vết bệnh xanh xám, úng nước ở mép lá, sau chuyển nâu đen',
  'Mặt dưới lá có lớp mốc trắng mịn khi trời ẩm',
  'Thân và cuống lá có vết nâu đen kéo dài',
  'Quả xuất hiện vết nâu cứng, lan nhanh khắp quả'],

  causes: [
  'Độ ẩm không khí trên 90%, sương mù kéo dài',
  'Nhiệt độ mát trong khoảng 15–22°C',
  'Mầm bệnh lây qua gió, nước mưa và dụng cụ canh tác',
  'Trồng quá dày, tán lá thiếu thông thoáng'],

  prevention: [
  'Chọn giống kháng bệnh, cây giống sạch bệnh',
  'Trồng mật độ hợp lý, tỉa bỏ lá già ở gốc',
  'Tưới vào gốc, tránh tưới lên lá vào chiều tối',
  'Luân canh với cây khác họ cà trong 2–3 năm'],

  care: [
  'Cắt bỏ và tiêu hủy lá, quả bệnh ngay khi phát hiện',
  'Phun thuốc gốc đồng hoặc hoạt chất được khuyến cáo, đúng liều trên nhãn',
  'Kiểm tra ruộng 2–3 ngày/lần khi thời tiết ẩm']

},
{
  id: 'rice-blast',
  cropId: 'rice',
  name: 'Bệnh đạo ôn',
  scientificName: 'Pyricularia oryzae',
  pathogenType: 'Nấm',
  image: images.riceBlast,
  severity: 'high',
  summary:
  'Bệnh nấm nguy hiểm nhất trên lúa, gây cháy lá, thối cổ bông và có thể làm mất trắng năng suất.',
  symptoms: [
  'Vết bệnh hình thoi, tâm xám trắng, viền nâu đỏ trên lá',
  'Nhiều vết liên kết làm lá cháy khô từng mảng',
  'Cổ bông thâm đen, bông lép trắng hoặc gãy gục',
  'Đốt thân có vết nâu đen, dễ gãy'],

  causes: [
  'Nấm lây lan qua bào tử phát tán trong gió',
  'Thời tiết âm u, nhiều sương, nhiệt độ 20–28°C',
  'Bón thừa đạm, gieo sạ quá dày',
  'Giống nhiễm, hạt giống mang mầm bệnh'],

  prevention: [
  'Sử dụng giống kháng đạo ôn phù hợp với vùng',
  'Gieo sạ mật độ vừa phải, bón cân đối N-P-K',
  'Xử lý hạt giống trước khi gieo',
  'Vệ sinh đồng ruộng, tiêu hủy rơm rạ nhiễm bệnh'],

  care: [
  'Ngưng bón đạm khi phát hiện vết bệnh',
  'Giữ mực nước ruộng ổn định 3–5 cm',
  'Phun thuốc đặc trị theo khuyến cáo của cán bộ BVTV địa phương']

},
{
  id: 'coffee-rust',
  cropId: 'coffee',
  name: 'Bệnh gỉ sắt',
  scientificName: 'Hemileia vastatrix',
  pathogenType: 'Nấm',
  image: images.coffeeRust,
  severity: 'medium',
  summary:
  'Bệnh phổ biến trên cà phê, làm rụng lá sớm, cây suy kiệt và giảm năng suất của vụ kế tiếp.',
  symptoms: [
  'Mặt dưới lá có đốm vàng nhạt, sau chuyển vàng cam',
  'Lớp bột màu cam (bào tử) phủ trên vết bệnh',
  'Mặt trên lá xuất hiện đốm vàng tương ứng',
  'Lá bệnh nặng khô và rụng hàng loạt'],

  causes: [
  'Bào tử nấm phát tán qua gió và nước mưa',
  'Mùa mưa, độ ẩm cao kéo dài',
  'Vườn rậm rạp, thiếu cây che bóng hợp lý',
  'Cây mang nhiều quả, thiếu dinh dưỡng'],

  prevention: [
  'Trồng giống cà phê kháng gỉ sắt (TR4, TR9…)',
  'Tỉa cành tạo tán thông thoáng sau thu hoạch',
  'Bón phân cân đối, bổ sung hữu cơ và kali',
  'Thăm vườn định kỳ vào đầu mùa mưa'],

  care: [
  'Thu gom lá bệnh rụng dưới gốc và tiêu hủy',
  'Phun thuốc gốc đồng hoặc hoạt chất khuyến cáo khi tỷ lệ bệnh tăng',
  'Tưới và bón phục hồi cho cây bị rụng nhiều lá']

},
{
  id: 'corn-leaf-blight',
  cropId: 'corn',
  name: 'Bệnh đốm lá lớn',
  scientificName: 'Exserohilum turcicum',
  pathogenType: 'Nấm',
  image: images.cornBlight,
  severity: 'medium',
  summary:
  'Bệnh tạo các vết cháy dài trên lá ngô, làm giảm diện tích quang hợp và năng suất hạt.',
  symptoms: [
  'Vết bệnh dài 2,5–15 cm, hình điếu xì gà, xám xanh đến nâu',
  'Vết bệnh xuất hiện từ lá dưới rồi lan dần lên trên',
  'Khi trời ẩm, vết bệnh có lớp mốc xám đen',
  'Lá cháy khô sớm khi bệnh nặng'],

  causes: [
  'Nấm tồn tại trên tàn dư cây vụ trước',
  'Nhiệt độ 18–27°C, sương mù, ẩm độ cao',
  'Trồng ngô liên tục nhiều vụ trên cùng ruộng',
  'Sử dụng giống mẫn cảm'],

  prevention: [
  'Luân canh ngô với cây họ đậu',
  'Cày vùi hoặc tiêu hủy tàn dư sau thu hoạch',
  'Chọn giống có khả năng kháng bệnh',
  'Bón phân cân đối, không bón thừa đạm'],

  care: [
  'Cắt bỏ lá gốc bị bệnh nặng',
  'Phun thuốc trừ nấm khi bệnh xuất hiện trước giai đoạn trỗ cờ',
  'Theo dõi sát khi thời tiết mát và ẩm']

},
{
  id: 'cassava-mosaic',
  cropId: 'cassava',
  name: 'Bệnh khảm lá sắn',
  scientificName: 'Sri Lankan cassava mosaic virus',
  pathogenType: 'Virus',
  image: images.cassavaMosaic,
  severity: 'high',
  summary:
  'Bệnh virus lây qua bọ phấn trắng và hom giống, làm lá biến dạng, củ nhỏ và rất khó phục hồi.',
  symptoms: [
  'Lá khảm loang lổ vàng xanh xen kẽ',
  'Lá biến dạng, nhăn nheo, xoăn mép',
  'Cây còi cọc, lóng thân ngắn lại',
  'Củ nhỏ, ít củ, năng suất giảm mạnh'],

  causes: [
  'Virus lây truyền qua bọ phấn trắng',
  'Sử dụng hom giống lấy từ cây bệnh',
  'Mật độ bọ phấn cao trong mùa khô',
  'Không tiêu hủy cây bệnh kịp thời'],

  prevention: [
  'Dùng hom giống sạch bệnh từ nguồn được chứng nhận',
  'Trồng giống kháng hoặc chống chịu bệnh',
  'Quản lý bọ phấn trắng ngay từ đầu vụ',
  'Không vận chuyển hom giống từ vùng có dịch'],

  care: [
  'Nhổ bỏ và tiêu hủy cây bệnh ngay khi phát hiện',
  'Không có thuốc chữa virus — tập trung ngăn chặn lây lan',
  'Báo cho cán bộ khuyến nông nếu bệnh lan rộng']

},
{
  id: 'banana-sigatoka',
  cropId: 'banana',
  name: 'Bệnh đốm lá Sigatoka đen',
  scientificName: 'Pseudocercospora fijiensis',
  pathogenType: 'Nấm',
  image: images.bananaSigatoka,
  severity: 'medium',
  summary: 'Bệnh nấm hại lá chuối, làm lá khô sớm, buồng nhỏ và quả chín không đều.',
  symptoms: [
  'Sọc nhỏ màu nâu đỏ chạy song song gân lá',
  'Sọc lớn dần thành đốm đen có viền vàng',
  'Tâm vết bệnh khô xám, lá cháy từng mảng',
  'Cây mất nhiều lá trước khi trổ buồng'],

  causes: [
  'Bào tử nấm lây lan qua gió và mưa',
  'Mưa nhiều, ẩm độ cao, nhiệt độ 25–28°C',
  'Vườn trồng dày, thoát nước kém',
  'Không cắt tỉa lá già, lá bệnh'],

  prevention: [
  'Trồng mật độ hợp lý, đảm bảo thoát nước tốt',
  'Cắt tỉa lá bệnh, lá già định kỳ',
  'Bón phân cân đối, tăng cường kali',
  'Chọn giống có khả năng chống chịu'],

  care: [
  'Cắt và tiêu hủy phần lá bị bệnh',
  'Phun thuốc trừ nấm luân phiên hoạt chất theo khuyến cáo',
  'Duy trì tối thiểu 8–10 lá xanh khi trổ buồng']

}];


export const healthyCareTips: string[] = [
'Tiếp tục theo dõi cây 1–2 lần mỗi tuần, đặc biệt sau mưa',
'Tưới vào gốc, tránh làm ướt lá vào chiều tối',
'Bón phân cân đối theo từng giai đoạn sinh trưởng',
'Giữ vườn thông thoáng, tỉa bỏ lá già ở gốc'];