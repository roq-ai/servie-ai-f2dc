import axios from 'axios';
import queryString from 'query-string';
import { AutomatedCallRuleInterface, AutomatedCallRuleGetQueryInterface } from 'interfaces/automated-call-rule';
import { GetQueryInterface } from '../../interfaces';

export const getAutomatedCallRules = async (query?: AutomatedCallRuleGetQueryInterface) => {
  const response = await axios.get(`/api/automated-call-rules${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAutomatedCallRule = async (automatedCallRule: AutomatedCallRuleInterface) => {
  const response = await axios.post('/api/automated-call-rules', automatedCallRule);
  return response.data;
};

export const updateAutomatedCallRuleById = async (id: string, automatedCallRule: AutomatedCallRuleInterface) => {
  const response = await axios.put(`/api/automated-call-rules/${id}`, automatedCallRule);
  return response.data;
};

export const getAutomatedCallRuleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/automated-call-rules/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAutomatedCallRuleById = async (id: string) => {
  const response = await axios.delete(`/api/automated-call-rules/${id}`);
  return response.data;
};
