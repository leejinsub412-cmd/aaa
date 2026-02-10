
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { AuthView } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} />;
  }

  // Initial landing view before showing auth forms
  if (!showAuthForm) {
    return (
      <div className="min-h-screen flex flex-col selection:bg-white selection:text-black bg-black">
        {/* Nav */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center transition-transform group-hover:scale-110">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black"></div>
              </div>
              <span className="font-bold text-lg tracking-tighter">NexAuth</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { setCurrentView('login'); setShowAuthForm(true); }}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => { setCurrentView('signup'); setShowAuthForm(true); }}
                className="px-4 py-1.5 bg-white text-black rounded-md text-sm font-bold hover:bg-gray-200 transition-all transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-20">
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-medium tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Security Engine v2.5 is now live
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Develop. Secure.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-t from-white/40 to-white">Ship Fast.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
              NexAuth provides the essential infrastructure for modern applications. Secure by default, scalable to millions, and effortless to integrate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button 
                onClick={() => { setCurrentView('signup'); setShowAuthForm(true); }}
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-all text-lg shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Start Building
              </button>
              <button 
                className="w-full sm:w-auto px-10 py-4 bg-black border border-white/10 text-white font-bold rounded-md hover:bg-white/5 transition-all text-lg"
              >
                Read Documentation
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-32 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 opacity-30 hover:opacity-100 transition-opacity duration-500 pb-20">
            {['TRUSTED SECURITY', 'GDPR COMPLIANT', 'SAML SSO', '24/7 SUPPORT'].map(item => (
              <div key={item} className="text-[10px] font-black tracking-[0.3em] text-center border-t border-white/10 pt-4">
                {item}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Auth View
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-black selection:bg-white selection:text-black">
      <button 
        onClick={() => setShowAuthForm(false)}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        <div className="mb-12 flex justify-center">
           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
              <div className="w-6 h-6 bg-black rotate-45"></div>
           </div>
        </div>
        
        <div className="border border-white/10 bg-black rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
          {currentView === 'login' ? (
            <Login onSwitch={() => setCurrentView('signup')} />
          ) : (
            <Signup onSwitch={() => setCurrentView('login')} />
          )}
        </div>

        <p className="mt-8 text-center text-white/20 text-xs font-medium tracking-widest uppercase">
          Protected by NexAuth Cloud Sentinel
        </p>
      </div>
    </div>
  );
};

export default App;
