import React from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Styles from "../styles/StylesCourse";
import ProtectedScreen from '../components/userLogin'; // Ruta a tu componente de pantalla protegida

const HomeScreen = () => {
  return (
    <ProtectedScreen>
      <View style={Styles.Maincontainer}>
        <Text>Home Screen</Text>
        <StatusBar style="auto" />
      </View>
    </ProtectedScreen>
  );
};

export default HomeScreen;