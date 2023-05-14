import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const tempUrl = "https://p3l200710588api.itkitapro.com";

export const AuthContext = createContext({
  user: "",
  // id: "",
  // username: "",
  // email: "",
  // token: "",
  isAuthenticated: false,
  authenticate: (user) => {},
  // authenticate: (token, id, username, email) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  // const [authToken, setAuthToken] = useState();
  // const [username, setUsername] = useState();
  // const [id, setId] = useState();
  // const [email, setEmail] = useState();

  // function authenticate(user, token, id, username, email) {
  function authenticate(user) {
    setUser(user);
    // setAuthToken(token);
    // setUsername(username);
    // setId(id);
    // setEmail(email);
    AsyncStorage.setItem("user", user);
    // AsyncStorage.setItem("id", id);
    // AsyncStorage.setItem("username", username);
    // AsyncStorage.setItem("email", email);
    // AsyncStorage.setItem("token", token);
  }

  function logout() {
    setUser(null);
    // setAuthToken(null);
    // setUsername(null);
    // setId(null);
    // setEmail(null);
    AsyncStorage.removeItem("user");
    // AsyncStorage.removeItem("token");
    // AsyncStorage.removeItem("id");
    // AsyncStorage.removeItem("username");
    // AsyncStorage.removeItem("email");
  }

  const value = {
    user: user,
    // id: id,
    // username: username,
    // email: email,
    // token: authToken,
    // isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
