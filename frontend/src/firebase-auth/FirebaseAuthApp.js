// src/firebase-auth/FirebaseAuthApp.js

import React, { useState, useEffect } from 'react';
import { onAuthChange } from './mockAuthFunctions';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Pot_O_GoldDashboard from '../components/Pot_O_GoldDashboard';

function FirebaseAuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false); // Toggle between login and signup

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-emerald-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        // User is logged in - show dashboard
        <Pot_O_GoldDashboard 
          user={user} 
          onLogout={() => {
            sessionStorage.removeItem('mockUser');
            setUser(null);
          }} 
        />
      ) : showSignUp ? (
        // Show Sign Up Form
        <SignUpForm 
          onSignUpSuccess={(newUser) => {
            setUser(newUser);
            setShowSignUp(false);
          }}
          onBackToLogin={() => setShowSignUp(false)}
        />
      ) : (
        // Show Login Form
        <LoginForm 
          onLoginSuccess={(loggedInUser) => {
            sessionStorage.setItem('mockUser', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
          }}
          onSignUp={() => setShowSignUp(true)} // ← THIS WAS MISSING!
        />
      )}
    </div>
  );
}

export default FirebaseAuthApp;