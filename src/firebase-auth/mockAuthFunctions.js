// src/firebase-auth/mockAuthFunctions.js

// Initial mock users (hardcoded for testing)
const initialMockUsers = [
  {
    uid: '1',
    _id: '1',
    email: 'user@example.com',
    password: 'password123',
    displayName: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    address: {
      street_number: '456',
      street_name: 'Demo Street',
      city: 'El Paso',
      state: 'TX',
      zip: '79901'
    }
  },
  {
    uid: '2',
    _id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    displayName: 'Admin User',
    first_name: 'Admin',
    last_name: 'User',
    address: {
      street_number: '789',
      street_name: 'Admin Ave',
      city: 'El Paso',
      state: 'TX',
      zip: '79902'
    }
  },
  {
    uid: '3',
    _id: '3',
    email: 'demo@example.com',
    password: 'demo123',
    displayName: 'Demo User',
    first_name: 'Demo',
    last_name: 'User',
    address: {
      street_number: '321',
      street_name: 'Test Road',
      city: 'El Paso',
      state: 'TX',
      zip: '79903'
    }
  }
];

// Initialize localStorage with default users if empty
const initializeUsers = () => {
  const storedUsers = localStorage.getItem('allMockUsers');
  if (!storedUsers) {
    localStorage.setItem('allMockUsers', JSON.stringify(initialMockUsers));
    return initialMockUsers;
  }
  return JSON.parse(storedUsers);
};

// Get all users (including passwords - internal use only)
const getAllUsersWithPasswords = () => {
  return initializeUsers();
};

// Save a new user to localStorage
export const saveUser = (userData) => {
  const allUsers = getAllUsersWithPasswords();
  allUsers.push(userData);
  localStorage.setItem('allMockUsers', JSON.stringify(allUsers));
};

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Mock sign in function
export const signIn = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allUsers = getAllUsersWithPasswords();
  const user = allUsers.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return { 
      user: {
        ...userWithoutPassword,
        emailVerified: true,
        metadata: {
          creationTime: user.metadata?.creationTime || new Date().toISOString(),
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

// Mock auth state listener
export const onAuthChange = (callback) => {
  const savedUser = sessionStorage.getItem('mockUser');
  if (savedUser) {
    callback(JSON.parse(savedUser));
  } else {
    callback(null);
  }
  
  return () => {};
};

// ============================================
// USER GETTER FUNCTIONS (For retrieving user data)
// ============================================

/**
 * Get the currently logged-in user
 * @returns {Object|null} Current user object or null
 * 
 * Example usage:
 * const user = getCurrentUser();
 * console.log(user.first_name); // "John"
 * console.log(user.email); // "user@example.com"
 */
export const getCurrentUser = () => {
  const savedUser = sessionStorage.getItem('mockUser');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
};

/**
 * Get current user's first name
 * @returns {string|null} First name or null
 * 
 * Example: const firstName = getUserFirstName(); // "John"
 */
export const getUserFirstName = () => {
  const user = getCurrentUser();
  return user?.first_name || null;
};

/**
 * Get current user's last name
 * @returns {string|null} Last name or null
 * 
 * Example: const lastName = getUserLastName(); // "Doe"
 */
export const getUserLastName = () => {
  const user = getCurrentUser();
  return user?.last_name || null;
};

/**
 * Get current user's full name
 * @returns {string|null} Full name or null
 * 
 * Example: const fullName = getUserFullName(); // "John Doe"
 */
export const getUserFullName = () => {
  const user = getCurrentUser();
  if (user?.first_name && user?.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user?.displayName || null;
};

/**
 * Get current user's email
 * @returns {string|null} Email or null
 * 
 * Example: const email = getUserEmail(); // "user@example.com"
 */
export const getUserEmail = () => {
  const user = getCurrentUser();
  return user?.email || null;
};

/**
 * Get current user's address
 * @returns {Object|null} Address object or null
 * 
 * Example: 
 * const address = getUserAddress();
 * console.log(address.city); // "El Paso"
 * console.log(address.state); // "TX"
 */
export const getUserAddress = () => {
  const user = getCurrentUser();
  return user?.address || null;
};

/**
 * Get current user's street number
 * @returns {string|null} Street number or null
 * 
 * Example: const streetNum = getUserStreetNumber(); // "123"
 */
export const getUserStreetNumber = () => {
  const user = getCurrentUser();
  return user?.address?.street_number || null;
};

/**
 * Get current user's street name
 * @returns {string|null} Street name or null
 * 
 * Example: const streetName = getUserStreetName(); // "Hackathon Ave"
 */
export const getUserStreetName = () => {
  const user = getCurrentUser();
  return user?.address?.street_name || null;
};

/**
 * Get current user's full street address
 * @returns {string|null} Full street address or null
 * 
 * Example: const street = getUserStreet(); // "123 Hackathon Ave"
 */
export const getUserStreet = () => {
  const user = getCurrentUser();
  if (user?.address?.street_number && user?.address?.street_name) {
    return `${user.address.street_number} ${user.address.street_name}`;
  }
  return null;
};

/**
 * Get current user's city
 * @returns {string|null} City or null
 * 
 * Example: const city = getUserCity(); // "El Paso"
 */
export const getUserCity = () => {
  const user = getCurrentUser();
  return user?.address?.city || null;
};

/**
 * Get current user's state
 * @returns {string|null} State or null
 * 
 * Example: const state = getUserState(); // "TX"
 */
export const getUserState = () => {
  const user = getCurrentUser();
  return user?.address?.state || null;
};

/**
 * Get current user's ZIP code
 * @returns {string|null} ZIP code or null
 * 
 * Example: const zip = getUserZip(); // "79901"
 */
export const getUserZip = () => {
  const user = getCurrentUser();
  return user?.address?.zip || null;
};

/**
 * Get current user's full address formatted as a string
 * @returns {string|null} Full formatted address or null
 * 
 * Example: 
 * const fullAddress = getUserFullAddress();
 * // "123 Hackathon Ave, El Paso, TX 79901"
 */
export const getUserFullAddress = () => {
  const user = getCurrentUser();
  const addr = user?.address;
  if (addr) {
    return `${addr.street_number} ${addr.street_name}, ${addr.city}, ${addr.state} ${addr.zip}`;
  }
  return null;
};

/**
 * Get current user's ID
 * @returns {string|null} User ID or null
 * 
 * Example: const userId = getUserId(); // "user_1234567890"
 */
export const getUserId = () => {
  const user = getCurrentUser();
  return user?._id || user?.uid || null;
};

/**
 * Get when user account was created
 * @returns {string|null} Creation date or null
 * 
 * Example: const created = getUserCreationDate(); // "2025-01-15T10:30:00.000Z"
 */
export const getUserCreationDate = () => {
  const user = getCurrentUser();
  return user?.metadata?.creationTime || null;
};

/**
 * Get when user last signed in
 * @returns {string|null} Last sign in date or null
 * 
 * Example: const lastLogin = getUserLastSignIn(); // "2025-01-20T14:25:00.000Z"
 */
export const getUserLastSignIn = () => {
  const user = getCurrentUser();
  return user?.metadata?.lastSignInTime || null;
};

/**
 * Check if user email is verified
 * @returns {boolean} True if verified, false otherwise
 * 
 * Example: const isVerified = isUserEmailVerified(); // true
 */
export const isUserEmailVerified = () => {
  const user = getCurrentUser();
  return user?.emailVerified || false;
};

/**
 * Get all user data as an object
 * @returns {Object|null} Complete user object or null
 * 
 * Example:
 * const userData = getUserData();
 * console.log(userData.first_name);
 * console.log(userData.address.city);
 */
export const getUserData = () => {
  return getCurrentUser();
};

// ============================================
// JSON FILE MANAGEMENT
// ============================================

/**
 * Download all users as a JSON file
 * This creates a downloadable JSON file with all user data
 * 
 * Example usage: downloadUsersToJSON();
 */
export const downloadUsersToJSON = () => {
  const allUsers = getAllUsersWithPasswords();
  
  // Remove passwords for security (optional - keep them if you want to import later)
  const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
  
  // Or keep passwords if you want to be able to import and login:
  // const usersData = allUsers;
  
  const jsonData = JSON.stringify(allUsers, null, 2); // Pretty print with 2 spaces
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `pot_o_gold_users_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('✅ Users exported to JSON file');
};

/**
 * Import users from a JSON file
 * @param {File} file - The JSON file to import
 * @returns {Promise} Promise that resolves with result
 * 
 * Example usage:
 * <input type="file" onChange={(e) => importUsersFromJSON(e.target.files[0])} />
 */
export const importUsersFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedUsers = JSON.parse(event.target.result);
        
        if (!Array.isArray(importedUsers)) {
          reject({ success: false, message: 'Invalid JSON format. Expected an array of users.' });
          return;
        }
        
        const existingUsers = getAllUsersWithPasswords();
        const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
        
        let addedCount = 0;
        let skippedCount = 0;
        
        importedUsers.forEach(user => {
          if (!existingEmails.has(user.email.toLowerCase())) {
            // Add default password if not present
            if (!user.password) {
              user.password = 'changeme123';
            }
            existingUsers.push(user);
            existingEmails.add(user.email.toLowerCase());
            addedCount++;
          } else {
            skippedCount++;
          }
        });
        
        localStorage.setItem('allMockUsers', JSON.stringify(existingUsers));
        
        resolve({ 
          success: true, 
          message: `✅ Imported ${addedCount} users. Skipped ${skippedCount} duplicates.`,
          addedCount,
          skippedCount
        });
      } catch (error) {
        reject({ success: false, message: `❌ Error parsing JSON: ${error.message}` });
      }
    };
    
    reader.onerror = () => {
      reject({ success: false, message: '❌ Error reading file' });
    };
    
    reader.readAsText(file);
  });
};

/**
 * Save current users to a JSON file automatically
 * Call this after sign up or when you want to backup
 */
export const autoSaveToJSON = () => {
  downloadUsersToJSON();
};