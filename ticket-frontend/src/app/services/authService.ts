import axios from 'axios';
import { ILoginPayload } from '../models/auth-model';
import { environment } from '../../environments/environment';
import toast from 'react-hot-toast';

const API_BASE_URL = environment.rootUrl;

export const loginUser = async (payload: ILoginPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message ?? 'Oops!! Some Error Occured');
      throw error.response; 
    } else {
      throw error; 
    }
  }
};


export const registerUser = async (payload:ILoginPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error:any) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message ?? 'Oops!! Some Error Occured');
      throw error.response; 
    } else {
      throw error; 
    }
  }
};
