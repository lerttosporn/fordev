import { useState } from "react";
import { RoomType as RoomModel } from "../../models/Room.ts";
import { calcNights, getNextDay, today, calcPrice } from "../../../utils/bookingUtils.ts";

export interface BookingFormState {
  checkIn: string;
  checkOut: string;
  guests: number;
  extraBeds: number;
  includeBreakfast: boolean;
}

export interface PriceSummary {
  nights: number;
  generalTotal: number;
  personnelTotal: number;
}

export function useBookingForm(room: RoomModel | null, initialState?: Partial<BookingFormState>) {
  const todayStr = today();
  const tomorrow = getNextDay(todayStr);

  const [checkIn, setCheckInRaw] = useState(initialState?.checkIn || "");
  const [checkOut, setCheckOutRaw] = useState(initialState?.checkOut || "");
  const [guests, setGuests] = useState(initialState?.guests || 1);
  const [extraBeds, setExtraBeds] = useState(initialState?.extraBeds || 0);
  const [includeBreakfast, setIncludeBreakfast] = useState(initialState?.includeBreakfast || false);

  const nights = calcNights(checkIn, checkOut);

  const setCheckIn = (val: string) => {
    setCheckInRaw(val);
    if (checkOut && val >= checkOut) setCheckOutRaw("");
  };

  const setCheckOut = (val: string) => setCheckOutRaw(val);

  const minCheckOut = checkIn ? getNextDay(checkIn) : tomorrow;

  const priceSummary: PriceSummary = room
    ? {
        nights: Math.max(nights, 1),
        generalTotal: calcPrice({
          ratePerNight: room.rates.daily.general,
          nights: Math.max(nights, 1),
          extraBeds,
          extraBedPrice: room.extraBedPrice,
          guests,
          includeBreakfast,
        }).total,
        personnelTotal: calcPrice({
          ratePerNight: room.rates.daily.personnel,
          nights: Math.max(nights, 1),
          extraBeds,
          extraBedPrice: room.extraBedPrice,
          guests,
          includeBreakfast,
        }).total,
      }
    : { nights: 0, generalTotal: 0, personnelTotal: 0 };

  const isReadyToBook = !!(checkIn && checkOut && nights > 0);

  return {
    checkIn,
    checkOut,
    guests,
    extraBeds,
    includeBreakfast,
    nights,
    minCheckOut,
    todayStr,
    priceSummary,
    isReadyToBook,
    setCheckIn,
    setCheckOut,
    setGuests: (n: number) => setGuests(Math.min(Math.max(1, n), room?.maxGuests || 99)),
    setExtraBeds: (n: number) => setExtraBeds(Math.min(Math.max(0, n), room?.maxExtraBeds || 0)),
    setIncludeBreakfast,
  };
}