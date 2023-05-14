import axios from "axios";
import { useContext, useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
// import { createUser } from "../util/auth";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ username, email, password }) {
    setIsAuthenticating(true);
    try {
      // const token = await createUser(email, password);
      const register = await axios.post(
        `https://authentication-web-mobile.herokuapp.com/auth/register`,
        {
          username: username,
          email: email,
          password: password,
        }
      );
      const token = await axios.post(
        `https://authentication-web-mobile.herokuapp.com/auth/login`,
        {
          email: email,
          password: password,
        }
      );
      // authCtx.authenticate(token);
      authCtx.authenticate(
        token.data.details.token,
        token.data.details._id,
        token.data.details.username,
        token.data.details.email
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Authentication failed!",
        "Could not create user, please chck your input and try again later"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
