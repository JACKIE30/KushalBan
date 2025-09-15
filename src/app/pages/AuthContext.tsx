'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'supervisor';
  department: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'officer' | 'supervisor';
  department: string;
  employeeId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication - In a real app, this would connect to your backend
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Forest Admin',
    email: 'admin@fra.gov.in',
    password: 'admin123',
    role: 'admin',
    department: 'Forest Rights Administration'
  },
  {
    id: '2',
    name: 'Field Officer',
    email: 'officer@fra.gov.in',
    password: 'officer123',
    role: 'officer',
    department: 'Field Operations'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return false;
    }

    // In a real app, you would send this to your backend
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department
    };

    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}