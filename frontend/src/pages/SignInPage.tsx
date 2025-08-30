import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

const SignInPage: React.FC = () => {
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP
  const [email, setEmail] = useState('jonas.kahnwald@gmail.com');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signin', { email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/verify', { email, otp });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed. Invalid OTP or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* This new div wraps everything to control alignment and width */}
      <div className="w-full max-w-xs mx-auto">
        {/* Header is now here */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold">HD</h1>
        </div>
      
        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
        <p className="text-gray-500 mb-6">Please login to continue to your account.</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded-md">{error}</p>}

        {/* --- Google Sign-In Button --- */}
        <div className="my-4">
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.518-11.186-8.214l-6.57 4.82C9.656 39.663 16.318 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.591l6.19 5.238C42.612 35.836 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            Sign in with Google
          </a>
        </div>

        {/* --- Separator --- */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with your email</span>
          </div>
        </div>

        {/* --- Email & OTP Form --- */}
        {step === 1 && (
          <form onSubmit={handleGetOtp}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            <Button type="submit" isLoading={loading}>
              Continue with Email
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignIn}>
                  <div className="mb-4">
                  <p className="text-sm text-gray-600">An OTP has been sent to <span className="font-semibold">{email}</span>.</p>
                  <p className="text-xs text-gray-500 mt-1">Please check your spam folder if you don't see it in your inbox.</p>
                  </div>
            <Input
              label="OTP"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />
            <div className="flex items-center justify-between my-4">
              <a href="#" onClick={(e) => { e.preventDefault(); handleGetOtp(e); }} className="text-sm text-blue-600 hover:underline">
                Resend OTP
              </a>
            </div>
             <Button type="submit" isLoading={loading}>
              Verify & Sign in
            </Button>
          </form>
        )}

        <p className="text-sm text-center text-gray-600 mt-8">
          Need an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;