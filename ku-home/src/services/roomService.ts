import { Room, RoomType } from "../models/room";
import { v4 as uuidv4 } from 'uuid';

// Mock Data
let rooms: Room[] = [
  {
    id: "1",
    roomNumber: "S101",
    roomType: "Superior",
    floor: 1,
    status: "available",
    sizeSqM: 32,
    baseGuests: 2,
    maxGuests: 3,
    maxExtraBeds: 1,
    extraBedPrice: 500,
    rates: {
      daily: { personnel: 1200, general: 1500 },
      group: { min5Rooms: 1000, min10Rooms: 900 },
      monthly: 15000
    },
    amenities: ["TV", "Wifi", "Air Condition"],
    images: []
  },
  {
    id: "2",
    roomNumber: "D201",
    roomType: "Deluxe",
    floor: 2,
    status: "booked",
    sizeSqM: 45,
    baseGuests: 2,
    maxGuests: 4,
    maxExtraBeds: 2,
    extraBedPrice: 700,
    rates: {
      daily: { personnel: 1800, general: 2200 },
      group: { min5Rooms: 1600, min10Rooms: 1400 },
      monthly: 25000
    },
    amenities: ["TV", "Wifi", "Air Condition", "Mini Bar"],
    images: []
  }
];

let roomTypes: RoomType[] = [
  {
    id: "rt1",
    name: "Superior",
    description: "Standard room with essential amenities.",
    sizeSqM: 32,
    baseGuests: 2,
    maxGuests: 3,
    maxExtraBeds: 1,
    extraBedPrice: 500,
    rates: {
      daily: { personnel: 1200, general: 1500 },
      group: { min5Rooms: 1000, min10Rooms: 900 },
      monthly: 15000
    },
    amenities: ["TV", "Wifi", "Air Condition"],
    images: []
  },
  {
    id: "rt2",
    name: "Deluxe",
    description: "Spacious room with additional features.",
    sizeSqM: 45,
    baseGuests: 2,
    maxGuests: 4,
    maxExtraBeds: 2,
    extraBedPrice: 700,
    rates: {
      daily: { personnel: 1800, general: 2200 },
      group: { min5Rooms: 1600, min10Rooms: 1400 },
      monthly: 25000
    },
    amenities: ["TV", "Wifi", "Air Condition", "Mini Bar"],
    images: []
  },
  {
    id: "rt3",
    name: "Suite",
    description: "Luxury suite with premium services.",
    sizeSqM: 65,
    baseGuests: 2,
    maxGuests: 5,
    maxExtraBeds: 3,
    extraBedPrice: 1000,
    rates: {
      daily: { personnel: 3000, general: 3500 },
      group: { min5Rooms: 2800, min10Rooms: 2500 },
      monthly: 45000
    },
    amenities: ["TV", "Wifi", "Air Condition", "Mini Bar", "Bathtub"],
    images: []
  }
];

export const roomService = {
  // Room CRUD
  async getRooms(): Promise<Room[]> {
    return [...rooms];
  },

  async createRoom(room: Omit<Room, "id">): Promise<Room> {
    const newRoom = { ...room, id: uuidv4() };
    rooms.push(newRoom);
    return newRoom;
  },

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Room not found");
    rooms[index] = { ...rooms[index], ...updates };
    return rooms[index];
  },

  async deleteRoom(id: string): Promise<void> {
    rooms = rooms.filter(r => r.id !== id);
  },

  // RoomType CRUD
  async getRoomTypes(): Promise<RoomType[]> {
    return [...roomTypes];
  },

  async createRoomType(roomType: Omit<RoomType, "id">): Promise<RoomType> {
    const newType = { ...roomType, id: uuidv4() };
    roomTypes.push(newType);
    return newType;
  },

  async updateRoomType(id: string, updates: Partial<RoomType>): Promise<RoomType> {
    const index = roomTypes.findIndex(rt => rt.id === id);
    if (index === -1) throw new Error("Room Type not found");
    roomTypes[index] = { ...roomTypes[index], ...updates };
    return roomTypes[index];
  },

  async deleteRoomType(id: string): Promise<void> {
    roomTypes = roomTypes.filter(rt => rt.id !== id);
  }
};
