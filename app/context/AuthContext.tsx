"use client";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface AuthState {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface SetAuthState extends AuthState {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthenticationContext = createContext<SetAuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = getCookie("jwt");

      if (!token)
        return setAuthState({
          loading: false,
          data: null,
          error: null,
        });

      const res = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

      setAuthState({
        loading: false,
        data: res.data,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.error,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthContext;
