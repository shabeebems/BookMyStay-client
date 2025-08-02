import React, { useEffect, useState } from 'react';
import { getRequest } from '../../../hooks/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  date: string;
  requestStatus: string;
  documents: string[];
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getRequest('/notification');
      if (response && response.data && Array.isArray(response.data.data)) {
        setNotifications(response.data.data);
      }
    };
    fetchNotifications();
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setCurrentSlide(0);
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
                  <div className="mt-2 text-xs text-gray-500">{formatDate(notification.date)}</div>
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

                {/* Prev Button */}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
