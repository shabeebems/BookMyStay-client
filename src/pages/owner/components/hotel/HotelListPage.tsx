import React from "react";
import { Plus, Edit3, Eye, Users } from "lucide-react";

interface Hotel {
  _id: string;
  name: string;
  facilities: string[];
  images: string[];
  description: string;
  documents: string[];
  isBlock: boolean;
}

interface HotelTableProps {
  hotels: Hotel[];
  onAdd: () => void;
  onEdit: (hotel: Hotel) => void;
  onView: (hotel: Hotel) => void;
  onToggleBlock: (id: string) => void;
}

const HotelTable: React.FC<HotelTableProps> = ({
  hotels,
  onAdd,
  onEdit,
  onView,
  onToggleBlock,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Hotel Management
          </h1>
          <p className="text-slate-300 mt-1 text-sm sm:text-base">
            Manage your hotel listings and settings
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Add Hotel
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600">
                <th className="text-left p-2 sm:p-4 font-semibold text-slate-200 whitespace-nowrap">
                  Image
                </th>
                <th className="text-left p-2 sm:p-4 font-semibold text-slate-200 whitespace-nowrap">
                  Hotel Name
                </th>
                <th className="text-left p-2 sm:p-4 font-semibold text-slate-200 whitespace-nowrap">
                  Facilities
                </th>
                <th className="text-center p-2 sm:p-4 font-semibold text-slate-200 whitespace-nowrap">
                  Status
                </th>
                <th className="text-center p-2 sm:p-4 font-semibold text-slate-200 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, index) => (
                <tr
                  key={hotel._id}
                  className={`border-b border-slate-700/30 hover:bg-slate-700/30 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                  }`}
                >
                  {/* Image */}
                  <td className="p-2 sm:p-4">
                    <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden shadow-lg bg-slate-700">
                      <img
                        src={
                          hotel.images[0] ||
                          "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
                        }
                        alt={hotel.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="p-2 sm:p-4">
                    <h3 className="font-bold text-white text-base sm:text-lg hover:text-blue-400 transition-colors cursor-pointer">
                      {hotel.name}
                    </h3>
                  </td>

                  {/* Facilities */}
                  <td className="p-2 sm:p-4">
                    <div className="flex flex-wrap gap-1">
                      {hotel.facilities.slice(0, 3).map((facility, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {facility}
                        </span>
                      ))}
                      {hotel.facilities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-slate-600 text-slate-300">
                          +{hotel.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-2 sm:p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        hotel.isBlock
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {hotel.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-2 sm:p-4">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        onClick={() => onEdit(hotel)}
                        className="p-1.5 sm:p-2 rounded-lg bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Edit hotel"
                      >
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>

                      <button
                        onClick={() => onToggleBlock(hotel._id)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                          hotel.isBlock
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {hotel.isBlock ? "Unblock" : "Block"}
                      </button>

                      <button
                        onClick={() => onView(hotel)}
                        className="p-1.5 sm:p-2 rounded-lg bg-slate-700 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {hotels.length === 0 && (
          <div className="text-center py-10 sm:py-12 px-4">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">
              No Hotels Found
            </h3>
            <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Get started by adding your first hotel listing.
            </p>
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Your First Hotel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelTable;
