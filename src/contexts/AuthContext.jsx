import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const initialState = { isAuth: false, user: null };

const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const UserProfile = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setState({
        isAuth: true,
        user: JSON.parse(storedUser),
      });
    } else {
      setState(initialState);
    }
  }, []);
  
  useEffect(() => {
    UserProfile();
    setIsAppLoading(false);
  }, [UserProfile]);
  
  const handleLogin = async (data) => {
    try {
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setState({ isAuth: true, user: data.user });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (data) => {
    try {
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setState({ isAuth: true, user: data.user });
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState(initialState);
  }, []);

  return (
    <AuthContext.Provider
      value={{Authstate: state,setContextState:setState,isAppLoading,handleLogin,handleRegister,handleLogout,}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
