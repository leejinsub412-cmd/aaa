
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginProps {
  onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/40 text-sm font-medium">Log in to your account to continue.</p>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-lg mb-6 animate-shake font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase tracking-widest block ml-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl focus:bg-white/5 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-white/20"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest block">Password</label>
            <button type="button" className="text-xs text-white/30 hover:text-white transition-colors">Forgot?</button>
          </div>
          <input
            type="password"
            required
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl focus:bg-white/5 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-white/20"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
          ) : 'Continue'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-white/5 text-center">
        <p className="text-white/40 text-sm font-medium">
          Don't have an account?{' '}
          <button 
            onClick={onSwitch}
            className="text-white hover:underline underline-offset-4 font-bold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
