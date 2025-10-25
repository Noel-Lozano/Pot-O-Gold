// src/firebase-auth/mockAuthFunctions.js

// Fake user database
const mockUsers = [
  {
    uid: '1',
    email: 'noellozano@miners.utep.edu',
    password: 'root',
    displayName: 'Noel Lozano'
  },
  {
    uid: '2',
    email: 'andresestrada@miners.utep.edu',
    password: 'root',
    displayName: 'Andres Estrada'
  },
  {
    uid: '3',
    email: 'ruicamou@miners.utep.edu',
    password: 'root',
    displayName: 'Rui Camou'
  },
  {
    uid: '4',
    email: 'saulburns@miners.utep.edu',
    password: 'root',
    displayName: 'Saul Burns'
  }
];

// Mock sign in function
export const signIn = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return { 
      user: {
        ...userWithoutPassword,
        emailVerified: true,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        }
      }, 
      error: null 
    };
  }
  
  return { 
    user: null, 
    error: 'Firebase: Error (auth/invalid-credential).' 
  };
};

// Mock sign out
export const logOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { error: null };
};

// Mock auth state listener - using sessionStorage instead of localStorage
export const onAuthChange = (callback) => {
  // Check if user is stored in sessionStorage (clears when browser closes)
  const savedUser = sessionStorage.getItem('mockUser');
  if (savedUser) {
    callback(JSON.parse(savedUser));
  } else {
    callback(null);
  }
  
  return () => {};
};