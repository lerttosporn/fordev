import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, LogOut, Building2, CreditCard, Edit2, Save, X, Hotel, Users, Coffee, BedDouble, FileText, ShieldCheck, Search, Info } from 'lucide-react';
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { localUrl } from "../utils/supabase/info";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface ExtendedUser {
  name?: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  idNumber?: string;
  nationality?: string;
  joinDate?: string;
}

interface Booking {
  id: string;
  roomName?: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount?: number;
  guests?: Array<{ firstName: string; lastName: string; type: 'adult' | 'child' }>;
  confirmationNumber?: string;
  isPaid?: boolean;
  extraBeds?: number;
  hasBreakfast?: boolean;
  adultsCount?: number;
  childrenCount?: number;
  roomCount?: number;
}

const statusColors: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'check-in': 'bg-blue-100 text-blue-700 border-blue-200',
  'check-out': 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  'no-pay': 'bg-orange-100 text-orange-700 border-orange-200',
  'no-show': 'bg-rose-100 text-rose-700 border-rose-200',
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    roomName: 'Deluxe Garden View',
    checkIn: '2026-05-10',
    checkOut: '2026-05-12',
    status: 'confirmed',
    totalAmount: 3500,
    confirmationNumber: 'KU77821X',
    isPaid: true,
    extraBeds: 1,
    hasBreakfast: true,
    adultsCount: 2,
    childrenCount: 1,
    roomCount: 1,
    guests: [
      { firstName: 'Somsak', lastName: 'P.', type: 'adult' },
      { firstName: 'Somying', lastName: 'P.', type: 'adult' },
      { firstName: 'Little', lastName: 'P.', type: 'child' },
    ]
  },
  {
    id: 'BK-002',
    roomName: 'Superior Twin Room',
    checkIn: '2026-04-28',
    checkOut: '2026-04-30',
    status: 'check-in',
    totalAmount: 5600,
    confirmationNumber: 'KU11234A',
    isPaid: true,
    roomCount: 2,
    adultsCount: 4,
    hasBreakfast: true,
    guests: [
      { firstName: 'John', lastName: 'Doe', type: 'adult' },
      { firstName: 'Jane', lastName: 'Doe', type: 'adult' },
      { firstName: 'Bob', lastName: 'Smith', type: 'adult' },
      { firstName: 'Alice', lastName: 'Smith', type: 'adult' },
    ]
  },
  {
    id: 'BK-003',
    roomName: 'Executive Suite',
    checkIn: '2026-06-15',
    checkOut: '2026-06-18',
    status: 'draft',
    totalAmount: 7500,
    adultsCount: 2,
    hasBreakfast: false,
    roomCount: 1,
    guests: [
      { firstName: 'Mark', lastName: 'Z.', type: 'adult' },
      { firstName: 'Priscilla', lastName: 'C.', type: 'adult' },
    ]
  }
];

export function UserProfile() {
  const { user, signOut, accessToken, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'bookings'>('info');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: '',
    department: '',
    idNumber: '',
    nationality: 'Thai',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Fetch bookings
  useEffect(() => {
    if (user && accessToken) {
      fetchBookings();
    }
  }, [user, accessToken]);

  // Initialize edit form
  useEffect(() => {
    if (user) {
      const extendedUser = user as ExtendedUser;
      setEditForm({
        name: extendedUser.name || '',
        phone: extendedUser.phone || '',
        department: extendedUser.department || '',
        idNumber: extendedUser.idNumber || '',
        nationality: extendedUser.nationality || 'Thai',
      });
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch(
        `${localUrl}/make-server-fb9ae70e/bookings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fetchedBookings = data.bookings || [];
        // Combine mock data with fetched data for mockup purposes
        setBookings([...MOCK_BOOKINGS, ...fetchedBookings]);
      } else {
        console.error('Failed to fetch bookings');
        // Keep mock bookings on error
        setBookings(MOCK_BOOKINGS);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const activeBookings = bookings.filter(b =>
    ['draft', 'confirmed', 'check-in'].includes(b.status.toLowerCase())
  );

  const pastBookings = bookings.filter(b =>
    !['draft', 'confirmed', 'check-in'].includes(b.status.toLowerCase())
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        department: editForm.department,
        idNumber: editForm.idNumber,
        nationality: editForm.nationality,
      } as any);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  // const handleCancelBooking = async (bookingId: string) => {
  //     if (!confirm('Are you sure you want to cancel this booking?')) {
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         `${localUrl}/make-server-fb9ae70e/bookings/${bookingId}/cancel`,
  //         {
  //           method: 'POST',
  //           headers: {
  //             'Authorization': `Bearer ${accessToken}`,
  //           },
  //         }
  //       );

  //       if (response.ok) {
  //         toast.success('Booking cancelled successfully');
  //         fetchBookings();
  //       } else {
  //         const data = await response.json();
  //         toast.error(data.error || 'Failed to cancel booking');
  //       }
  //     } catch (error) {
  //       console.error('Error cancelling booking:', error);
  //       toast.error('Failed to cancel booking');
  //     }
  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };

  if (loading || !user) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006b54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your account and view booking history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 bg-[#006b54]/5 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md mb-4 flex items-center justify-center relative">
                  <div className="w-full h-full bg-[#006b54] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'Guest User'}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="inline-block px-3 py-1 bg-[#006b54] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {(user as ExtendedUser).role === 'personnel' ? 'University Personnel' : 'Guest'}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xl font-black text-gray-900">{bookings.length}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Bookings</p>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <p className="text-xl font-black text-[#006b54]">3</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Years</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'info'
                      ? 'bg-[#006b54]/10 text-[#006b54]'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'bookings'
                      ? 'bg-[#006b54]/10 text-[#006b54]'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    Booking History
                    {activeBookings.length > 0 && (
                      <span className="ml-auto bg-[#006b54] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeBookings.length}
                      </span>
                    )}
                  </button>
                  <div className="my-2 border-t border-gray-100"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Tab */}
            {activeTab === 'info' && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#006b54]" />
                    Personal Information
                  </h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-[#006b54] text-[#006b54]"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-[#006b54] hover:bg-[#005a46]"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: user.name || '',
                            phone: (user as any).phone || '',
                            department: (user as any).department || '',
                            idNumber: (user as any).idNumber || '',
                            nationality: (user as any).nationality || 'Thai',
                          });
                        }}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                        {user.name || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</Label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+66 XX XXX XXXX"
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {(user as ExtendedUser).phone || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Department / Faculty</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        placeholder="e.g., Faculty of Engineering"
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200 flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        {(user as ExtendedUser).department || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nationality</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.nationality}
                        onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                        {(user as ExtendedUser).nationality || 'Thai'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Citizen ID / Passport</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.idNumber}
                        onChange={(e) => setEditForm({ ...editForm, idNumber: e.target.value })}
                        placeholder="ID or Passport Number"
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                        {(user as ExtendedUser).idNumber || '•••••••••••••'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase text-gray-500 mb-2">Membership Since</Label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {(user as ExtendedUser).joinDate || 'January 2024'}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#006b54]" />
                  Booking History
                </h3>

                {loadingBookings ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-[#006b54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No bookings yet</p>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-[#006b54] hover:bg-[#005a46]"
                    >
                      Make a Booking
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Active/Upcoming Bookings */}
                    {activeBookings.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#006b54] uppercase tracking-wider flex items-center">
                          <span className="w-2 h-2 bg-[#006b54] rounded-full mr-2"></span>
                          Active & Upcoming
                        </h4>
                        {activeBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="border border-gray-200 rounded-2xl p-6 hover:border-[#006b54] hover:shadow-lg hover:shadow-[#006b54]/5 transition-all group"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#006b54] transition-colors">
                                    {booking.roomName || booking.roomType || 'Room Booking'}
                                  </h4>
                                  <Badge className={`border ${statusColors[booking.status.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                                    {booking.status.replace('-', ' ')}
                                  </Badge>
                                </div>
                                {booking.confirmationNumber && (
                                  <p className="text-xs font-mono text-gray-400 mb-3 bg-gray-50 inline-block px-2 py-1 rounded">
                                    CONF: {booking.confirmationNumber}
                                  </p>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600 mt-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-[#006b54]" />
                                    <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Hotel className="w-4 h-4 mr-2 text-[#006b54]" />
                                    <span>{booking.roomCount || 1} Room{(booking.roomCount || 1) > 1 ? 's' : ''}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-[#006b54]" />
                                    <span>{booking.adultsCount || 0} Adults {(booking.childrenCount || 0) > 0 && `• ${booking.childrenCount} Children`}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCard className="w-4 h-4 mr-2 text-[#006b54]" />
                                    <span className="font-bold text-gray-900">
                                      ฿{booking.totalAmount?.toLocaleString()}
                                    </span>
                                  </div>
                                  {(booking.hasBreakfast || booking.extraBeds) && (
                                    <div className="sm:col-span-2 pt-2 mt-2 border-t border-gray-200 flex flex-wrap gap-3">
                                      {booking.hasBreakfast && (
                                        <span className="flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold">
                                          <Coffee className="w-3 h-3 mr-1" /> Breakfast Buffet
                                        </span>
                                      )}
                                      {booking.extraBeds && booking.extraBeds > 0 && (
                                        <span className="flex items-center text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-bold">
                                          <BedDouble className="w-3 h-3 mr-1" /> {booking.extraBeds} Extra Bed{(booking.extraBeds || 0) > 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                  <Button
                                    onClick={() => handleViewDetail(booking)}
                                    variant="outline"
                                    size="sm"
                                    className="text-[#006b54] border-[#006b54]/20 hover:bg-[#006b54]/5 rounded-xl flex items-center gap-2"
                                  >
                                    <Search className="w-4 h-4" />
                                    Booking Detail
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Past Bookings */}
                    {pastBookings.length > 0 && (
                      <div className="space-y-4 pt-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                          <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                          Completed & Others
                        </h4>
                        <div className="space-y-3 opacity-70 hover:opacity-100 transition-opacity">
                          {pastBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="border border-gray-100 bg-gray-50/50 rounded-xl p-4 flex items-center justify-between"
                            >
                              <div>
                                <h5 className="font-bold text-gray-700">{booking.roomName || 'Room Booking'}</h5>
                                <p className="text-xs text-gray-500">
                                  {new Date(booking.checkIn).toLocaleDateString()} • {booking.status}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => handleViewDetail(booking)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-[#006b54] p-2"
                                >
                                  <Search className="w-4 h-4" />
                                </Button>
                                <Badge className={`text-[10px] ${statusColors[booking.status.toLowerCase()] || 'bg-gray-100'}`}>
                                  {booking.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none">
          <DialogHeader className="bg-gradient-to-r from-[#006b54] to-[#008a6e] p-8 text-white">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Info className="w-6 h-6" />
              Booking Details
            </DialogTitle>
            <p className="text-white/70 text-sm font-medium mt-1">
              Reservation ID: {selectedBooking?.id} • {selectedBooking?.status.toUpperCase()}
            </p>
          </DialogHeader>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Room & Stay Section */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accommodation</h4>
                <div>
                  <p className="text-lg font-black text-gray-900">{selectedBooking?.roomName}</p>
                  <p className="text-sm text-gray-500 font-medium">1 Bedroom • {selectedBooking?.roomCount} Room(s)</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-[#006b54]">
                  <CreditCard className="w-4 h-4" />
                  <span>฿{selectedBooking?.totalAmount?.toLocaleString()} Total</span>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stay Period</h4>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" /> 
                    In: {selectedBooking?.checkIn ? new Date(selectedBooking.checkIn).toLocaleDateString() : '-'}
                  </p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-500" /> 
                    Out: {selectedBooking?.checkOut ? new Date(selectedBooking.checkOut).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Booker Information (User)</h4>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Name</p>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email</p>
                  <p className="text-sm font-bold text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Phone</p>
                  <p className="text-sm font-bold text-gray-900">{(user as ExtendedUser).phone || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Department</p>
                  <p className="text-sm font-bold text-gray-900">{(user as ExtendedUser).department || '-'}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 pb-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Guest Details</h4>
              <div className="space-y-3">
                {selectedBooking?.guests?.map((guest, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#006b54]/10 flex items-center justify-center text-[#006b54] font-black text-xs">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-bold text-gray-900">{guest.firstName} {guest.lastName}</p>
                    </div>
                    <Badge variant="outline" className={`capitalize text-[10px] font-bold ${guest.type === 'adult' ? 'text-blue-600 border-blue-100' : 'text-amber-600 border-amber-100'}`}>
                      {guest.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
