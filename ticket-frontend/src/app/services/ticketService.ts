import { environment } from "../../environments/environment";
import axiosInstance from "../interceptors/token-interceptor";
import { IRegisterRes } from "../models/auth-model";
import { IApiRes } from "../models/common";
import { ITicket, ITicketPayload, IUser } from "../models/ticket-model";


const baseURL = environment.rootUrl

export const createTicket = async (payload: ITicketPayload) => {
  try {
    const response = await axiosInstance.post(`${baseURL}/v1/tickets/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data :IApiRes<ITicket> = response.data
    return data; 
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
};

export const getTickets = async (params: any) => {
  try {    
    const response = await axiosInstance.get(`${baseURL}/v1/tickets/`,{params});
    const data : IApiRes<ITicket[]> = response.data
    return data; 
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error; 
  }
};

export const updateTicket = async (id:string,payload: ITicketPayload) => {
  try {
    const response = await axiosInstance.put(`${baseURL}/v1/tickets/${id}/`, payload);
    const data :IApiRes<ITicket> = response.data
    return data; 
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error; 
  }
};

export const getTicketById = async (id:string) => {
  try {    
    const response = await axiosInstance.get(`${baseURL}/v1/tickets/${id}/`);
    const data : IApiRes<ITicket> = response.data
    return data; 
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error; 
  }
};

export const deleteTicket = async (id:string) => {
  try {    
    const response = await axiosInstance.delete(`${baseURL}/v1/tickets/${id}/`);
    const data : IApiRes<ITicket> = response.data
    return data; 
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

export const getUsersList = async () => {
  try {    
    const response = await axiosInstance.get(`${baseURL}/users/`);
    const data : IApiRes<IUser[]> = response.data
    return data; 
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error; 
  }
};

export const editPermissions = async (id:string, payload: string[]) => {
  try {        
    const response = await axiosInstance.patch(`${baseURL}/users/${id}/permissions/`,payload);
    const data : IApiRes<IRegisterRes> = response.data
    return data; 
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error; 
  }
};

