import React, { useEffect, useState } from "react";
import { Button, Chip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { protectedGetRequest, protectedPostRequest } from "../../../hooks/api";
import HotelAddPage from "../components/AddHotelModal";
import HotelEditPage from "../components/HotelEditPage";
// import HotelEditPage from "../components/EditHotelModal";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  facilities: string[];
  images: string[];
  documents: string[];
  isVerified: boolean;
  isBlocked: boolean;
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

  const toggleBlockStatus = async (id: string, currentStatus: boolean) => {
    try {
      await protectedPostRequest(`owner/hotels/${id}/block-toggle`, {
        block: !currentStatus,
      });
      fetchHotels();
    } catch (err) {
      console.error("Error updating block status", err);
    }
  };

  const handleAddClick = () => {
    setView("add");
  };

  const handleEditClick = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setView("edit");
  };

  useEffect(() => {
    if (view === "list") {
      fetchHotels();
    }
  }, [view]);

  // ===== LIST VIEW =====
  if (view === "list") {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hotel Dashboard</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Hotel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={hotel.images[0] || "/placeholder.jpg"}
                alt={hotel.name}
                className="h-40 w-full object-cover rounded mb-3"
              />

              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold">{hotel.name}</h2>
                <Chip
                  label={hotel.isVerified ? "Verified" : "Not Verified"}
                  color={hotel.isVerified ? "success" : "error"}
                  size="small"
                  icon={
                    hotel.isVerified ? (
                      <CheckCircleIcon />
                    ) : (
                      <BlockIcon fontSize="small" />
                    )
                  }
                />
              </div>

              <p className="text-gray-600 text-sm mb-2">{hotel.description}</p>

              <p className="text-sm text-gray-500 mb-4">
                Facilities: {hotel.facilities.join(", ")}
              </p>

              <div className="mt-auto flex gap-2">
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(hotel)}
                >
                  <EditIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  color={hotel.isBlocked ? "success" : "error"}
                  onClick={() =>
                    toggleBlockStatus(hotel._id, hotel.isBlocked)
                  }
                >
                  {hotel.isBlocked ? "Unblock" : "Block"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== ADD VIEW =====
  if (view === "add") {
    return (
      <HotelAddPage
        onCancel={() => setView("list")}
        onAdded={() => setView("list")}
      />
    );
  }

  // ===== EDIT VIEW =====
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
