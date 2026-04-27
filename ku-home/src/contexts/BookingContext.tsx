import  { createContext, useContext, useState, ReactNode } from 'react';
import { RoomType } from "../models/index";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  nationality: string;
  isKuMember: boolean;
  kuIdImage?: string | File;
}

interface BillingEntity {
  id: string;
  name: string;
  address?: string;
  taxId?: string;
  amount: number;
}

interface BookingState {
  selectedRoom: RoomType | null;
  dateRange: DateRange;
  guests: { adults: number; children: number };
  guestDetails: GuestDetails;
  billingEntities: BillingEntity[];
  paymentMethod: 'qr' | 'internal' | 'bank' | 'cash';
  paymentProof?: string | File;
  internalTransferDetails?: {
    department: string;
    erpCode: string;
    contactPerson: string;
    staffId: string;
  };
  totalPrice: number;
}

interface BookingContextType extends BookingState {
  setBookingState: (state: Partial<BookingState>) => void;
  resetBooking: () => void;
  updateGuestDetails: (details: Partial<GuestDetails>) => void;
  addBillingEntity: (entity: BillingEntity) => void;
  removeBillingEntity: (id: string) => void;
  calculateTotal: () => number;
}

const defaultState: BookingState = {
  selectedRoom: null,
  dateRange: { from: new Date(), to: new Date(new Date().setDate(new Date().getDate() + 1)) },
  guests: { adults: 2, children: 0 },
  guestDetails: {
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    nationality: 'Thai',
    isKuMember: false,
  },
  billingEntities: [],
  paymentMethod: 'qr',
  totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(defaultState);

  const setBookingState = (updates: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateGuestDetails = (details: Partial<GuestDetails>) => {
    setState((prev) => ({
      ...prev,
      guestDetails: { ...prev.guestDetails, ...details },
    }));
  };

  const addBillingEntity = (entity: BillingEntity) => {
    setState((prev) => ({
      ...prev,
      billingEntities: [...prev.billingEntities, entity],
    }));
  };

  const removeBillingEntity = (id: string) => {
    setState((prev) => ({
      ...prev,
      billingEntities: prev.billingEntities.filter((e) => e.id !== id),
    }));
  };

  const resetBooking = () => {
    setState(defaultState);
  };

  const calculateTotal = () => {
    // Basic calculation logic placeholder
    // In a real app, this would use the room rates and date range
    return 3600; // Mock total
  };

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setBookingState,
        resetBooking,
        updateGuestDetails,
        addBillingEntity,
        removeBillingEntity,
        calculateTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
