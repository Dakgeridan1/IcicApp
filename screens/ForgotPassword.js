import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import styles from "../styles/projectStyles.js";
import { StatusBar } from "expo-status-bar";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config.js';
import { ButtonChangePassword } from '../components/Bottons.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(firebaseConfig);

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const auth = getAuth(app);

  const handlePasswordReset = useCallback(() => {
    if (email === "") {
      Alert.alert('Por favor, ingrese su correo electrónico.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(async () => {
        Alert.alert('Correo de restablecimiento de contraseña enviado. Por favor, revise su bandeja de entrada.');
        setIsButtonDisabled(true);
        const expiryTime = Date.now() + 60 * 1000; // 60 seconds from now
        await AsyncStorage.setItem('expiryTime', JSON.stringify(expiryTime));
        setTimeLeft(60); // Set 60 seconds timer
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error al enviar el correo de restablecimiento: ' + error.message);
      });
  }, [email, auth]);

  useEffect(() => {
    const checkExpiry = async () => {
      const storedExpiryTime = await AsyncStorage.getItem('expiryTime');
      if (storedExpiryTime) {
        const expiryTime = JSON.parse(storedExpiryTime);
        const currentTime = Date.now();
        if (currentTime < expiryTime) {
          const remainingTime = Math.ceil((expiryTime - currentTime) / 1000);
          setTimeLeft(remainingTime);
          setIsButtonDisabled(true);
        } else {
          setIsButtonDisabled(false);
          await AsyncStorage.removeItem('expiryTime');
        }
      }
    };
    checkExpiry();
  }, []);

  useEffect(() => {
    let timer;
    if (isButtonDisabled) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            AsyncStorage.removeItem('expiryTime');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isButtonDisabled]);

  return (
    <View style={styles.Maincontainer}>
      <View>
        <Image
          source={require("../assets/header.png")}
          style={styles.imageSignUp}
        />
      </View>
      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      <Text style={styles.subTitle}>Introduce tu correo y te enviaremos</Text>
      <Text style={styles.subTitle}>instrucciones para restablecer tu contraseña</Text>
      <TextInput 
        style={styles.textInput}
        placeholder="E-Mail"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <ButtonChangePassword handlePasswordReset={handlePasswordReset} isButtonDisabled={isButtonDisabled} timeLeft={timeLeft} />
      <StatusBar style="auto" />
    </View>
  );
};

export default ForgotPassword;
