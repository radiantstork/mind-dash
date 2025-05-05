import React, { createContext, useState, useEffect, useContext } from 'react';

type User = {
  isAuthenticated: boolean;
  id: string;
  username: string;
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    // Initialize with mock user if not authenticated
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : {
        isAuthenticated: false,
        id: 'local_anon',
        username: 'Guest'
      };
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return {
        isAuthenticated: false,
        id: 'local_anon',
        username: 'Guest'
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const value: UserContextType = {
    user,
    setUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}