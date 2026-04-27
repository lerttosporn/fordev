import { Guest } from "../../../models/index";

export type Step = 1 | 2 | 3 | 4;
export type PaymentMethod = "qr" | "cash" | "department";

export const STEP_LABELS: Record<Step, string> = {
  1: "Booking Type",
  2: "Room & Dates",
  3: "Guest Details",
  4: "Payment",
};

export const emptyGuest = (): Guest => ({
  id: Math.random().toString(36).slice(2, 8),
  title: "Mr.",
  firstName: "",
  lastName: "",
  idNumber: "",
  email: "",
  phone: "",
  isKuMember: false,
});
