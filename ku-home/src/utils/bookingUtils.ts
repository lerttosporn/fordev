// ─── Date Utilities ──────────────────────────────────────────────────────────

export const today = (): string => new Date().toISOString().split("T")[0];

export const getNextDay = (dateString: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

export const calcNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// ─── Price Utilities ──────────────────────────────────────────────────────────

export const BREAKFAST_PRICE = 150; // THB per person per night

export interface PriceBreakdown {
  roomRate: number;
  extraBedCost: number;
  breakfastCost: number;
  total: number;
}

export interface CalcPriceParams {
  ratePerNight: number;
  nights: number;
  extraBeds: number;
  extraBedPrice: number;
  guests: number;
  includeBreakfast: boolean;
}

export const calcPrice = ({
  ratePerNight,
  nights,
  extraBeds,
  extraBedPrice,
  guests,
  includeBreakfast,
}: CalcPriceParams): PriceBreakdown => {
  const n = Math.max(nights, 1);
  const roomRate = ratePerNight * n;
  const extraBedCost = extraBeds * extraBedPrice * n;
  const breakfastCost = includeBreakfast ? BREAKFAST_PRICE * guests * n : 0;
  return {
    roomRate,
    extraBedCost,
    breakfastCost,
    total: roomRate + extraBedCost + breakfastCost,
  };
};