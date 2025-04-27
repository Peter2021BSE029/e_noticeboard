// ./Tools/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ new loading state

  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        const name = await AsyncStorage.getItem('name');
        const role = await AsyncStorage.getItem('role');
        if (uid && name) {
          setUser({ uid, name, role: role || 'user' });
        }
      } catch (e) {
        console.log('Error loading user:', e);
      }
      setIsLoading(false); // ✅ done loading
    };
    loadUser();
  }, []);

  const login = async (uid, name, role = 'user') => {
    await AsyncStorage.setItem('uid', uid);
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('role', role);
    setUser({ uid, name, role });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['uid', 'name', 'role']);
    setUser(null);
  };

  const updateRole = async (newRole) => {
    if (!user) return;
    await AsyncStorage.setItem('role', newRole);
    setUser({ ...user, role: newRole });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
