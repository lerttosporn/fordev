// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type PaymentMethod = 'qr' | 'cash' | 'department';

export type PaymentStatus = 'unpaid' | 'paid' | 'partial' | 'refunded';

export type ReceiptType = 'individual' | 'department';

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  bookingId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  proofUrl?: string;        // สลิปโอนเงิน
  departmentRef?: string;   // เลข ERP
  receivedBy?: string;      // staff id ที่รับเงิน
  notes?: string;
}

// ─── Receipt ──────────────────────────────────────────────────────────────────

export interface ReceiptItem {
  label: string;
  amount: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;    // เช่น 202601-0001
  bookingId: string;
  type: ReceiptType;

  // ผู้รับใบเสร็จ
  recipientName: string;
  recipientAddress?: string;
  recipientTaxId?: string;

  items: ReceiptItem[];
  totalAmount: number;
  issuedAt: string;
  issuedBy?: string;        // staff id
}

// ─── Discount Code ────────────────────────────────────────────────────────────

export interface DiscountCode {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdBy: string;         // admin id
  usageCount?: number;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateReceiptPayload {
  bookingId: string;
  type: ReceiptType;
  recipientName: string;
  recipientAddress?: string;
  recipientTaxId?: string;
}

export interface GenerateDiscountCodePayload {
  discountPercent?: number;
  discountAmount?: number;
  validFrom: string;
  validUntil: string;
}

export interface VerifyDiscountCodeResponse {
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  message?: string;
}