import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, School, Membership } from '../types';

interface AuthContextType {
  user: User | null;
  activeSchool: School | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  login: (token: string, user: User, membership?: Membership) => void;
  logout: () => void;
  switchSchool: (school: School) => void;
  hasPermission: (key: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rithik_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeSchool, setActiveSchool] = useState<School | null>(() => {
    const saved = localStorage.getItem('rithik_school');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem('rithik_role') || null;
  });

  const [permissions, setPermissions] = useState<string[]>(['*']);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rithik_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rithik_user');
    }
  }, [user]);

  useEffect(() => {
    if (activeSchool) {
      localStorage.setItem('rithik_school', JSON.stringify(activeSchool));
    } else {
      localStorage.removeItem('rithik_school');
    }
  }, [activeSchool]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('rithik_role', role);
    } else {
      localStorage.removeItem('rithik_role');
    }
  }, [role]);

  const login = (token: string, loggedInUser: User, membership?: Membership) => {
    localStorage.setItem('token', token);
    setUser(loggedInUser);

    if (membership?.school) {
      setActiveSchool(membership.school);
      localStorage.setItem('active_school_id', String(membership.school.id));
    }

    if (membership?.role) {
      setRole(membership.role.name);
    } else {
      setRole(loggedInUser.user_type === 'platform' ? 'Super Admin' : 'School Admin');
    }

    setPermissions(['*']);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setActiveSchool(null);
    setRole(null);
    setPermissions([]);
  };

  const switchSchool = (school: School) => {
    setActiveSchool(school);
    localStorage.setItem('active_school_id', String(school.id));
  };

  const hasPermission = (_key: string): boolean => true;

  return (
    <AuthContext.Provider
      value={{
        user,
        activeSchool,
        role,
        permissions,
        isAuthenticated: !!user,
        login,
        logout,
        switchSchool,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
