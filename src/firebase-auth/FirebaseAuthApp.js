// src/firebase-auth/FirebaseAuthApp.js

import React, { useState, useEffect } from 'react';
import { onAuthChange } from './mockAuthFunctions';
import LoginForm from './LoginForm';
import Pot_O_GoldDashboard from '../components/Pot_O_GoldDashboard';

function FirebaseAuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <Pot_O_GoldDashboard user={user} onLogout={() => {
          sessionStorage.removeItem('mockUser');
          setUser(null);
        }} />
      ) : (
        <LoginForm 
          onLoginSuccess={(loggedInUser) => {
            sessionStorage.setItem('mockUser', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
          }} 
        />
      )}
    </div>
  );
}

export default FirebaseAuthApp;