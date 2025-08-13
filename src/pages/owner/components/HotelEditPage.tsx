import React, { useState } from "react";
import { X, Upload, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { protectedPutRequest } from "../../../hooks/api";

interface Hotel {
  _id: string;
  name: string;
  facilities: string[];
  description: string;
  images: string[];
}

interface HotelEditPageProps {
  hotel: Hotel;
  onCancel: () => void;
  onUpdated: () => void;
}

const facilityOptions = ["WiFi", "Kitchen", "Parking", "Swimming Pool", "Gym", "Air Conditioning"];

const HotelEditPage: React.FC<HotelEditPageProps> = ({ hotel, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState<Hotel>({ ...hotel });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFacilitiesDropdown, setShowFacilitiesDropdown] = useState(false);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "images") => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      const base64Files = await Promise.all(files.map(convertFileToBase64));
      setFormData(prev => ({ ...prev, [field]: [...prev[field], ...base64Files].slice(0, 3) }));
    }
  };

  const handleRemoveFile = (index: number, field: "images") => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
    if (errors.facilities) setErrors(prev => ({ ...prev, facilities: "" }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    setFormErrorMessage("");

    try {
      await protectedPutRequest(`owner/hotels/${hotel._id}`, formData);
      onUpdated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (Array.isArray(responseData?.errors)) {
          const errorMap: { [key: string]: string } = {};
          responseData.errors.forEach((err: { field: string; message: string }) => {
            errorMap[err.field] = err.message;
          });
          setErrors(errorMap);
        } else if (responseData?.message) {
          setFormErrorMessage(responseData.message);
        }
      } else {
        setFormErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) => `w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
    errors[field] ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500/50'
  }`;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Edit Hotel</h1>
            <p className="text-slate-300 mt-1">Update details for your hotel</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-slate-700/50">
          {formErrorMessage && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              {formErrorMessage}
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hotel Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors(prev => ({ ...prev, name: "" })); }}
                className={inputClass('name')}
                placeholder="Enter hotel name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.name}</p>}
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Facilities *</label>
              <div className="relative">
                <button type="button" onClick={() => setShowFacilitiesDropdown(!showFacilitiesDropdown)} className={`${inputClass('facilities')} flex items-center justify-between`}>
                  <span className={formData.facilities.length === 0 ? 'text-slate-400' : 'text-white'}>
                    {formData.facilities.length === 0 ? 'Select facilities' : `${formData.facilities.length} facilities selected`}
                  </span>
                  <Plus className={`h-4 w-4 transition-transform duration-200 ${showFacilitiesDropdown ? 'rotate-45' : ''}`} />
                </button>

                {showFacilitiesDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                    {facilityOptions.map((facility) => (
                      <label key={facility} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-600/50 cursor-pointer transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityToggle(facility)}
                          className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500/50 focus:ring-2"
                        />
                        <span className="text-white text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.facilities && <p className="text-red-400 text-sm mt-1">{errors.facilities}</p>}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload Images (max 3)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "images")}
                  className="hidden"
                  disabled={formData.images.length >= 3}
                />
              </label>
              {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images}</p>}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-slate-700 rounded-lg overflow-hidden">
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index, "images")}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium rounded-lg transition-all duration-200 border border-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : 'Update Hotel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelEditPage;
