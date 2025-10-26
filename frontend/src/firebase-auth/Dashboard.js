// src/firebase-auth/Dashboard.js

import React from 'react';
import { logOut } from './authFunctions';

const Dashboard = ({ user, onLogout }) => {
  
  const handleLogout = async () => {
    await logOut();
    onLogout();
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '50px auto', 
      padding: '30px' 
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px', 
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🎉 Welcome Back!</h1>
        <p style={{ fontSize: '18px', margin: '0' }}>
          You're successfully logged in with Firebase
        </p>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: '0' }}>Your Profile Information</h2>
        
        <div style={{ fontSize: '16px', lineHeight: '2' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
          <p><strong>Email Verified:</strong> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Account Created:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          <p><strong>Last Sign In:</strong> {new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{ 
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Dashboard;