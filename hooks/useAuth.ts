import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { removeCookies, deleteCookie } from "cookies-next";

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);
  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", {
        email,
        password,
      });
      setAuthState({
        data: res.data,
        error: null,
        loading: false,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.error,
        loading: false,
      });
    }
  };

  const signup = async (
    {
      firstName,
      lastName,
      email,
      password,
      city,
      phone,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      city: string;
      phone: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        city,
        phone,
      });
      setAuthState({
        data: res.data,
        error: null,
        loading: false,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.error,
        loading: false,
      });
    }
  };

  const signout = () => {
    // "removeCookies" has been deprecated and will be removed in future versions,
    // use "deleteCookie" instead.
    deleteCookie("jwt");
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  return { signin, signup, signout };
};

export default useAuth;
