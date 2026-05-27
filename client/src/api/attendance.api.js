import axiosInstance from './axiosInstance';

export const punchIn = () =>
  axiosInstance.post('/attendance/punch-in');

export const punchOut = () =>
  axiosInstance.patch('/attendance/punch-out');

export const getMyRecord = () =>
  axiosInstance.get('/attendance/me');

export const getAllRecords = (filter = {}) => {
  const params = new URLSearchParams(filter).toString();
  return axiosInstance.get(`/attendance/all${params ? '?' + params : ''}`);
}