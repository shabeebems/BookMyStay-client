import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('polo')
    return response;
  },
  (error) => {
    console.log('polos')
    if(error.response.status == 406) {
        // Deleting local storage
        localStorage.clear();
    }
    console.log('Error', error.response.status);
    return Promise.reject(error);
  }
);

export default apiClient;
