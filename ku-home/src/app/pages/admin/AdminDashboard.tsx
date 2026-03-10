import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BedDouble, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  DoorOpen,
  Users,
  Calendar,
  DollarSign,
  Bell
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import { ROOMS } from '../../data/rooms';

interface RoomStatus {
  id: string;
  roomNumber: string;
  roomType: string;
  status: 'available' | 'booked' | 'repair' | 'unavailable';
  currentBooking?: any;
}

interface Booking {
  id: string;
  roomType?: string;
  roomNumber?: string;
  guests?: any[];
  bookingType?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount?: number;
  confirmationNumber?: string;
}

export function AdminDashboard() {
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roomStats, setRoomStats] = useState({
    total: 0,
    available: 0,
    booked: 0,
    repair: 0,
    unavailable: 0,
  });
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [searchResults, setSearchResults] = useState<Booking[]>([]);

  // Check admin access
  useEffect(() => {
    if (!loading && (!user || ((user as any).role !== 'admin' && (user as any).role !== 'staff'))) {
      toast.error('Access denied: Admin privileges required');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Load initial data
  useEffect(() => {
    if (user && accessToken) {
      loadDashboardData();
    }
  }, [user, accessToken]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // Initialize mock rooms based on ROOMS data
      const mockRooms: RoomStatus[] = [];
      ROOMS.forEach((roomType) => {
        // Create 10 rooms of each type
        for (let i = 1; i <= 10; i++) {
          const roomNumber = `${roomType.id.charAt(0).toUpperCase()}${i.toString().padStart(3, '0')}`;
          mockRooms.push({
            id: `${roomType.id}-${i}`,
            roomNumber,
            roomType: roomType.name,
            status: i <= 6 ? 'available' : i <= 8 ? 'booked' : i === 9 ? 'repair' : 'unavailable',
          });
        }
      });

      setRooms(mockRooms);

      // Calculate stats
      const stats = {
        total: mockRooms.length,
        available: mockRooms.filter(r => r.status === 'available').length,
        booked: mockRooms.filter(r => r.status === 'booked').length,
        repair: mockRooms.filter(r => r.status === 'repair').length,
        unavailable: mockRooms.filter(r => r.status === 'unavailable').length,
      };
      setRoomStats(stats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb9ae70e/admin/bookings/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.bookings || []);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      console.error('Error searching bookings:', error);
      toast.error('Search error');
    }
  };

  const toggleRoomStatus = async (roomId: string, newStatus: 'available' | 'unavailable') => {
    const updatedRooms = rooms.map(room => 
      room.id === roomId ? { ...room, status: newStatus } : room
    );
    setRooms(updatedRooms);

    // Calculate new stats
    const stats = {
      total: updatedRooms.length,
      available: updatedRooms.filter(r => r.status === 'available').length,
      booked: updatedRooms.filter(r => r.status === 'booked').length,
      repair: updatedRooms.filter(r => r.status === 'repair').length,
      unavailable: updatedRooms.filter(r => r.status === 'unavailable').length,
    };
    setRoomStats(stats);

    toast.success(`Room ${newStatus === 'available' ? 'opened' : 'closed'} successfully`);
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb9ae70e/admin/bookings/${bookingId}/checkin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Guest checked in successfully');
        setBookingModalOpen(false);
        loadDashboardData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Check-in failed');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Check-in error');
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb9ae70e/admin/bookings/${bookingId}/checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Guest checked out successfully');
        setBookingModalOpen(false);
        loadDashboardData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Check-out failed');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error('Check-out error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'booked':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'repair':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'unavailable':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'booked':
        return <DoorOpen className="w-4 h-4" />;
      case 'repair':
        return <Wrench className="w-4 h-4" />;
      case 'unavailable':
        return <XCircle className="w-4 h-4" />;
      default:
        return <BedDouble className="w-4 h-4" />;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006b54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Front Desk Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage rooms and bookings</p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or booking ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="bg-[#006b54] hover:bg-[#005a46]">
                Search
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{roomStats.total}</p>
                </div>
                <BedDouble className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase">Available</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{roomStats.available}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase">Booked</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{roomStats.booked}</p>
                </div>
                <DoorOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-orange-600 uppercase">Repair</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{roomStats.repair}</p>
                </div>
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Closed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{roomStats.unavailable}</p>
                </div>
                <XCircle className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Search Results ({searchResults.length})</h2>
            <div className="space-y-3">
              {searchResults.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setBookingModalOpen(true);
                  }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{booking.guests?.[0]?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-500">
                      {booking.confirmationNumber || booking.id} • {booking.roomType || 'Room'}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Room Status Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Room Status Grid</h2>

          {/* Group rooms by type */}
          {ROOMS.map((roomType) => {
            const typeRooms = rooms.filter(r => r.roomType === roomType.name);
            
            return (
              <div key={roomType.id} className="mb-8 last:mb-0">
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-[#006b54]" />
                  {roomType.name} Rooms
                  <span className="text-sm font-normal text-gray-500">({typeRooms.length} rooms)</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {typeRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border-2 rounded-lg p-3 transition-all hover:shadow-md ${getStatusColor(room.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{room.roomNumber}</span>
                        {getStatusIcon(room.status)}
                      </div>
                      <p className="text-xs font-medium capitalize mb-2">{room.status}</p>
                      
                      {(room.status === 'available' || room.status === 'unavailable') && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
                          <span className="text-xs">Open</span>
                          <Switch
                            checked={room.status === 'available'}
                            onCheckedChange={(checked) => 
                              toggleRoomStatus(room.id, checked ? 'available' : 'unavailable')
                            }
                            className="scale-75"
                          />
                        </div>
                      )}

                      {room.status === 'booked' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 text-xs h-7"
                          onClick={() => {
                            setSelectedBooking({
                              id: `mock-${room.id}`,
                              roomNumber: room.roomNumber,
                              roomType: room.roomType,
                              guests: [{ name: 'Sample Guest' }],
                              bookingType: 'individual',
                              checkIn: new Date().toISOString(),
                              checkOut: new Date(Date.now() + 86400000 * 3).toISOString(),
                              status: 'confirmed',
                            });
                            setBookingModalOpen(true);
                          }}
                        >
                          Details
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Guest Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#006b54]" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Guest Name</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guests?.[0]?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Booking Type</p>
                    <Badge className="mt-1">{selectedBooking.bookingType || 'Individual'}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Room</p>
                    <p className="font-medium text-gray-900">{selectedBooking.roomNumber || selectedBooking.roomType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                    <Badge className={`mt-1 ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#006b54]" />
                  Booking Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Check-in</p>
                    <p className="font-medium text-gray-900">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Check-out</p>
                    <p className="font-medium text-gray-900">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                  </div>
                  {selectedBooking.totalAmount && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Total Amount</p>
                      <p className="font-bold text-[#006b54] text-lg">฿{selectedBooking.totalAmount.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedBooking.confirmationNumber && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Confirmation #</p>
                      <p className="font-mono font-medium text-gray-900">{selectedBooking.confirmationNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'draft') && (
                  <Button
                    onClick={() => handleCheckIn(selectedBooking.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Check-in Guest
                  </Button>
                )}
                {selectedBooking.status === 'checked-in' && (
                  <Button
                    onClick={() => handleCheckOut(selectedBooking.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <DoorOpen className="w-4 h-4 mr-2" />
                    Check-out Guest
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setBookingModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
