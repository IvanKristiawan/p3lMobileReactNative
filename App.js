import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import ProfilUser from "./screens/ProfilUser/ProfilUser";
import UbahProfilUser from "./screens/ProfilUser/UbahProfilUser";
import TampilIzinInstruktur from "./screens/Master/IzinInstruktur/TampilIzinInstruktur";
import TambahIzinInstruktur from "./screens/Master/IzinInstruktur/TambahIzinInstruktur";
import TampilBookingKelas from "./screens/Master/BookingKelas/TampilBookingKelas";
import TambahBookingKelas from "./screens/Master/BookingKelas/TambahBookingKelas";
import AuthContentProvider, { AuthContext } from "./store/auth-context";

// Sidebar
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <AuthContentProvider>
        <NavigationContainer>
          <Drawer.Navigator useLegacyImplementation initialRouteName="Login">
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                drawerItemStyle: { height: 0 },
              }}
            />
            <Drawer.Screen name="Profil User" component={ProfilUser} />
            <Drawer.Screen
              name="UbahProfilUser"
              component={UbahProfilUser}
              options={{
                drawerItemStyle: { height: 0 },
              }}
            />
            <Drawer.Screen
              name="Izin Instruktur"
              component={TampilIzinInstruktur}
            />
            <Drawer.Screen
              name="TambahIzinInstruktur"
              component={TambahIzinInstruktur}
              options={{
                drawerItemStyle: { height: 0 },
              }}
            />
            <Drawer.Screen
              name="Booking Kelas"
              component={TampilBookingKelas}
            />
            <Drawer.Screen
              name="TambahBookingKelas"
              component={TambahBookingKelas}
              options={{
                drawerItemStyle: { height: 0 },
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </AuthContentProvider>
    </>
  );
}
