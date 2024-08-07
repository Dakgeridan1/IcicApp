import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { ButtonGoForgotPassword } from "../components/Bottons.js";
import { ButtonGoRegister } from "../components/Bottons.js";
import { ButtonGoHome } from "../components/Bottons.js";
import { StatusBar } from "expo-status-bar";
import styles from "../styles/projectStyles.js";
//
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {firebaseConfig} from '../firebase-config.js';
import { auth } from '../firebase-config.js';
//
const app = initializeApp(firebaseConfig);

const UserLogin = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
 
// funcion para iniciar sesion pd: todavia no esta conectada al boton
const HandleSignIn = () => {

  if (email === "" || password === "") {
    Alert.alert('Por favor, ingrese su correo electrónico y contraseña.');
    return;
  }
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Alert.alert('Sesion iniciada');
    console.log(user);
    navigation.navigate("Home");
  }
   ).catch((error) => {

    Alert.alert('Error al iniciar sesion');
   });
  }
  return (
    <View style={styles.Maincontainer}>
      <View>
        <Image source={require("../assets/header.png")} style={styles.image} />
      </View>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subTitle}>Inicia sesión</Text>
      <TextInput 
      onChangeText={(text)=>setEmail(text)}
      style={styles.textInput} 
      placeholder="Correo electronico" />
      <TextInput
        onChangeText={(text)=>setPassword(text)}
        style={styles.textInput}
        placeholder="Contraseña"
        secureTextEntry={true}
      />
      <StatusBar style="auto" />
      <ButtonGoForgotPassword navigation={navigation} />
      <ButtonGoRegister navigation={navigation} />
      <ButtonGoHome navigation={navigation} handleSignIn={HandleSignIn} />
    </View>
  );
};
export default UserLogin;
