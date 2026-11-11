import type { SeedScanRecord } from '../types/plant';
import { images } from './images';

export const HISTORY_REFERENCE_DATE = '2026-11-05T23:59:59+07:00';

export const scanHistory: SeedScanRecord[] = [
{
  id: 'h1',
  cropId: 'tomato',
  cropName: 'Cà chua',
  status: 'disease',
  diseaseId: 'tomato-late-blight',
  label: 'Bệnh mốc sương',
  confidence: 94,
  image: images.tomatoBlight,
  scannedAt: '2026-11-05T08:42:00+07:00',
  location: 'Đà Lạt, Lâm Đồng',
  candidates: [
  { diseaseId: 'tomato-late-blight', label: 'Bệnh mốc sương', confidence: 94 },
  { diseaseId: null, label: 'Bệnh đốm vòng', confidence: 4 },
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 2 }]

},
{
  id: 'h2',
  cropId: 'rice',
  cropName: 'Lúa',
  status: 'disease',
  diseaseId: 'rice-blast',
  label: 'Bệnh đạo ôn',
  confidence: 89,
  image: images.riceBlast,
  scannedAt: '2026-11-04T16:10:00+07:00',
  location: 'Châu Phú, An Giang',
  candidates: [
  { diseaseId: 'rice-blast', label: 'Bệnh đạo ôn', confidence: 89 },
  { diseaseId: null, label: 'Bệnh đốm nâu', confidence: 8 },
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 3 }]

},
{
  id: 'h3',
  cropId: 'tomato',
  cropName: 'Cà chua',
  status: 'healthy',
  diseaseId: null,
  label: 'Không phát hiện bệnh',
  confidence: 96,
  image: images.cameraLeaf,
  scannedAt: '2026-11-04T09:25:00+07:00',
  location: 'Đơn Dương, Lâm Đồng',
  candidates: [
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 96 },
  { diseaseId: 'tomato-late-blight', label: 'Bệnh mốc sương', confidence: 3 },
  { diseaseId: null, label: 'Bệnh đốm vòng', confidence: 1 }]

},
{
  id: 'h4',
  cropId: 'corn',
  cropName: 'Ngô',
  status: 'uncertain',
  diseaseId: 'corn-leaf-blight',
  label: 'Bệnh đốm lá lớn',
  confidence: 58,
  image: images.cornBlight,
  scannedAt: '2026-11-03T14:05:00+07:00',
  location: 'Mai Sơn, Sơn La',
  candidates: [
  { diseaseId: 'corn-leaf-blight', label: 'Bệnh đốm lá lớn', confidence: 58 },
  { diseaseId: null, label: 'Bệnh đốm lá nhỏ', confidence: 27 },
  { diseaseId: null, label: 'Thiếu dinh dưỡng kali', confidence: 11 }]

},
{
  id: 'h5',
  cropId: 'coffee',
  cropName: 'Cà phê',
  status: 'disease',
  diseaseId: 'coffee-rust',
  label: 'Bệnh gỉ sắt',
  confidence: 91,
  image: images.coffeeRust,
  scannedAt: '2026-11-02T10:18:00+07:00',
  location: 'Cư M’gar, Đắk Lắk',
  candidates: [
  { diseaseId: 'coffee-rust', label: 'Bệnh gỉ sắt', confidence: 91 },
  { diseaseId: null, label: 'Bệnh nấm hồng', confidence: 6 },
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 3 }]

},
{
  id: 'h6',
  cropId: 'cassava',
  cropName: 'Sắn',
  status: 'disease',
  diseaseId: 'cassava-mosaic',
  label: 'Bệnh khảm lá sắn',
  confidence: 87,
  image: images.cassavaMosaic,
  scannedAt: '2026-11-01T07:50:00+07:00',
  location: 'Tân Châu, Tây Ninh',
  candidates: [
  { diseaseId: 'cassava-mosaic', label: 'Bệnh khảm lá sắn', confidence: 87 },
  { diseaseId: null, label: 'Nhện đỏ hại sắn', confidence: 9 },
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 4 }]

},
{
  id: 'h7',
  cropId: 'banana',
  cropName: 'Chuối',
  status: 'disease',
  diseaseId: 'banana-sigatoka',
  label: 'Bệnh đốm lá Sigatoka đen',
  confidence: 76,
  image: images.bananaSigatoka,
  scannedAt: '2026-10-30T15:32:00+07:00',
  location: 'Định Quán, Đồng Nai',
  candidates: [
  { diseaseId: 'banana-sigatoka', label: 'Bệnh đốm lá Sigatoka đen', confidence: 76 },
  { diseaseId: null, label: 'Bệnh đốm lá Sigatoka vàng', confidence: 18 },
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 6 }]

},
{
  id: 'h8',
  cropId: 'tomato',
  cropName: 'Cà chua',
  status: 'healthy',
  diseaseId: null,
  label: 'Không phát hiện bệnh',
  confidence: 93,
  image: images.cameraLeaf,
  scannedAt: '2026-10-29T08:05:00+07:00',
  location: 'Đà Lạt, Lâm Đồng',
  candidates: [
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 93 },
  { diseaseId: null, label: 'Bệnh đốm vòng', confidence: 5 },
  { diseaseId: 'tomato-late-blight', label: 'Bệnh mốc sương', confidence: 2 }]

},
{
  id: 'h9',
  cropId: 'rice',
  cropName: 'Lúa',
  status: 'disease',
  diseaseId: 'rice-blast',
  label: 'Bệnh đạo ôn',
  confidence: 82,
  image: images.riceBlast,
  scannedAt: '2026-10-27T17:20:00+07:00',
  location: 'Thốt Nốt, Cần Thơ',
  candidates: [
  { diseaseId: 'rice-blast', label: 'Bệnh đạo ôn', confidence: 82 },
  { diseaseId: null, label: 'Bệnh khô vằn', confidence: 12 },
  { diseaseId: null, label: 'Khỏe mạnh', confidence: 6 }]

},
{
  id: 'h10',
  cropId: 'tomato',
  cropName: 'Cà chua',
  status: 'uncertain',
  diseaseId: 'tomato-late-blight',
  label: 'Bệnh mốc sương',
  confidence: 61,
  image: images.tomatoBlight,
  scannedAt: '2026-10-25T09:12:00+07:00',
  location: 'Đà Lạt, Lâm Đồng',
  candidates: [
  { diseaseId: 'tomato-late-blight', label: 'Bệnh mốc sương', confidence: 61 },
  { diseaseId: null, label: 'Bệnh đốm vòng', confidence: 24 },
  { diseaseId: null, label: 'Cháy lá do nắng', confidence: 12 }]

}];