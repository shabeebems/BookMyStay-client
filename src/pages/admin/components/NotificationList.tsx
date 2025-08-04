import React, { useEffect, useState } from 'react';
import { protectedGetRequest, protectedPutRequest } from '../../../hooks/api';
import ConfirmDialog from '../../../components/ConfirmDialog';
import ToastMessage from '../../../components/ToastMessage';  // Import Toast Component

interface Notification {
  _id: string;
  title: string;
  message: string;
  date: string;
  requestStatus: string;
  documents: string[];
  rejectReason?: string;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accepted' | 'rejected' | null>(null);

  // Toast States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await protectedGetRequest('/admin/notification');
      if (response && response.data && Array.isArray(response.data.data)) {
        setNotifications(response.data.data);
      }
    };
    fetchNotifications();
  }, []);

  const handleToast = (message: string, severity: 'success' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setCurrentSlide(0);
    setShowRejectInput(false);
    setRejectReason('');
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  const nextSlide = () => {
    if (selectedNotification) {
      setCurrentSlide((prev) => (prev + 1) % selectedNotification.documents.length);
    }
  };

  const prevSlide = () => {
    if (selectedNotification) {
      setCurrentSlide((prev) =>
        prev === 0 ? selectedNotification.documents.length - 1 : prev - 1
      );
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedNotification || !actionType) return;

    if (actionType === 'rejected' && rejectReason.trim() === '') {
      handleToast('Please provide a reject reason.', 'error');
      return;
    }

    try {
      const payload: any = { requestStatus: actionType };
      if (actionType === 'rejected') {
        payload.rejectReason = rejectReason;
      }

      const response = await protectedPutRequest(`/admin/notification/${selectedNotification._id}`, payload);

      if (response && response.data && response.data.success) {
        handleToast(`Notification ${actionType} successfully`, 'success');
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === selectedNotification._id
              ? { ...n, requestStatus: actionType, rejectReason: actionType === 'rejected' ? rejectReason : undefined }
              : n
          )
        );
        closeModal();
      } else {
        handleToast('Failed to update status', 'error');
      }
    } catch (error) {
      console.error(error);
      handleToast('An error occurred', 'error');
    } finally {
      setConfirmDialogOpen(false);
      setActionType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>

        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No Notifications Found.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="py-4 flex items-start gap-4 hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition"
                onClick={() => openModal(notification)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                  <div className="mt-2 text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    notification.requestStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : notification.requestStatus === 'accepted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {notification.requestStatus}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full relative p-6">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedNotification.title}
            </h3>

            {/* Image Slider */}
            {selectedNotification.documents.length > 0 && (
              <div className="relative">
                <img
                  src={selectedNotification.documents[currentSlide]}
                  alt={`Document ${currentSlide + 1}`}
                  className="w-full h-64 object-cover rounded-md"
                />

                {selectedNotification.documents.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute top-1/2 -translate-y-1/2 left-2 bg-gray-800/50 text-white rounded-full p-2 hover:bg-gray-800"
                    >
                      &#8592;
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute top-1/2 -translate-y-1/2 right-2 bg-gray-800/50 text-white rounded-full p-2 hover:bg-gray-800"
                    >
                      &#8594;
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              {selectedNotification.message}
            </div>

            {selectedNotification.requestStatus === 'rejected' && selectedNotification.rejectReason && (
              <div className="mt-4 p-3 bg-red-50 text-sm text-red-700 rounded-md">
                <strong>Reject Reason:</strong> {selectedNotification.rejectReason}
              </div>
            )}

            {showRejectInput && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reject Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
            )}

            {selectedNotification.requestStatus === 'pending' && (
              <div className="mt-6 flex justify-end gap-3">
                {!showRejectInput ? (
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActionType('rejected');
                      setConfirmDialogOpen(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Submit Reject Reason
                  </button>
                )}

                <button
                  onClick={() => {
                    setActionType('accepted');
                    setConfirmDialogOpen(true);
                  }}
                  className={`px-4 py-2 rounded-md transition ${
                    showRejectInput
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={showRejectInput}
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Are you sure?"
        message={
          actionType === 'accepted'
            ? 'Do you want to accept this request?'
            : 'Do you want to reject this request?'
        }
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setActionType(null);
        }}
      />

      {/* Toast Message */}
      <ToastMessage
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default NotificationList;
