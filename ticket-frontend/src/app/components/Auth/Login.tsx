import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../../services/authService';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ILoginPayload, ILoginRes } from '../../models/auth-model';
import { IApiRes } from '../../models/common';

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginPayload>();
  const [loading, setLoading] = useState(false);

  const onSubmit:SubmitHandler<ILoginPayload> = async (data) => {
    setLoading(true);

    try {
      const response:IApiRes<ILoginRes> = await loginUser(data);
      if(response.status_code === 200){
        const { access, refresh, user_type } = response.data;
  
        localStorage.clear();
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('userType', user_type);
  
        setLoading(false);
        navigate('/dashboard');
      }else{
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
    } 
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{String(errors?.username?.message)}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Signup
          </Link>
        </p>
      </div>

     
    </div>
  );
}
