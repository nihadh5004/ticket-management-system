import axios from 'axios'
import { jwtDecode } from "jwt-decode";

import dayjs from 'dayjs'
import { environment } from '../../environments/environment';



const baseURL = environment.rootUrl
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosInstance = axios.create({
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(async req => {
    
    const accessToken = localStorage.getItem('accessToken')
    if(!accessToken){   
        window.location.href = '/'
    }
    const user = jwtDecode(accessToken ?? '')

    const isExpired = user.exp ? dayjs.unix(user.exp).diff(dayjs()) < 1 : true;
    if (!isExpired){
        req.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
        return req
    }

    try {
        const response = await axios.post(
          `${baseURL}/refresh-token/`,
          {
            "refresh": localStorage.getItem('refreshToken'),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            cancelToken: source.token, 
          }
        );
        localStorage.setItem('accessToken', response.data.data.access);
        localStorage.setItem('refreshToken', response.data.data.refresh);
        req.headers.Authorization = `Bearer ${response.data.data.access}`;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error refreshing the token:', error);
          localStorage.clear()
          window.location.href = '/';

          
        }
      }
      return req;
    })


export default axiosInstance;