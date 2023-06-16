import axios from 'axios';
import queryString from 'query-string';
import { ResidentInterface, ResidentGetQueryInterface } from 'interfaces/resident';
import { GetQueryInterface } from '../../interfaces';

export const getResidents = async (query?: ResidentGetQueryInterface) => {
  const response = await axios.get(`/api/residents${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createResident = async (resident: ResidentInterface) => {
  const response = await axios.post('/api/residents', resident);
  return response.data;
};

export const updateResidentById = async (id: string, resident: ResidentInterface) => {
  const response = await axios.put(`/api/residents/${id}`, resident);
  return response.data;
};

export const getResidentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/residents/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteResidentById = async (id: string) => {
  const response = await axios.delete(`/api/residents/${id}`);
  return response.data;
};
