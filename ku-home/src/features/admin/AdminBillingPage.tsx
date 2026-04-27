import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  ChevronLeft,
  Plus,
  Trash2,
  Printer,
  Calendar,
  BedDouble,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface FineItem {
  id: string;
  description: string;
  amount: number;
}

interface RoomCharge {
  roomType: string;
  roomNumber: string;
  nights: number;
  ratePerNight: number;
}

interface CheckoutBooking {
  id: string;
  confirmationNumber: string;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
  roomCharges: RoomCharge[];
  status: 'pending' | 'paid';
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_CHECKOUTS: CheckoutBooking[] = [
  {
    id: 'b-001',
    confirmationNumber: 'KU-8X2M9P',
    guestName: 'สมชาย ใจดี',
    phone: '081-234-5678',
    checkIn: '2025-03-20',
    checkOut: '2025-03-22',
    paymentMethod: 'Credit Card',
    status: 'pending',
    roomCharges: [
      {
        roomType: 'Superior',
        roomNumber: 'S105',
        nights: 2,
        ratePerNight: 1200,
      },
    ],
  },
  {
    id: 'b-002',
    confirmationNumber: 'KU-2N4R7T',
    guestName: 'นิดา พรอำไพ',
    phone: '089-876-5432',
    checkIn: '2025-03-18',
    checkOut: '2025-03-22',
    paymentMethod: 'QR PromptPay',
    status: 'pending',
    roomCharges: [
      {
        roomType: 'Deluxe',
        roomNumber: 'D201',
        nights: 4,
        ratePerNight: 1800,
      },
      {
        roomType: 'Deluxe',
        roomNumber: 'D202',
        nights: 4,
        ratePerNight: 1800,
      },
    ],
  },
  {
    id: 'b-003',
    confirmationNumber: 'KU-9A1B2C',
    guestName: 'John Smith',
    phone: '+1-555-0198',
    checkIn: '2025-03-21',
    checkOut: '2025-03-22',
    paymentMethod: 'Cash',
    status: 'pending',
    roomCharges: [
      {
        roomType: 'Suite',
        roomNumber: 'T301',
        nights: 1,
        ratePerNight: 3500,
      },
    ],
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export function AdminBillingPage() {
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<CheckoutBooking | null>(null);
  
  // Billing State
  const [fines, setFines] = useState<FineItem[]>([]);
  const [newFineDesc, setNewFineDesc] = useState('');
  const [newFineAmount, setNewFineAmount] = useState('');
  
  // New Room Charge State
  const [newRoomType, setNewRoomType] = useState('Superior');
  const [newRoomNum, setNewRoomNum] = useState('');
  const [newNights, setNewNights] = useState('1');
  const [newRate, setNewRate] = useState('1200');

  // UI State
  const [viewState, setViewState] = useState<'search' | 'billing' | 'receipt'>('search');

  // ─── Filtering ───
  const filteredBookings = useMemo(() => {
    return MOCK_CHECKOUTS.filter((b) => {
      const q = search.toLowerCase();
      return (
        b.confirmationNumber.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.roomCharges.some((rc) => rc.roomNumber.toLowerCase().includes(q))
      );
    });
  }, [search]);

  // ─── Calculated Totals ───
  const roomTotal = useMemo(() => {
    if (!selectedBooking) return 0;
    return selectedBooking.roomCharges.reduce((acc, rc) => acc + rc.nights * rc.ratePerNight, 0);
  }, [selectedBooking]);

  const finesTotal = useMemo(() => {
    return fines.reduce((acc, f) => acc + f.amount, 0);
  }, [fines]);

  const grandTotal = roomTotal + finesTotal;

  // ─── Actions ───
  const handleSelectBooking = (booking: CheckoutBooking) => {
    // Make a deep copy so we can edit it freely before generating the receipt
    setSelectedBooking(JSON.parse(JSON.stringify(booking)));
    setFines([]); 
    setViewState('billing');
  };

  const handleCreateCustomReceipt = () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = Math.random().toString(36).substring(7).toUpperCase();
    
    setSelectedBooking({
      id: newId,
      confirmationNumber: `MANUAL-${newId}`,
      guestName: '',
      phone: '',
      checkIn: today,
      checkOut: today,
      paymentMethod: 'Cash',
      status: 'pending',
      roomCharges: [],
    });
    setFines([]);
    setViewState('billing');
  };

  const handleAddFine = () => {
    if (!newFineDesc.trim()) {
      toast.error('กรุณาระบุรายละเอียดค่าปรับ');
      return;
    }
    const amt = parseFloat(newFineAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('กรุณาระบุจำนวนเงินค่าปรับที่ถูกต้อง');
      return;
    }

    setFines([
      ...fines,
      {
        id: Math.random().toString(36).substring(7),
        description: newFineDesc.trim(),
        amount: amt,
      },
    ]);
    setNewFineDesc('');
    setNewFineAmount('');
  };

  const handleRemoveFine = (id: string) => {
    setFines(fines.filter((f) => f.id !== id));
  };

  const handleAddRoomCharge = () => {
    if (!selectedBooking) return;
    
    const nightCount = parseInt(newNights);
    const rate = parseFloat(newRate);
    
    if (!newRoomNum.trim()) {
      toast.error('กรุณาระบุหมายเลขห้อง');
      return;
    }
    if (isNaN(nightCount) || nightCount <= 0 || isNaN(rate) || rate < 0) {
      toast.error('กรุณาระบุจำนวนคืนและราคาให้ถูกต้อง');
      return;
    }

    setSelectedBooking({
      ...selectedBooking,
      roomCharges: [
        ...selectedBooking.roomCharges,
        {
          roomType: newRoomType,
          roomNumber: newRoomNum.trim(),
          nights: nightCount,
          ratePerNight: rate,
        }
      ]
    });
    setNewRoomNum('');
  };

  const handleRemoveRoomCharge = (idx: number) => {
    if (!selectedBooking) return;
    const newCharges = [...selectedBooking.roomCharges];
    newCharges.splice(idx, 1);
    setSelectedBooking({ ...selectedBooking, roomCharges: newCharges });
  };

  const updateBookingField = (field: keyof CheckoutBooking, value: any) => {
    if (!selectedBooking) return;
    setSelectedBooking({ ...selectedBooking, [field]: value });
  };

  const handleGenerateReceipt = () => {
    if (!selectedBooking?.guestName.trim()) {
      toast.error('กรุณาระบุชื่อผู้เข้าพักก่อนสร้างใบเสร็จ');
      return;
    }
    setViewState('receipt');
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFlow = () => {
    setSelectedBooking(null);
    setFines([]);
    setViewState('search');
    setSearch('');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Search View
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewState === 'search') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="container mx-auto px-4 py-6">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Admin Portal
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Billing & Checkout
                </h1>
                <p className="text-gray-600 mt-1">
                  Select a booking to process checkout, or create a completely custom receipt.
                </p>
              </div>
              <Button onClick={handleCreateCustomReceipt} className="bg-[#006b54] hover:bg-[#005a46]">
                <Plus className="w-4 h-4 mr-2" /> Custom Receipt
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by Confirmation Number, Guest Name, or Room..."
                className="pl-12 h-14 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#006b54] hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onClick={() => handleSelectBooking(booking)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#006b54]/10 text-[#006b54] font-bold px-3 py-1 rounded-full text-sm">
                        {booking.confirmationNumber}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg">{booking.guestName}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.checkIn} — {booking.checkOut}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4" />
                        <span>
                          {booking.roomCharges.map(rc => rc.roomNumber).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-[#006b54] hover:bg-[#005a46] px-6">
                    Select & Bill
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Billing View
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewState === 'billing' && selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => setViewState('search')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Search
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Receipt Builder
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  Conf: 
                  <Input 
                    value={selectedBooking.confirmationNumber} 
                    onChange={(e) => updateBookingField('confirmationNumber', e.target.value)}
                    className="h-8 max-w-[200px] font-mono text-sm"
                  />
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Grand Total</p>
                <p className="text-3xl font-bold text-[#006b54]">
                  ฿{grandTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Details & Fines */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Guest Info */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <h2 className="font-bold text-gray-900">Guest Information (Editable)</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1.5">Name</label>
                    <Input 
                      value={selectedBooking.guestName}
                      onChange={(e) => updateBookingField('guestName', e.target.value)}
                      placeholder="Guest Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1.5">Phone</label>
                    <Input 
                      value={selectedBooking.phone}
                      onChange={(e) => updateBookingField('phone', e.target.value)}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1.5">Check-in Date</label>
                    <Input 
                      type="date"
                      value={selectedBooking.checkIn}
                      onChange={(e) => updateBookingField('checkIn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1.5">Check-out Date</label>
                    <Input 
                      type="date"
                      value={selectedBooking.checkOut}
                      onChange={(e) => updateBookingField('checkOut', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500 block mb-1.5">Payment Method</label>
                    <select
                      value={selectedBooking.paymentMethod}
                      onChange={(e) => updateBookingField('paymentMethod', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#006b54] outline-none bg-white"
                    >
                      <option>Credit Card</option>
                      <option>QR PromptPay</option>
                      <option>Cash</option>
                      <option>Department Transfer</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Room Charges */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-5 h-5 text-gray-500" />
                    <h2 className="font-bold text-gray-900">Charges</h2>
                  </div>
                  <span className="font-bold text-gray-700">฿{roomTotal.toLocaleString()}</span>
                </div>
                <div className="p-6">
                  {selectedBooking.roomCharges.length > 0 ? (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 font-semibold">Description</th>
                            <th className="pb-3 font-semibold text-center">Nights/Qty</th>
                            <th className="pb-3 font-semibold text-right">Rate</th>
                            <th className="pb-3 font-semibold text-right">Total</th>
                            <th className="pb-3 font-semibold text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedBooking.roomCharges.map((rc, idx) => (
                            <tr key={idx}>
                              <td className="py-4">
                                <p className="font-bold text-gray-900">{rc.roomNumber}</p>
                                <p className="text-sm text-gray-500">{rc.roomType}</p>
                              </td>
                              <td className="py-4 text-center text-gray-700">{rc.nights}</td>
                              <td className="py-4 text-right text-gray-700">฿{rc.ratePerNight.toLocaleString()}</td>
                              <td className="py-4 text-right font-semibold text-gray-900">
                                ฿{(rc.nights * rc.ratePerNight).toLocaleString()}
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => handleRemoveRoomCharge(idx)}
                                  className="text-gray-400 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 ml-auto" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic mb-6">No charges added yet.</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 border-t border-gray-100">
                    <div className="md:col-span-1">
                      <select
                        value={newRoomType}
                        onChange={(e) => setNewRoomType(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none"
                      >
                        <option>Superior</option>
                        <option>Deluxe</option>
                        <option>Suite</option>
                        <option>Extra Bed</option>
                        <option>Breakfast</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <Input
                        placeholder="Detail/Room"
                        value={newRoomNum}
                        onChange={(e) => setNewRoomNum(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Input
                        type="number"
                        placeholder="Nights/Qty"
                        value={newNights}
                        onChange={(e) => setNewNights(e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Input
                        type="number"
                        placeholder="Rate ฿"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Button onClick={handleAddRoomCharge} variant="outline" className="w-full">
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Housekeeping Fines */}
              <section className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <h2 className="font-bold text-rose-900">Damage & Fines</h2>
                  </div>
                  <span className="font-bold text-rose-700">฿{finesTotal.toLocaleString()}</span>
                </div>
                <div className="p-6 space-y-6">
                  {/* Fines List */}
                  {fines.length > 0 ? (
                    <div className="space-y-3">
                      {fines.map((fine) => (
                        <div key={fine.id} className="flex items-center justify-between p-3 bg-white border border-rose-200 rounded-lg">
                          <span className="text-gray-800 font-medium">{fine.description}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-rose-600">฿{fine.amount.toLocaleString()}</span>
                            <button
                              onClick={() => handleRemoveFine(fine.id)}
                              className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No fines added.</p>
                  )}

                  {/* Add Fine Form */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Input
                      placeholder="E.g. Broken Glass, Missing Towel"
                      value={newFineDesc}
                      onChange={(e) => setNewFineDesc(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Amount ฿"
                      value={newFineAmount}
                      onChange={(e) => setNewFineAmount(e.target.value)}
                      className="w-32"
                      min="0"
                    />
                    <Button
                      onClick={handleAddFine}
                      variant="outline"
                      className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column: Checkout Action */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-32 p-6">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Receipt Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Charges</span>
                    <span className="font-semibold text-gray-900">฿{roomTotal.toLocaleString()}</span>
                  </div>
                  {finesTotal > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Damages/Fines</span>
                      <span className="font-semibold">฿{finesTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="w-full h-px bg-gray-200" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-900">Grand Total</span>
                    <span className="font-bold text-[#006b54]">฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerateReceipt}
                    className="w-full bg-[#006b54] hover:bg-[#005a46] h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Preview & Print Receipt
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Receipt View (Printable)
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewState === 'receipt' && selectedBooking) {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    return (
      <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white">
        {/* Screen-only Controls */}
        <div className="container mx-auto px-4 max-w-3xl mb-6 print:hidden flex justify-between items-center">
          <Button variant="outline" onClick={() => setViewState('billing')} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Edit Details
          </Button>
          <div className="flex gap-3">
            <Button onClick={resetFlow} className="bg-gray-800 hover:bg-gray-900">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Finish
            </Button>
            <Button onClick={handlePrint} className="bg-[#006b54] hover:bg-[#005a46] gap-2">
              <Printer className="w-4 h-4" /> Print Receipt
            </Button>
          </div>
        </div>

        {/* The Receipt Sheet */}
        <div className="bg-white mx-auto max-w-3xl rounded-xl shadow-lg print:shadow-none print:max-w-none print:w-full overflow-hidden">
          {/* Header */}
          <div className="bg-[#006b54] p-8 text-white grid grid-cols-2">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">KU HOME</h1>
              <p className="text-green-100 text-sm">Kasetsart University, Bangkok</p>
              <p className="text-green-100 text-sm">Tax ID: 0994000159266</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">GUEST RECEIPT</h2>
              <p className="text-white/80 font-mono text-sm">Receipt #: REC-[{selectedBooking.confirmationNumber}]</p>
              <p className="text-white/80 text-sm">Date: {today}</p>
            </div>
          </div>

          <div className="p-8">
            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Billed To</p>
                <p className="font-bold text-gray-900 text-lg">{selectedBooking.guestName}</p>
                <p className="text-gray-600">{selectedBooking.phone}</p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Conf. Number</span>
                    <span className="font-bold font-mono text-gray-900">{selectedBooking.confirmationNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Payment via</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Check-in</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Check-out</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.checkOut}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left mb-8 text-sm">
              <thead>
                <tr className="border-b-2 border-gray-800 text-gray-800 uppercase tracking-wider">
                  <th className="py-3 font-bold">Item Description</th>
                  <th className="py-3 font-bold text-center">Qty / Nights</th>
                  <th className="py-3 font-bold text-right">Unit Price</th>
                  <th className="py-3 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Rooms */}
                {selectedBooking.roomCharges.map((rc, idx) => (
                  <tr key={`room-${idx}`}>
                    <td className="py-4">
                      <p className="font-bold text-gray-900">{rc.roomNumber}</p>
                      <p className="text-gray-500 text-xs">{rc.roomType}</p>
                    </td>
                    <td className="py-4 text-center">{rc.nights}</td>
                    <td className="py-4 text-right">฿{rc.ratePerNight.toLocaleString()}</td>
                    <td className="py-4 text-right font-bold text-gray-900">
                      ฿{(rc.nights * rc.ratePerNight).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Fines */}
                {fines.map((f, idx) => (
                  <tr key={`fine-${idx}`}>
                    <td className="py-4">
                      <p className="font-bold text-rose-800">Damage Fine</p>
                      <p className="text-rose-600/80 text-xs">{f.description}</p>
                    </td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-right">฿{f.amount.toLocaleString()}</td>
                    <td className="py-4 text-right font-bold text-rose-800">
                      ฿{f.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Box */}
            <div className="flex justify-end mb-12">
              <div className="w-72 bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>฿{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <span>VAT (7%) Included</span>
                  <span>฿{(grandTotal * 0.07).toFixed(2)}</span>
                </div>
                <div className="w-full h-px bg-gray-200 mb-3" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-[#006b54]">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-xs mt-12 pt-8 border-t border-gray-100">
              <p className="font-bold text-gray-700 mb-1">Thank you for staying with KU HOME</p>
              <p>For any inquiries regarding this receipt, please contact us at 02-579-0010</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
