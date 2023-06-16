import axios from 'axios';
import queryString from 'query-string';
import { AutomatedCallStatusInterface, AutomatedCallStatusGetQueryInterface } from 'interfaces/automated-call-status';
import { GetQueryInterface } from '../../interfaces';

export const getAutomatedCallStatuses = async (query?: AutomatedCallStatusGetQueryInterface) => {
  const response = await axios.get(`/api/automated-call-statuses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAutomatedCallStatus = async (automatedCallStatus: AutomatedCallStatusInterface) => {
  const response = await axios.post('/api/automated-call-statuses', automatedCallStatus);
  return response.data;
};

export const updateAutomatedCallStatusById = async (id: string, automatedCallStatus: AutomatedCallStatusInterface) => {
  const response = await axios.put(`/api/automated-call-statuses/${id}`, automatedCallStatus);
  return response.data;
};

export const getAutomatedCallStatusById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/automated-call-statuses/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteAutomatedCallStatusById = async (id: string) => {
  const response = await axios.delete(`/api/automated-call-statuses/${id}`);
  return response.data;
};
