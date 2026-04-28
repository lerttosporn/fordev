import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Home,
  Settings,
  ChevronRight,
  MoreVertical,
  LayoutGrid,
  List
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { roomService } from '../../services/roomService';
import { Room, RoomType, RoomStatus, RoomTypeName } from '../../models/room';
import { toast } from 'sonner';

export const RoomManagementPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("rooms");

  // Form states
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingType, setEditingType] = useState<RoomType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedRooms = await roomService.getRooms();
      const fetchedTypes = await roomService.getRoomTypes();
      setRooms(fetchedRooms);
      setRoomTypes(fetchedTypes);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomData: any = {
      roomNumber: formData.get("roomNumber") as string,
      roomType: formData.get("roomType") as RoomTypeName,
      floor: parseInt(formData.get("floor") as string),
      status: formData.get("status") as RoomStatus,
      // Default values from selected type could be added here
      sizeSqM: 32,
      baseGuests: 2,
      maxGuests: 3,
      maxExtraBeds: 1,
      extraBedPrice: 500,
      rates: {
        daily: { personnel: 1200, general: 1500 },
        group: { min5Rooms: 1000, min10Rooms: 900 },
        monthly: 15000
      },
      amenities: [],
      images: []
    };

    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, roomData);
        toast.success("Room updated successfully");
      } else {
        await roomService.createRoom(roomData);
        toast.success("Room created successfully");
      }
      setIsRoomDialogOpen(false);
      setEditingRoom(null);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleTypeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const typeData: any = {
      name: formData.get("name") as RoomTypeName,
      description: formData.get("description") as string,
      sizeSqM: parseInt(formData.get("sizeSqM") as string),
      baseGuests: parseInt(formData.get("baseGuests") as string),
      maxGuests: parseInt(formData.get("maxGuests") as string),
      maxExtraBeds: parseInt(formData.get("maxExtraBeds") as string),
      extraBedPrice: parseInt(formData.get("extraBedPrice") as string),
      rates: {
        daily: {
          personnel: parseInt(formData.get("dailyPersonnel") as string),
          general: parseInt(formData.get("dailyGeneral") as string)
        },
        group: {
          min5Rooms: parseInt(formData.get("group5") as string),
          min10Rooms: parseInt(formData.get("group10") as string)
        },
        monthly: parseInt(formData.get("monthly") as string)
      },
      amenities: (formData.get("amenities") as string).split(",").map(s => s.trim()),
      images: []
    };

    try {
      if (editingType) {
        await roomService.updateRoomType(editingType.id, typeData);
        toast.success("Room type updated successfully");
      } else {
        await roomService.createRoomType(typeData);
        toast.success("Room type created successfully");
      }
      setIsTypeDialogOpen(false);
      setEditingType(null);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const deleteRoom = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      await roomService.deleteRoom(id);
      toast.success("Room deleted");
      fetchData();
    }
  };

  const deleteType = async (id: string) => {
    if (confirm("Are you sure you want to delete this room type?")) {
      await roomService.deleteRoomType(id);
      toast.success("Room type deleted");
      fetchData();
    }
  };

  const getStatusBadge = (status: RoomStatus) => {
    const variants: Record<RoomStatus, string> = {
      available: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      booked: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      checked_in: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      checked_out: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      repair: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      unavailable: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };
    return <Badge variant="outline" className={`${variants[status]} capitalize`}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Room Management</h1>
            <p className="text-slate-500 mt-1">Manage your inventory, room types, and status.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search rooms..."
                className="pl-9 w-[200px] md:w-[300px] bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
              onClick={() => {
                if (activeTab === "rooms") {
                  setEditingRoom(null);
                  setIsRoomDialogOpen(true);
                } else {
                  setEditingType(null);
                  setIsTypeDialogOpen(true);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "rooms" ? "Add Room" : "Add Type"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rooms" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="rooms" className="rounded-lg px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
              <Home className="h-4 w-4 mr-2" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="types" className="rounded-lg px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
              <Settings className="h-4 w-4 mr-2" />
              Room Types
            </TabsTrigger>
          </TabsList>

          {/* Rooms Tab Content */}
          <TabsContent value="rooms" className="space-y-4">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[150px]">Room Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.filter(r => r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())).map((room) => (
                    <TableRow key={room.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">{room.roomNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600">{room.roomType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{room.floor}</TableCell>
                      <TableCell>{getStatusBadge(room.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            onClick={() => {
                              setEditingRoom(room);
                              setIsRoomDialogOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => deleteRoom(room.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Room Types Tab Content */}
          <TabsContent value="types" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roomTypes.map((type) => (
              <Card key={type.id} className="border-slate-200 hover:border-indigo-200 transition-all hover:shadow-md group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900">{type.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{type.description}</CardDescription>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingType(type);
                      setIsTypeDialogOpen(true);
                    }}>
                      <Edit2 className="h-4 w-4 text-slate-400 hover:text-indigo-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteType(type.id)}>
                      <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">General Rate</p>
                      <p className="text-lg font-bold text-slate-900 mt-1">฿{type.rates.daily.general.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                      <p className="text-xs text-indigo-500 uppercase tracking-wider font-semibold">KU Personnel</p>
                      <p className="text-lg font-bold text-indigo-700 mt-1">฿{type.rates.daily.personnel.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">{type.sizeSqM} m²</Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">{type.maxGuests} Guests Max</Badge>
                    {type.amenities.slice(0, 3).map((a, i) => (
                      <Badge key={i} variant="outline" className="text-slate-400 border-slate-200">{a}</Badge>
                    ))}
                    {type.amenities.length > 3 && <span className="text-xs text-slate-400 self-center">+{type.amenities.length - 3} more</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Room Dialog */}
        <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleRoomSubmit}>
              <DialogHeader>
                <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" name="roomNumber" defaultValue={editingRoom?.roomNumber} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select name="roomType" defaultValue={editingRoom?.roomType || "Superior"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Superior">Superior</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input id="floor" name="floor" type="number" defaultValue={editingRoom?.floor || 1} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingRoom?.status || "available"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="checked_in">Checked In</SelectItem>
                      <SelectItem value="checked_out">Checked Out</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Room Type Dialog */}
        <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleTypeSubmit}>
              <DialogHeader>
                <DialogTitle>{editingType ? "Edit Room Type" : "Add New Room Type"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Type Name</Label>
                    <Select name="name" defaultValue={editingType?.name || "Superior"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Superior">Superior</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" defaultValue={editingType?.description} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sizeSqM">Size (m²)</Label>
                      <Input id="sizeSqM" name="sizeSqM" type="number" defaultValue={editingType?.sizeSqM} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="baseGuests">Base Guests</Label>
                      <Input id="baseGuests" name="baseGuests" type="number" defaultValue={editingType?.baseGuests} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="maxGuests">Max Guests</Label>
                      <Input id="maxGuests" name="maxGuests" type="number" defaultValue={editingType?.maxGuests} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxExtraBeds">Max Extra Beds</Label>
                      <Input id="maxExtraBeds" name="maxExtraBeds" type="number" defaultValue={editingType?.maxExtraBeds} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="extraBedPrice">Extra Bed Price</Label>
                    <Input id="extraBedPrice" name="extraBedPrice" type="number" defaultValue={editingType?.extraBedPrice} required />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 border-b pb-2">Pricing & Rates</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="dailyPersonnel">KU Personnel Daily Rate</Label>
                    <Input id="dailyPersonnel" name="dailyPersonnel" type="number" defaultValue={editingType?.rates.daily.personnel} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dailyGeneral">General Daily Rate</Label>
                    <Input id="dailyGeneral" name="dailyGeneral" type="number" defaultValue={editingType?.rates.daily.general} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="group5">Group (5+ rooms)</Label>
                      <Input id="group5" name="group5" type="number" defaultValue={editingType?.rates.group.min5Rooms} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="group10">Group (10+ rooms)</Label>
                      <Input id="group10" name="group10" type="number" defaultValue={editingType?.rates.group.min10Rooms} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="monthly">Monthly Rate</Label>
                    <Input id="monthly" name="monthly" type="number" defaultValue={editingType?.rates.monthly} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amenities">Amenities (comma separated)</Label>
                    <Input id="amenities" name="amenities" defaultValue={editingType?.amenities.join(", ")} placeholder="TV, Wifi, AC" />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6 border-t pt-6">
                <Button type="button" variant="outline" onClick={() => setIsTypeDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
