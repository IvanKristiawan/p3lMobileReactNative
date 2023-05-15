import axios from "axios";
import { useContext, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext, tempUrl } from "../store/auth-context";

function LoginScreen() {
  const navigation = useNavigation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ username, password }) {
    setIsAuthenticating(true);
    try {
      try {
        const token = await axios.post(`${tempUrl}/auth/login`, {
          username: username,
          password: password,
        });
        authCtx.authenticate(token.data.details);
        setIsAuthenticating(false);
        navigation.navigate("Welcome");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
