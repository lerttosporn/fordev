// interface Size{
//     type:string;
//     area:number;
//     normalPrice: number;
//     staffPrice: number;
//     maximum:number;
// }
// RoomModel.tsx
// interface Room {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   imageInSide: string[];
//   isHighlight: boolean;
//   tag?: string;
//   size:string;
//   price:number;
//   extraBedPrice:number;
// }

// export default Room;

// แยก Type ของราคาออกมาเพื่อให้จัดการง่าย
export interface RoomRates {
  daily: {
    personnel: number;
    general: number;
  };
  group: {
    min5Rooms: number;
    min10Rooms: number;
  };
  monthly: number;
}

// แยก Type ของการเสริมเตียง
// export interface ExtraBedPolicy {
//   allowed: boolean;
//   maxBeds: number;
//   price: number;
// }

// Main Model
export interface RoomModel {
  id: string;
  name: string;
  description: string;
  sizeSqM: number;
  baseGuests: number;
  maxGuests: number;
  maxExtraBeds: number;
  extraBedPrice: number;
  rates: RoomRates;
  amenities: string[];
  image?: string; // รูปภาพ (เผื่อใช้)
  imageInSide: string[];
}

export default RoomModel;
