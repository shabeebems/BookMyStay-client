import React, { useState } from "react";
import { X, Upload, FileText, Trash2, Plus, BedDouble, Users, Calendar, DollarSign } from "lucide-react";
import axios from "axios";
import { protectedPostRequest } from "../../../../hooks/api";

interface RateData {
  duration: string;
  rate: string;
}

interface FormDataState {
  roomName: string;
  roomNumber: string;
  facilities: string[];
  sleeps: number;
  description: string;
  images: string[];
  rates: RateData[];
}

interface RoomAddPageProps {
  onCancel: () => void;
  onAdded: () => void;
  hotelId?: string;
}

const facilityOptions = [
  "Air Conditioning", "Private Bathroom", "WiFi", "TV", "Mini Bar", 
  "Balcony", "Sea View", "City View", "Room Service", "Safe", 
  "Hair Dryer", "Coffee Machine", "Refrigerator"
];

const durationOptions = [
  { value: "1", label: "1 Day" },
  { value: "2", label: "2 Days" },
  { value: "3", label: "3 Days" },
  { value: "7", label: "1 Week" },
  { value: "30", label: "1 Month" }
];

const RoomAddPage: React.FC<RoomAddPageProps> = ({ onCancel, onAdded, hotelId }) => {
  const [formData, setFormData] = useState<FormDataState>({
    roomName: "",
    roomNumber: "",
    facilities: [],
    sleeps: 1,
    description: "",
    images: [],
    rates: []
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFacilitiesDropdown, setShowFacilitiesDropdown] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [newRate, setNewRate] = useState<RateData>({ duration: "1", rate: "" });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      const base64Files = await Promise.all(files.map(convertFileToBase64));
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...base64Files].slice(0, 5) 
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
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

  const handleAddRate = () => {
    if (newRate.duration && newRate.rate && parseFloat(newRate.rate) > 0) {
      // Check if duration already exists
      const existingRateIndex = formData.rates.findIndex(r => r.duration === newRate.duration);
      
      if (existingRateIndex >= 0) {
        // Update existing rate
        const updatedRates = [...formData.rates];
        updatedRates[existingRateIndex] = { ...newRate };
        setFormData(prev => ({ ...prev, rates: updatedRates }));
      } else {
        // Add new rate
        setFormData(prev => ({ 
          ...prev, 
          rates: [...prev.rates, { ...newRate }] 
        }));
      }
      
      setNewRate({ duration: "1", rate: "" });
      setShowRateForm(false);
    }
  };

  const handleRemoveRate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rates: prev.rates.filter((_, i) => i !== index)
    }));
  };

  const getDurationLabel = (duration: string) => {
    const option = durationOptions.find(opt => opt.value === duration);
    return option ? option.label : `${duration} Day${duration !== "1" ? "s" : ""}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    setFormErrorMessage("");

    try {
      const submitData = {
        ...formData,
        hotelId: hotelId
      };
      await protectedPostRequest("owner/rooms", submitData);
      onAdded();
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Add New Room</h1>
            <p className="text-slate-300 mt-1">Create a new room with all the details and pricing</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-slate-700/50">
          {formErrorMessage && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
              {formErrorMessage}
            </div>
          )}

          <div className="space-y-6">
            {/* Room Name and Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Room Name *</label>
                <input 
                  type="text" 
                  value={formData.roomName} 
                  onChange={(e) => { 
                    setFormData({ ...formData, roomName: e.target.value }); 
                    if (errors.roomName) setErrors(prev => ({ ...prev, roomName: "" })); 
                  }} 
                  className={inputClass('roomName')} 
                  placeholder="e.g., Deluxe Suite" 
                />
                {errors.roomName && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.roomName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Room Number *</label>
                <input 
                  type="text" 
                  value={formData.roomNumber} 
                  onChange={(e) => { 
                    setFormData({ ...formData, roomNumber: e.target.value }); 
                    if (errors.roomNumber) setErrors(prev => ({ ...prev, roomNumber: "" })); 
                  }} 
                  className={inputClass('roomNumber')} 
                  placeholder="e.g., 101, A-12" 
                />
                {errors.roomNumber && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.roomNumber}</p>}
              </div>
            </div>

            {/* Sleeps */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Guest Capacity *</label>
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-slate-400" />
                <select 
                  value={formData.sleeps} 
                  onChange={(e) => setFormData({ ...formData, sleeps: parseInt(e.target.value) })}
                  className={inputClass('sleeps')}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
              {errors.sleeps && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.sleeps}</p>}
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Room Facilities *</label>
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setShowFacilitiesDropdown(!showFacilitiesDropdown)} 
                  className={`${inputClass('facilities')} flex items-center justify-between`}
                >
                  <span className={formData.facilities.length === 0 ? 'text-slate-400' : 'text-white'}>
                    {formData.facilities.length === 0 ? 'Select room facilities' : `${formData.facilities.length} facilities selected`}
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

              {formData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.facilities.map((facility) => (
                    <span key={facility} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm">
                      {facility}
                      <button 
                        type="button" 
                        onClick={() => handleFacilityToggle(facility)} 
                        className="hover:text-blue-200 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.facilities && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.facilities}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Room Description *</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => { 
                  setFormData({ ...formData, description: e.target.value }); 
                  if (errors.description) setErrors(prev => ({ ...prev, description: "" })); 
                }} 
                rows={4} 
                className={`${inputClass('description')} resize-none`} 
                placeholder="Describe the room features, amenities, and what makes it special..." 
              />
              {errors.description && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.description}</p>}
            </div>

            {/* Rates Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-slate-300">Room Rates *</label>
                <button 
                  type="button"
                  onClick={() => setShowRateForm(!showRateForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 text-sm"
                >
                  <Plus className={`h-4 w-4 transition-transform duration-200 ${showRateForm ? 'rotate-45' : ''}`} />
                  Add Rate
                </button>
              </div>

              {showRateForm && (
                <div className="bg-slate-700/30 rounded-lg p-4 mb-4 border border-slate-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Duration</label>
                      <select 
                        value={newRate.duration}
                        onChange={(e) => setNewRate({ ...newRate, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {durationOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Rate ($)</label>
                      <input 
                        type="number"
                        value={newRate.rate}
                        onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        type="button"
                        onClick={handleAddRate}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 text-sm"
                      >
                        Add Rate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formData.rates.length > 0 && (
                <div className="space-y-2">
                  {formData.rates.map((rate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-white text-sm font-medium">{getDurationLabel(rate.duration)}</span>
                        <div className="flex items-center gap-1 text-green-400">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">{parseFloat(rate.rate).toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveRate(index)} 
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.rates && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.rates}</p>}
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Room Images (max 5)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, JPEG up to 10MB each</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  className="hidden" 
                  disabled={formData.images.length >= 5} 
                />
              </label>
              {errors.images && <p className="text-red-400 text-sm mt-1 flex items-center gap-1"><div className="w-1 h-1 bg-red-400 rounded-full"></div>{errors.images}</p>}
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden">
                      <img src={img} alt={`Room preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFile(index)} 
                      className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
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
                    Adding Room...
                  </div>
                ) : 'Add Room'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAddPage;