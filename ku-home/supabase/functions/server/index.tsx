import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Create Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fb9ae70e/health", (c) => {
  return c.json({ status: "ok" });
});

// ====== AUTHENTICATION ROUTES ======

// Sign up endpoint
app.post("/make-server-fb9ae70e/auth/signup", async (c) => {
  try {
    const { email, password, name, role = 'customer' } = await c.req.json();

    const { data, error } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true, // Auto-confirm since email server is not configured
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });

    return c.json({ user: data.user });
  } catch (error: any) {
    console.log(`Server error during signup: ${error.message}`);
    return c.json({ error: "Server error during signup" }, 500);
  }
});

// Get user profile
app.get("/make-server-fb9ae70e/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
    if (error || !user) {
      console.log(`Error getting user profile: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ user: profile || user });
  } catch (error: any) {
    console.log(`Server error getting user profile: ${error.message}`);
    return c.json({ error: "Server error" }, 500);
  }
});

// Update user profile
app.put("/make-server-fb9ae70e/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`);
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id,
      email: user.email,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    return c.json({ user: updatedProfile });
  } catch (error: any) {
    console.log(`Server error updating user profile: ${error.message}`);
    return c.json({ error: "Server error" }, 500);
  }
});

// ====== BOOKING ROUTES ======

// Create booking
app.post("/make-server-fb9ae70e/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingData = await c.req.json();
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const booking = {
      id: bookingId,
      userId: user.id,
      ...bookingData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, booking);
    
    // Add to user's bookings list
    const userBookings = await kv.get(`user_bookings:${user.id}`) || [];
    userBookings.push(bookingId);
    await kv.set(`user_bookings:${user.id}`, userBookings);

    return c.json({ booking });
  } catch (error: any) {
    console.log(`Server error creating booking: ${error.message}`);
    return c.json({ error: "Server error creating booking" }, 500);
  }
});

// Get user's bookings
app.get("/make-server-fb9ae70e/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingIds = await kv.get(`user_bookings:${user.id}`) || [];
    const bookings = await kv.mget(bookingIds.map((id: string) => `booking:${id}`));
    
    // Sort by creation date, newest first
    const sortedBookings = bookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ bookings: sortedBookings });
  } catch (error: any) {
    console.log(`Server error getting bookings: ${error.message}`);
    return c.json({ error: "Server error getting bookings" }, 500);
  }
});

// Get single booking
app.get("/make-server-fb9ae70e/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // Verify the booking belongs to the user
    if (booking.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    return c.json({ booking });
  } catch (error: any) {
    console.log(`Server error getting booking: ${error.message}`);
    return c.json({ error: "Server error getting booking" }, 500);
  }
});

// Update booking
app.put("/make-server-fb9ae70e/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    if (booking.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const updates = await c.req.json();
    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, updatedBooking);
    return c.json({ booking: updatedBooking });
  } catch (error: any) {
    console.log(`Server error updating booking: ${error.message}`);
    return c.json({ error: "Server error updating booking" }, 500);
  }
});

// Cancel booking (only for unpaid reservations)
app.post("/make-server-fb9ae70e/bookings/:id/cancel", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    if (booking.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Only allow cancellation for unpaid bookings
    if (booking.status !== 'draft' && booking.status !== 'confirmed' && !booking.isPaid) {
      return c.json({ error: "Cannot cancel paid bookings" }, 400);
    }

    const cancelledBooking = {
      ...booking,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, cancelledBooking);
    return c.json({ booking: cancelledBooking });
  } catch (error: any) {
    console.log(`Server error cancelling booking: ${error.message}`);
    return c.json({ error: "Server error cancelling booking" }, 500);
  }
});

// Confirm booking (auto-confirmation)
app.post("/make-server-fb9ae70e/bookings/:id/confirm", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    if (booking.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const confirmedBooking = {
      ...booking,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmationNumber: `KU-${Date.now().toString(36).toUpperCase()}`,
    };

    await kv.set(`booking:${bookingId}`, confirmedBooking);
    
    // In a real app, this would send an email confirmation
    console.log(`Booking confirmed: ${bookingId}, Confirmation: ${confirmedBooking.confirmationNumber}`);

    return c.json({ booking: confirmedBooking });
  } catch (error: any) {
    console.log(`Server error confirming booking: ${error.message}`);
    return c.json({ error: "Server error confirming booking" }, 500);
  }
});

// ====== ROOM ROUTES ======

// Get all rooms
app.get("/make-server-fb9ae70e/rooms", async (c) => {
  try {
    const rooms = await kv.getByPrefix('room:');
    return c.json({ rooms: rooms || [] });
  } catch (error: any) {
    console.log(`Server error getting rooms: ${error.message}`);
    return c.json({ error: "Server error getting rooms" }, 500);
  }
});

// Update room status (admin only)
app.put("/make-server-fb9ae70e/rooms/:id/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user is admin
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const roomId = c.req.param('id');
    const { status, reason } = await c.req.json();

    const room = await kv.get(`room:${roomId}`);
    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }

    const updatedRoom = {
      ...room,
      status,
      statusReason: reason,
      statusUpdatedAt: new Date().toISOString(),
      statusUpdatedBy: user.id,
    };

    await kv.set(`room:${roomId}`, updatedRoom);
    return c.json({ room: updatedRoom });
  } catch (error: any) {
    console.log(`Server error updating room status: ${error.message}`);
    return c.json({ error: "Server error updating room status" }, 500);
  }
});

// Get room statistics (admin only)
app.get("/make-server-fb9ae70e/admin/room-stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const rooms = await kv.getByPrefix('room:') || [];
    
    const stats = {
      total: rooms.length,
      available: rooms.filter((r: any) => r.status === 'available').length,
      booked: rooms.filter((r: any) => r.status === 'booked').length,
      repair: rooms.filter((r: any) => r.status === 'repair').length,
      unavailable: rooms.filter((r: any) => r.status === 'unavailable').length,
    };

    return c.json({ stats });
  } catch (error: any) {
    console.log(`Server error getting room stats: ${error.message}`);
    return c.json({ error: "Server error getting room stats" }, 500);
  }
});

// Search bookings (admin only)
app.get("/make-server-fb9ae70e/admin/bookings/search", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const query = c.req.query('q') || '';
    const allBookings = await kv.getByPrefix('booking:') || [];
    
    // Search by booking ID or guest name
    const results = allBookings.filter((booking: any) => {
      const matchesId = booking.id.toLowerCase().includes(query.toLowerCase());
      const matchesGuest = booking.guests?.some((guest: any) => 
        guest.name?.toLowerCase().includes(query.toLowerCase())
      );
      const matchesConfirmation = booking.confirmationNumber?.toLowerCase().includes(query.toLowerCase());
      return matchesId || matchesGuest || matchesConfirmation;
    });

    return c.json({ bookings: results });
  } catch (error: any) {
    console.log(`Server error searching bookings: ${error.message}`);
    return c.json({ error: "Server error searching bookings" }, 500);
  }
});

// Get all bookings (admin only)
app.get("/make-server-fb9ae70e/admin/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const bookings = await kv.getByPrefix('booking:') || [];
    
    // Sort by creation date, newest first
    const sortedBookings = bookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ bookings: sortedBookings });
  } catch (error: any) {
    console.log(`Server error getting all bookings: ${error.message}`);
    return c.json({ error: "Server error getting all bookings" }, 500);
  }
});

// Check-in booking (admin only)
app.post("/make-server-fb9ae70e/admin/bookings/:id/checkin", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    const checkedInBooking = {
      ...booking,
      status: 'checked-in',
      checkedInAt: new Date().toISOString(),
      checkedInBy: user.id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, checkedInBooking);
    return c.json({ booking: checkedInBooking });
  } catch (error: any) {
    console.log(`Server error checking in booking: ${error.message}`);
    return c.json({ error: "Server error checking in booking" }, 500);
  }
});

// Check-out booking (admin only)
app.post("/make-server-fb9ae70e/admin/bookings/:id/checkout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    const checkedOutBooking = {
      ...booking,
      status: 'checked-out',
      checkedOutAt: new Date().toISOString(),
      checkedOutBy: user.id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, checkedOutBooking);
    return c.json({ booking: checkedOutBooking });
  } catch (error: any) {
    console.log(`Server error checking out booking: ${error.message}`);
    return c.json({ error: "Server error checking out booking" }, 500);
  }
});

// ====== HOUSEKEEPING ROUTES ======

// Get checked-out rooms (housekeeping)
app.get("/make-server-fb9ae70e/housekeeping/rooms", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!['admin', 'staff', 'housekeeping'].includes(userProfile?.role)) {
      return c.json({ error: "Forbidden: Staff access required" }, 403);
    }

    const allBookings = await kv.getByPrefix('booking:') || [];
    const checkedOutBookings = allBookings.filter((b: any) => b.status === 'checked-out');

    return c.json({ bookings: checkedOutBookings });
  } catch (error: any) {
    console.log(`Server error getting checked-out rooms: ${error.message}`);
    return c.json({ error: "Server error getting checked-out rooms" }, 500);
  }
});

// Update room cleaning status
app.post("/make-server-fb9ae70e/housekeeping/rooms/:roomId/clean", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!['admin', 'staff', 'housekeeping'].includes(userProfile?.role)) {
      return c.json({ error: "Forbidden: Staff access required" }, 403);
    }

    const roomId = c.req.param('roomId');
    const { photos, inventory, notes } = await c.req.json();

    const cleaningRecord = {
      roomId,
      cleanedBy: user.id,
      cleanedAt: new Date().toISOString(),
      photos: photos || [],
      inventory: inventory || {},
      notes: notes || '',
    };

    const recordId = `cleaning:${roomId}:${Date.now()}`;
    await kv.set(recordId, cleaningRecord);

    return c.json({ record: cleaningRecord });
  } catch (error: any) {
    console.log(`Server error recording room cleaning: ${error.message}`);
    return c.json({ error: "Server error recording room cleaning" }, 500);
  }
});

// ====== ANALYTICS ROUTES ======

// Get analytics data (admin only)
app.get("/make-server-fb9ae70e/admin/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'staff') {
      return c.json({ error: "Forbidden: Admin access required" }, 403);
    }

    const period = c.req.query('period') || 'monthly'; // daily, monthly, yearly
    const allBookings = await kv.getByPrefix('booking:') || [];

 // Calculate various analytics
    const analytics = {
      totalBookings: allBookings.length,
      totalRevenue: allBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
      // เติม as Record<string, number> ต่อท้ายวงเล็บปีกกา
      byPaymentMethod: {} as Record<string, number>,
      byRoomType: {} as Record<string, number>,
      byGuestType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      dailyVolume: [] as any[], // เติม any[] เผื่อไว้ด้วยสำหรับ Array
    };

    // Group by payment method
    allBookings.forEach((booking: any) => {
      const method = booking.paymentMethod || 'unknown';
      analytics.byPaymentMethod[method] = (analytics.byPaymentMethod[method] || 0) + 1;
    });

    // Group by room type
    allBookings.forEach((booking: any) => {
      const type = booking.roomType || 'unknown';
      analytics.byRoomType[type] = (analytics.byRoomType[type] || 0) + 1;
    });

    // Group by guest type
    allBookings.forEach((booking: any) => {
      const type = booking.bookingType || 'individual';
      analytics.byGuestType[type] = (analytics.byGuestType[type] || 0) + 1;
    });

    // Group by status
    allBookings.forEach((booking: any) => {
      const status = booking.status || 'draft';
      analytics.byStatus[status] = (analytics.byStatus[status] || 0) + 1;
    });

    return c.json({ analytics });
  } catch (error: any) {
    console.log(`Server error getting analytics: ${error.message}`);
    return c.json({ error: "Server error getting analytics" }, 500);
  }
});

// Search rooms
app.post("/make-server-fb9ae70e/rooms/search", async (c) => {
  try {
    const { checkIn, checkOut, guests, roomType, maxPrice } = await c.req.json();
    
    // Get all rooms
    let rooms = await kv.getByPrefix('room:') || [];
    
    // Filter by room type
    if (roomType && roomType !== 'all') {
      rooms = rooms.filter((room: any) => room.type === roomType);
    }
    
    // Filter by max price
    if (maxPrice) {
      rooms = rooms.filter((room: any) => room.rates?.daily?.general <= maxPrice);
    }
    
    // Filter by capacity
    if (guests) {
      rooms = rooms.filter((room: any) => room.maxOccupancy >= guests);
    }
    
    // TODO: Check availability based on checkIn/checkOut dates
    // This would require checking existing bookings
    
    return c.json({ rooms });
  } catch (error: any) {
    console.log(`Server error searching rooms: ${error.message}`);
    return c.json({ error: "Server error searching rooms" }, 500);
  }
});

Deno.serve(app.fetch);