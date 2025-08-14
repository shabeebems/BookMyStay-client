import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wifi,
  CheckCircle,
  Ban,
  PlusCircle,
  BedDouble,
  Star,
} from "lucide-react";
import { protectedGetRequest } from "../../../../hooks/api";

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

interface SingleHotelProps {
  hotel: Hotel;
  onBack: () => void;
  onAddRoom: () => void;
  onRoomView: (room: Room) => void
}

const SingleHotel: React.FC<SingleHotelProps> = ({ hotel, onBack, onAddRoom, onRoomView }) => {
  
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const res = await protectedGetRequest(`owner/rooms/${hotel._id}`);
        setRooms(res.data.data);
      } catch (err) {
        console.error("Error fetching hotels", err);
      }
    };

    getRooms();
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = hotel.images.length > 0 ? hotel.images : [
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        {/* Image Container */}
        <div className="relative w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 group"
            >
              <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 group"
            >
              <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Image Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-slate-800/70 backdrop-blur-md hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Hotel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center text-blue-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-slate-300 text-sm">5.0 Rating</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                    hotel.isBlock
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {hotel.isBlock ? (
                    <>
                      <Ban className="h-4 w-4" /> Blocked
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" /> Active
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300">About this hotel</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">
                {hotel.description}
              </p>
            </div>

            {/* Facilities Card */}
            <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300">Amenities & Facilities</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hotel.facilities.map((facility, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/40 hover:bg-slate-600/40 transition-colors duration-200"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Card */}
            {hotel.documents.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-300">Documents</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hotel.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl border border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/40 transition-all duration-200 group"
                    >
                      <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                      <span className="text-slate-300 group-hover:text-blue-300 font-medium">
                        Document {i + 1}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Rooms */}
          <div className="xl:col-span-1">
            <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BedDouble className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-300">Rooms</h2>
                </div>
                <button
                  onClick={onAddRoom}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors duration-200 hover:scale-105 transform">
                    <PlusCircle className="h-4 w-4" />
                    <span className="font-medium">Add Room</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {rooms.map((room, i) => (
                  <div
                    key={i}
                    onClick={() => onRoomView(room)}
                    className="bg-slate-700/40 border border-slate-600 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={room.images[0]}
                        alt={room.roomName}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className="text-xs font-semibold text-slate-300">
                          {room.sleeps} {room.sleeps > 1 ? "Guests" : "Guest"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-white mb-1">{room.roomName}</h3>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        Sleeps {room.sleeps} {room.sleeps > 1 ? "people" : "person"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleHotel;