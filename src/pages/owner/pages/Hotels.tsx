import React, { useEffect, useState } from "react";
import { protectedGetRequest, protectedPatchRequest } from "../../../hooks/api";
import HotelAddPage from "../components/AddHotelModal";
import HotelEditPage from "../components/HotelEditPage";
import HotelListPage from "../components/HotelListPage";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  facilities: string[];
  images: string[];
  documents: string[];
  isBlock: boolean;
}

type ViewMode = "list" | "add" | "edit";

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [view, setView] = useState<ViewMode>("list");
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

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
  
  const handleEditClick = (hotel: Hotel) => {
    setEditingHotel(hotel);
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

  if (view === "edit" && editingHotel) {
    return (
      <HotelEditPage
        hotel={editingHotel}
        onCancel={() => {
          setEditingHotel(null);
          setView("list");
        }}
        onUpdated={() => {
          setEditingHotel(null);
          setView("list");
        }}
      />
    );
  }

  return null;
};

export default Hotels;
