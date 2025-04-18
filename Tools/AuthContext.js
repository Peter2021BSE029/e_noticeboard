// Tools/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const uid = await AsyncStorage.getItem('uid');
      const name = await AsyncStorage.getItem('name');
      if (uid && name) {
        setUser({ uid, name });
      }
    };
    loadUser();
  }, []);

  const login = async (uid, name) => {
    await AsyncStorage.setItem('uid', uid);
    await AsyncStorage.setItem('name', name);
    setUser({ uid, name });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('uid');
    await AsyncStorage.removeItem('name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
