import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../../services/authService';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegisterPayload, IRegisterRes } from '../../models/auth-model';
import { IApiRes } from '../../models/common';

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegisterPayload>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IRegisterPayload> = async (data) => {
    setLoading(true);

    try {
      const response: IApiRes<IRegisterRes> = await registerUser(data);
      if (response.status_code === 201) {
        toast.success(response.message);
        setLoading(false);
        navigate('/');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h2>

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
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 4,
                  message: 'Username must be at least 4 characters',
                },
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{String(errors?.username?.message)}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
                id="email"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email', {
                required: 'Email is required',
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for validating email format
                    message: 'Enter a valid email address',
                },
                })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{String(errors?.email?.message)}</p>
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
              {...register('password', { required: 'Password is required' ,
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters',
                }}
              )}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                errors.confirm_password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('confirm_password', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.confirm_password && (
              <p className="text-sm text-red-500 mt-1">{String(errors?.confirm_password?.message)}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
