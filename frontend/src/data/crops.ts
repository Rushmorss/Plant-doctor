import type { Crop } from '../types/plant';
import { images } from './images';

export const crops: Crop[] = [
{ id: 'tomato', name: 'Cà chua', image: images.tomatoBlight },
{ id: 'rice', name: 'Lúa', image: images.riceBlast },
{ id: 'coffee', name: 'Cà phê', image: images.coffeeRust },
{ id: 'corn', name: 'Ngô', image: images.cornBlight },
{ id: 'cassava', name: 'Sắn', image: images.cassavaMosaic },
{ id: 'banana', name: 'Chuối', image: images.bananaSigatoka }];