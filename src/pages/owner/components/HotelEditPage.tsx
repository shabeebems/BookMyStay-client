import React, { useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { protectedPutRequest } from "../../../hooks/api";

interface Hotel {
  _id: string;
  name: string;
  facilities: string[];
  description: string;
  images: string[];
  documents: string[]; // required here
}

interface HotelEditPageProps {
  hotel: Hotel;
  onCancel: () => void;
  onUpdated: () => void;
}

const facilityOptions = ["WiFi", "Kitchen", "Parking", "Swimming Pool", "Gym", "Air Conditioning"];

const HotelEditPage: React.FC<HotelEditPageProps> = ({ hotel, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState<Hotel>({
    ...hotel
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "images" | "documents"
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      const base64Files = await Promise.all(files.map((file) => convertFileToBase64(file)));
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], ...base64Files].slice(0, 3),
      }));
    }
  };

  const handleRemoveFile = (index: number, field: "images" | "documents") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
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

  return (
    <Paper sx={{ maxWidth: 800, margin: "2rem auto", padding: "2rem" }}>
      <Typography variant="h5" gutterBottom>Edit Hotel</Typography>

      {formErrorMessage && (
        <div className="bg-red-100 text-red-800 text-sm p-2 rounded mb-4">
          {formErrorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <TextField
          label="Hotel Name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Facilities Multi Select */}
        <FormControl fullWidth error={!!errors.facilities}>
          <InputLabel>Facilities</InputLabel>
          <Select
            multiple
            value={formData.facilities}
            onChange={(e) => {
              setFormData({ ...formData, facilities: e.target.value as string[] });
              if (errors.facilities) setErrors((prev) => ({ ...prev, facilities: "" }));
            }}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {facilityOptions.map((facility) => (
              <MenuItem key={facility} value={facility}>
                <Checkbox checked={formData.facilities.includes(facility)} />
                <ListItemText primary={facility} />
              </MenuItem>
            ))}
          </Select>
          {errors.facilities && <p className="text-red-600 text-xs mt-1">{errors.facilities}</p>}
        </FormControl>

        <TextField
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
          }}
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />

        {/* Images Upload */}
        <div>
          <label>Upload Images (max 3)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, "images")} />
          {errors.images && <p className="text-red-600 text-xs mt-1">{errors.images}</p>}
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.images.map((img, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={img} alt="Preview" className="w-full h-full object-cover rounded" />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index, "images")}
                  className="absolute top-0 right-0 bg-white"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Upload */}
        <div>
          <label>Upload Documents (max 3)</label>
          <input type="file" accept=".pdf,.doc,.docx,image/*" multiple onChange={(e) => handleFileChange(e, "documents")} />
          {errors.documents && <p className="text-red-600 text-xs mt-1">{errors.documents}</p>}
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-1 border rounded p-1">
                <span className="truncate max-w-[100px]">Document {index + 1}</span>
                <IconButton size="small" onClick={() => handleRemoveFile(index, "documents")}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default HotelEditPage;
