
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

interface SignupProps {
  onSwitch: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-white/40 text-sm font-medium">Start your journey with NexAuth.</p>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-lg mb-6 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl focus:bg-white/5 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-white/20"
            placeholder="John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl focus:bg-white/5 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-white/20"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Password</label>
          <input
            type="password"
            required
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl focus:bg-white/5 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-white/20"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
          ) : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-white/5 text-center">
        <p className="text-white/40 text-sm font-medium">
          Already have an account?{' '}
          <button 
            onClick={onSwitch}
            className="text-white hover:underline underline-offset-4 font-bold"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
