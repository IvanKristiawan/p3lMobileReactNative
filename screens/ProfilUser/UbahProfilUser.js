import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, View, Button, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Input from "../../components/Auth/Input";
import { AuthContext, tempUrl } from "../../store/auth-context";
import { Colors } from "../../constants/styles";

function UbahProfilUser() {
  const [username, setUsername] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${user.id}`, {
      _id: user.id,
      token: user.token,
    });
    setUsername(response.data.username);
    setAlamat(response.data.alamat);
    setTelepon(response.data.telepon);
    setTanggalLahir(response.data.tanggalLahir);
    setTipeUser(response.data.tipeUser);
    setPassword(response.data.tanggalLahir);
    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (password.length === 0) {
      setPassword(user.password);
    }
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/users/${user.id}`, {
        password,
        _id: user.id,
        token: user.token,
      });
      setLoading(false);
      logoutButtonHandler();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  return (
    <View style={styles.authContent}>
      {user ? (
        <View style={styles.form}>
          <View>
            <Input label="Username" value={user.username} editable={false} />
            <Input label="Alamat" value={user.alamat} editable={false} />
            <Input label="Telepon" value={user.telepon} editable={false} />
            <Input
              label="Tanggal Lahir"
              value={user.tanggalLahir}
              editable={false}
            />
            <Input label="Tipe" value={user.tipeUser} editable={false} />
            <TextInput
              label="Password"
              onSelectionChange={(e) => setPassword(e.nativeEvent.selection)}
              value={password}
            />
            {user.tipeUser === "MEMBER" && (
              <>
                <Input label="Deposit" value={user.deposit} editable={false} />
                <Input
                  label="Masa Berlaku"
                  value={user.masaBerlaku}
                  editable={false}
                />
              </>
            )}
            <Button
              onPress={() => navigation.navigate("Notifications")}
              title="Ubah"
            />
          </View>
        </View>
      ) : (
        <View>
          <Text>Unauthorize!</Text>
        </View>
      )}
    </View>
  );
}

export default UbahProfilUser;

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

// const styles = StyleSheet.create({
//   buttons: {
//     marginTop: 12,
//   },
// });
