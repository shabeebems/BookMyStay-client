import React, { useEffect, useState } from "react";
import { protectedGetRequest, protectedPatchRequest } from "../../../hooks/api";
import HotelAddPage from "../components/hotel/AddHotelModal";
import HotelEditPage from "../components/hotel/HotelEditPage";
import HotelListPage from "../components/hotel/HotelListPage";
import SingleHotel from "../components/hotel/SingleHotel";
import AddRoom from "../components/room/AddRoom";
import SingleRoom from "../components/room/SingleRoom";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  facilities: string[];
  images: string[];
  documents: string[];
  isBlock: boolean;
}

interface Room {
  roomName: string;
  roomNumber: string;
  facilities: string[];
  sleeps: number;
  images: string[];
  description: string;
  isBlock: boolean
}

type ViewMode = "list" | "add" | "edit" | 'hotel' | 'add room' | 'room' | 'edit room';

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchHotels = async () => {
    try {
      const res = await protectedGetRequest("owner/hotels");
      setHotels(res.data.data);
    } catch (err) {
      console.error("Error fetching hotels", err);
    }
  };

  const toggleBlockStatus = async (id: string) => {
    try {
      await protectedPatchRequest(`owner/hotels/${id}/block`);
      fetchHotels();
    } catch (err) {
      console.error("Error updating block status", err);
    }
  };

  const handleAddClick = () => setView("add");
  const handleAddRoomClick = () => setView("add room");

  const handleHotelViewClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setView("hotel");
  }

  const handleRoomViewClick = (room: Room) => {
    setSelectedRoom(room);
    setView("room");
  }
  
  const handleEditClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setView("edit");
  };

  useEffect(() => {
    if (view === "list") {
      fetchHotels();
    }
  }, [view]);

  if (view === "list") {
    return (
      <HotelListPage
        hotels={hotels}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onView={handleHotelViewClick}
        onToggleBlock={toggleBlockStatus}
      />
    );
  }

  if (view === "add") {
    return (
      <HotelAddPage
        onCancel={() => setView("list")}
        onAdded={() => setView("list")}
      />
    );
  }

  if (view === "edit" && selectedHotel) {
    return (
      <HotelEditPage
        hotel={selectedHotel}
        onCancel={() => {
          setSelectedHotel(null);
          setView("list");
        }}
        onUpdated={() => {
          setSelectedHotel(null);
          setView("list");
        }}
      />
    );
  }

  if (view === "hotel" && selectedHotel) {
    return (
      <SingleHotel
        hotel={selectedHotel}
        onBack={() => setView("list")}
        onAddRoom={handleAddRoomClick}
        onRoomView={handleRoomViewClick}
      />
    );
  }

  if (view === "add room" && selectedHotel) {
    return (
      <AddRoom
        onCancel={() => setView("hotel")}
        onAdded={() => setView("hotel")}
        hotelId={selectedHotel._id}
      />
    );
  }

  if (view === "room" && selectedRoom) {
    return (
      <SingleRoom
        room={selectedRoom}
        onBack={() => setView("hotel")}
        onEdit={() => setView("edit room")}
      />
    );
  }

  if (view === "edit room" && selectedRoom) {
    return (
      <h1>Deop</h1>
    );
  }

  return null;
};

export default Hotels;
