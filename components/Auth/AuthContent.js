import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    username: false,
    password: false,
    // email: false,
    // password: false,
    // confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials) {
    let { username, password } = credentials;
    // let { username, email, password, confirmPassword } = credentials;

    // email = email.trim();
    username = username.trim();
    password = password.trim();

    // const emailIsValid = email.includes("@");
    // const passwordIsValid = password.length > 1;
    // const passwordsAreEqual = password === confirmPassword;

    // if (
    //   !emailIsValid ||
    //   !passwordIsValid ||
    //   (!isLogin && (!passwordsAreEqual))
    // ) {
    //   Alert.alert("Invalid input", "Please check your entered credentials.");
    //   setCredentialsInvalid({
    //     email: !emailIsValid,
    //     confirmEmail: !emailIsValid,
    //     password: !passwordIsValid,
    //     confirmPassword: !passwordIsValid || !passwordsAreEqual,
    //   });
    //   return;
    // }
    onAuthenticate({ username, password });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
