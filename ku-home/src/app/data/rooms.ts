// Re-export RoomType as the canonical room type for this app
export type { RoomType as RoomModel, RoomRates } from "../../models/Room.ts";
import { RoomType } from "../../models/Room.ts";

export const ROOMS: RoomType[] = [
  {
    id: "superior",
    name: "Superior",
    description: "ห้องพักขนาดกะทัดรัด ตกแต่งทันสมัย เหมาะสำหรับการพักผ่อนระยะสั้นหรือผู้ที่ต้องการความเงียบสงบ",
    images: [
      "https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1080",
    ],
    sizeSqM: 30,
    baseGuests: 2,
    maxGuests: 2,
    maxExtraBeds: 0,
    extraBedPrice: 0,
    rates: {
      daily: { personnel: 800, general: 1000 },
      group: { min5Rooms: 750, min10Rooms: 750 },
      monthly: 15000,
    },
    amenities: ["Wi-Fi", "Air Conditioning", "Work Desk", "Shower"],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    description: "ห้องพักกว้างขวางขึ้น พร้อมพื้นที่ใช้สอยที่สะดวกสบาย รองรับการเสริมเตียงได้",
    images: [
      "https://images.unsplash.com/photo-1654064550497-34dfe63ef0a8?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1595161695996-f746349f4945?auto=format&fit=crop&q=80&w=1080",
    ],
    sizeSqM: 40,
    baseGuests: 2,
    maxGuests: 3,
    maxExtraBeds: 1,
    extraBedPrice: 500,
    rates: {
      daily: { personnel: 1000, general: 1200 },
      group: { min5Rooms: 900, min10Rooms: 750 },
      monthly: 18000,
    },
    amenities: ["Wi-Fi", "Air Conditioning", "Smart TV", "Refrigerator", "Sofa"],
  },
  {
    id: "suite",
    name: "Suite",
    description: "ห้องพักหรูขนาดใหญ่ที่สุด แยกสัดส่วนห้องนั่งเล่นและห้องนอน เหมาะสำหรับครอบครัว",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1609946863391-7f99968436b7?auto=format&fit=crop&q=80&w=1080",
    ],
    sizeSqM: 52,
    baseGuests: 2,
    maxGuests: 4,
    maxExtraBeds: 2,
    extraBedPrice: 500,
    rates: {
      daily: { personnel: 1500, general: 1800 },
      group: { min5Rooms: 1350, min10Rooms: 1350 },
      monthly: 27000,
    },
    amenities: ["Wi-Fi", "Separate Living Area", "Kitchenette", "Bathtub", "Balcony"],
  },
];