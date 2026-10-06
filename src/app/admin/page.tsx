'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phone !== '7020273446') {
      setError('Unauthorized number.');
      return;
    }

    try {
      // Intended API call to external SMS provider (e.g., Twilio/MSG91)
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      if (!res.ok) {
        throw new Error('SMS Provider API Keys missing. Cannot send OTP.');
      }
      
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        throw new Error('Invalid or expired OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">TIRAJ ENTERPRISE Admin</h1>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter 7020273446"
                  required
                />
              </div>
              <button className="w-full bg-black text-white py-2 rounded font-medium">Secure Login (Requires SMS API)</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Enter OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button className="w-full bg-black text-white py-2 rounded font-medium">Verify & Login</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="text-red-600 font-medium hover:underline">Logout</button>
      </div>
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-8">
        <strong>Notice:</strong> Full CRUD operations (Add/Edit Products, Ad Management) require the database to be provisioned on a permanent hosting provider.
      </div>
    </div>
  )
}
