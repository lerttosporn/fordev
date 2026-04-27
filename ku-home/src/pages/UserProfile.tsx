import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, LogOut, Building2, CreditCard, Edit2, Save, X } from 'lucide-react';
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { localUrl, projectId } from "../utils/supabase/info";

interface ExtendedUser {
  name?: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
}

interface Booking {
  id: string;
  roomName?: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount?: number;
  guests?: object[];
  confirmationNumber?: string;
  isPaid?: boolean;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  confirmed: 'bg-green-100 text-green-800',
  'checked-in': 'bg-blue-100 text-blue-800',
  'checked-out': 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-pay': 'bg-orange-100 text-orange-800',
  'no-show': 'bg-yellow-100 text-yellow-800',
};

export function UserProfile() {
  const { user, signOut, accessToken, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'payment'>('info');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: '',
    department: '',
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
        setBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

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
      } as any);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(
        `${localUrl}/make-server-fb9ae70e/bookings/${bookingId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 bg-[#006b54]/5 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md mb-4 flex items-center justify-center">
                  <div className="w-full h-full bg-[#006b54] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'Guest User'}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-[#006b54] text-white text-xs font-bold rounded-full">
                  {(user as ExtendedUser).role === 'personnel' ? 'University Personnel' : 'Guest'}
                </span>
              </div>
              
              <div className="p-2">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === 'info'
                        ? 'bg-[#006b54]/10 text-[#006b54]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === 'bookings'
                        ? 'bg-[#006b54]/10 text-[#006b54]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    My Bookings
                    {bookings.length > 0 && (
                      <span className="ml-auto bg-[#006b54] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {bookings.length}
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
                </div>
              </section>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#006b54]" />
                  My Bookings
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
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                {booking.roomName || booking.roomType || 'Room Booking'}
                              </h4>
                              <Badge className={statusColors[booking.status.toLowerCase()] || statusColors.draft}>
                                {booking.status}
                              </Badge>
                            </div>
                            {booking.confirmationNumber && (
                              <p className="text-sm text-gray-500 mb-2">
                                Confirmation: <span className="font-mono font-medium">{booking.confirmationNumber}</span>
                              </p>
                            )}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
                              {booking.totalAmount && (
                                <>
                                  <span>•</span>
                                  <span className="font-bold text-[#006b54]">
                                    ฿{booking.totalAmount.toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                            {booking.guests && booking.guests.length > 0 && (
                              <p className="text-sm text-gray-500 mt-2">
                                Guests: {booking.guests.length}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {(booking.status === 'draft' || (booking.status === 'confirmed' && !booking.isPaid)) && (
                              <Button
                                onClick={() => handleCancelBooking(booking.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
