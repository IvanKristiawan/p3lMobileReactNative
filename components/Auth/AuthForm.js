import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import Input from "./Input";

function AuthForm({ isLogin, onSubmit }) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "username":
        setEnteredUsername(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      username: enteredUsername,
      password: enteredPassword,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        <Text>GOFIT</Text>
        <Input
          label="Username"
          onUpdateValue={updateInputValueHandler.bind(this, "username")}
          value={enteredUsername}
        />
        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          secure
          value={enteredPassword}
        />
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>Log In</Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
