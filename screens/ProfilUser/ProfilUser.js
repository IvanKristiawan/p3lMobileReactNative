import { useContext, useState } from "react";
import axios from "axios";
import { StyleSheet, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Input from "../../components/Auth/Input";
import { AuthContext, tempUrl } from "../../store/auth-context";
import { Colors } from "../../constants/styles";

function ProfilUser() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  return (
    <View style={styles.authContent}>
      {user ? (
        <View style={styles.form}>
          <View>
            {user.tipeUser !== "MEMBER" && (
              <Button
                onPress={() => navigation.navigate("UbahProfilUser")}
                title="Ubah Password"
              />
            )}
            <Input label="Username" value={user.username} editable={false} />
            <Input label="Alamat" value={user.alamat} editable={false} />
            <Input label="Telepon" value={user.telepon} editable={false} />
            <Input
              label="Tanggal Lahir"
              value={user.tanggalLahir}
              editable={false}
            />
            <Input label="Tipe" value={user.tipeUser} editable={false} />
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

export default ProfilUser;

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
