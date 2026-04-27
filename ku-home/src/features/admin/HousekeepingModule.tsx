import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BedDouble,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Upload,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { projectId } from "../../utils/supabase/info";
import { toast } from "sonner";

interface CheckedOutRoom {
  id: string;
  roomNumber: string;
  roomType: string;
  checkedOutAt: string;
  guests?: any[];
}

interface InventoryItem {
  name: string;
  expected: number;
  actual: number;
  status: "ok" | "missing" | "damaged";
}

export function HousekeepingModule() {
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [rooms, setRooms] = useState<CheckedOutRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<CheckedOutRoom | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Cleaning form state
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { name: "Blankets", expected: 2, actual: 2, status: "ok" },
    { name: "Pillows", expected: 4, actual: 4, status: "ok" },
    { name: "Towels (Bath)", expected: 2, actual: 2, status: "ok" },
    { name: "Towels (Hand)", expected: 2, actual: 2, status: "ok" },
    { name: "Shampoo", expected: 2, actual: 2, status: "ok" },
    { name: "Drinking Water", expected: 4, actual: 4, status: "ok" },
    { name: "Hangers", expected: 6, actual: 6, status: "ok" },
    { name: "Remote Control", expected: 1, actual: 1, status: "ok" },
  ]);

  // Check housekeeping access
  useEffect(() => {
    if (
      !loading &&
      (!user ||
        !["admin", "staff", "housekeeping"].includes((user as any).role))
    ) {
      toast.error("Access denied: Housekeeping privileges required");
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Load checked-out rooms
  useEffect(() => {
    if (user && accessToken) {
      loadCheckedOutRooms();
    }
  }, [user, accessToken]);

  const loadCheckedOutRooms = async () => {
    setLoadingData(true);
    try {
      // Mock data for demonstration
      const mockRooms: CheckedOutRoom[] = [
        {
          id: "room-1",
          roomNumber: "S001",
          roomType: "Suite",
          checkedOutAt: new Date(Date.now() - 3600000).toISOString(),
          guests: [{ name: "John Doe" }],
        },
        {
          id: "room-2",
          roomNumber: "D005",
          roomType: "Deluxe",
          checkedOutAt: new Date(Date.now() - 7200000).toISOString(),
          guests: [{ name: "Jane Smith" }],
        },
        {
          id: "room-3",
          roomNumber: "S008",
          roomType: "Superior",
          checkedOutAt: new Date(Date.now() - 1800000).toISOString(),
          guests: [{ name: "Bob Johnson" }],
        },
      ];

      setRooms(mockRooms);

      // If viewing a specific room, select it
      if (roomId) {
        const room = mockRooms.find((r) => r.id === roomId);
        if (room) {
          setSelectedRoom(room);
        }
      }
    } catch (error) {
      console.error("Error loading checked-out rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoadingData(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, upload to Supabase Storage and get URLs
      // For now, create mock URLs
      const newPhotos = Array.from(files).map((file) => {
        return URL.createObjectURL(file);
      });
      setPhotos([...photos, ...newPhotos]);
      toast.success(`${files.length} photo(s) uploaded`);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const updateInventoryCount = (index: number, delta: number) => {
    const updated = [...inventory];
    updated[index].actual = Math.max(0, updated[index].actual + delta);

    // Update status based on count
    if (updated[index].actual === updated[index].expected) {
      updated[index].status = "ok";
    } else if (updated[index].actual < updated[index].expected) {
      updated[index].status = "missing";
    } else {
      updated[index].status = "ok";
    }

    setInventory(updated);
  };

  const toggleDamaged = (index: number) => {
    const updated = [...inventory];
    updated[index].status =
      updated[index].status === "damaged" ? "ok" : "damaged";
    setInventory(updated);
  };

  const handleSubmit = async () => {
    if (!selectedRoom) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fb9ae70e/housekeeping/rooms/${selectedRoom.id}/clean`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            photos,
            inventory,
            notes,
          }),
        },
      );

      if (response.ok) {
        toast.success("Room cleaning recorded successfully");
        navigate("/admin/housekeeping");
        // Reset form
        setPhotos([]);
        setNotes("");
        setInventory(
          inventory.map((item) => ({
            ...item,
            actual: item.expected,
            status: "ok" as const,
          })),
        );
      } else {
        toast.error("Failed to record cleaning");
      }
    } catch (error) {
      console.error("Error submitting cleaning record:", error);
      toast.error("Submission error");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006b54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Room List View
  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="container mx-auto px-4 py-6">
            {/* ── Back button top-left ── */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Admin Portal
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Housekeeping
            </h1>
            <p className="text-gray-600 mt-1">
              Checked-out rooms ready for cleaning
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {rooms.length === 0 ? (
            <Card className="p-12 text-center">
              <BedDouble className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No rooms to clean
              </h3>
              <p className="text-gray-600">
                All checked-out rooms have been cleaned
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {room.roomNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {room.roomType} Room
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                      Needs Cleaning
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Guest:</span>
                      <span className="font-medium text-gray-900">
                        {room.guests?.[0]?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Checked Out:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(room.checkedOutAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#006b54] hover:bg-[#005a46]">
                    Start Cleaning
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Room Detail / Cleaning Form View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setSelectedRoom(null)}
            className="flex items-center text-gray-600 hover:text-[#006b54] mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Room List
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Room {selectedRoom.roomNumber}
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedRoom.roomType} Room - Cleaning Checklist
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Photo Upload Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#006b54]" />
            Room Condition Photos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Room photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Label
            htmlFor="photo-upload"
            className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#006b54] hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Upload Photos</span>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </Label>
        </Card>

        {/* Inventory Tracking */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#006b54]" />
            Inventory Check
          </h2>

          <div className="space-y-3">
            {inventory.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  item.status === "ok"
                    ? "border-green-200 bg-green-50"
                    : item.status === "missing"
                      ? "border-orange-200 bg-orange-50"
                      : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Expected: {item.expected}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateInventoryCount(index, -1)}
                      disabled={item.actual === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-bold text-lg w-8 text-center">
                      {item.actual}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateInventoryCount(index, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant={
                      item.status === "damaged" ? "destructive" : "outline"
                    }
                    onClick={() => toggleDamaged(index)}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Damaged
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notes Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Additional Notes
          </h2>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes about the room condition, maintenance needs, or special observations..."
            rows={4}
            className="w-full"
          />
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[#006b54] hover:bg-[#005a46] h-12 text-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Complete Cleaning
          </Button>
          <Button
            onClick={() => setSelectedRoom(null)}
            variant="outline"
            className="h-12"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
