import React, { useEffect, useState } from 'react';
import { protectedGetRequest, protectedPostRequest } from '../../../hooks/api';
import ToastMessage from '../../../components/ToastMessage';

interface Address {
  city?: string;
  state?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  mobile?: string | null;
  address?: Address | null;
  documents?: string[];
}

const ProfileVerificationPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const MAX_FILES = 3;
  const MAX_FILE_SIZE_MB = 2;

  const [user, setUser] = useState<UserProfile>({
    _id: '',
    name: '',
    email: '',
    mobile: '',
    address: null,
    documents: [],
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await protectedGetRequest("/profile");
      if (response && response.data && response.data.data) {
        setUser(response.data.data);
      }
    };
    fetchProfile();
  }, []);

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles: File[] = [];
      const newUrls: string[] = [];

      for (let file of filesArray) {
        if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
          showToast(`${file.name} exceeds 2MB size limit.`, 'error');
          continue;
        }

        if (selectedFiles.length + newFiles.length >= MAX_FILES) {
          showToast('You can upload a maximum of 3 files.', 'error');
          break;
        }

        if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
          newFiles.push(file);
          newUrls.push(URL.createObjectURL(file));
        }
      }

      setSelectedFiles(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select at least one document.', 'error');
      return;
    }

    setIsSubmitting(true);  // Start loading
    try {
      const base64Files = await Promise.all(selectedFiles.map(file => convertFileToBase64(file)));

      const response = await protectedPostRequest('/owner/owner-notifications', {
        documents: base64Files,
      });

      if (response && response.data && response.data.success) {
        showToast('Documents uploaded successfully!', 'success');
        setSelectedFiles([]);
        setPreviewUrls([]);
      } else {
        showToast('Failed to upload documents.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred while uploading documents.', 'error');
    } finally {
      setIsSubmitting(false);  // End loading
    }
  };

  return (
    <>
      <ToastMessage
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full space-y-6">
          <h2 className="text-2xl font-bold text-indigo-800">Profile Verification</h2>

          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-xl">
            You are <span className="font-semibold">not verified</span>. Please submit your documents.
            After admin verification, you can add your first hotel.
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700">{user.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <div className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700">{user.mobile}</div>
            </div>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <div className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700">{user?.address?.city || "NA"}</div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <div className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700">{user?.address?.state || "NA"}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Documents (Max 3, Each below 2MB)
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />

            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative border rounded-md overflow-hidden shadow-sm group">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover" />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            You can upload your <span className="font-semibold">Aadhar, Pancard, Passport, SSLC</span>, or other valid documents.
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-semibold rounded-md transition flex items-center justify-center`}
          >
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileVerificationPage;
