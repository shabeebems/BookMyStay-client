import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wifi,
  CheckCircle,
  Ban,
  BedDouble,
  Edit3,
  Users,
  Hash,
} from "lucide-react";

interface Room {
  roomName: string;
  roomNumber: string;
  facilities: string[];
  sleeps: number;
  images: string[];
  description: string;
  isBlock: boolean;
}

interface SingleRoomProps {
  room: Room;
  onBack: () => void;
  onEdit: () => void;
}

const SingleRoom: React.FC<SingleRoomProps> = ({ room, onBack, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = room.images.length > 0 ? room.images : [
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={`${room.roomName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 group">
              <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 group">
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
                  index === currentImageIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Back & Edit Buttons */}
        <div className="absolute top-6 left-6">
          <button onClick={onBack} className="p-3 rounded-full bg-slate-800/70 backdrop-blur-md hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-6 right-6">
          <button 
          onClick={onEdit} 
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-blue-600/80 backdrop-blur-md hover:bg-blue-500 text-white transition-all duration-200 hover:scale-105">
            <Edit3 className="h-4 w-4" />
            <span className="font-medium">Edit</span>
          </button>
        </div>

        {/* Room Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">{room.roomName}</h1>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Hash className="h-4 w-4" />
                    <span>Room {room.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="h-4 w-4" />
                    <span>Sleeps {room.sleeps}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                  room.isBlock ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}>
                  {room.isBlock ? <><Ban className="h-4 w-4" /> Blocked</> : <><CheckCircle className="h-4 w-4" /> Available</>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300">About this room</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">{room.description}</p>
            </div>

            {/* Facilities Card */}
            <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300">Room Amenities</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {room.facilities.map((facility, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/40 hover:bg-slate-600/40 transition-colors duration-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Room Info */}
          <div className="xl:col-span-1">
            <div className="bg-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-700/50 hover:shadow-xl transition-shadow duration-300 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BedDouble className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-300">Room Info</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-xl">
                  <span className="text-slate-300 font-medium">Room Number</span>
                  <span className="text-white font-bold">#{room.roomNumber}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-xl">
                  <span className="text-slate-300 font-medium">Capacity</span>
                  <span className="text-white font-bold">{room.sleeps} {room.sleeps > 1 ? "Guests" : "Guest"}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-xl">
                  <span className="text-slate-300 font-medium">Status</span>
                  <span className={`font-bold ${room.isBlock ? "text-red-400" : "text-green-400"}`}>
                    {room.isBlock ? "Blocked" : "Available"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-xl">
                  <span className="text-slate-300 font-medium">Amenities</span>
                  <span className="text-white font-bold">{room.facilities.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRoom;