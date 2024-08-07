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
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/projectStyles.js";

function ButtonGoHome({ navigation, handleSignIn }) {
  return (
    <TouchableOpacity onPress={handleSignIn} style={styles.containerBL}>
      <LinearGradient
        colors={["#c9242b", "#c9242b", "#c9242b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonBL}
      >
        <Text style={styles.textBL}>Acceso</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function ButtonGoRegister({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
      <LinearGradient
        colors={["#f1f1f1", "#f1f1f1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button1}
      >
        <Text style={styles.register}>Registrarse</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function ButtonGoForgotPassword({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
      <LinearGradient
        colors={["#f1f1f1", "#f1f1f1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button1}
      >
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function ButtonSignUp({ navigation, handleCreateAccount }) {
  return (
    <TouchableOpacity onPress={handleCreateAccount} style={styles.containerBL}>
      <LinearGradient
        colors={["#c9242b", "#c9242b", "#c9242b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonBL}
      >
        <Text style={styles.textBL}>Crear cuenta</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function ButtonChangePassword({ handlePasswordReset, isButtonDisabled, timeLeft }) {
  return (
    <TouchableOpacity
      style={styles.containerBL}
      onPress={handlePasswordReset}
      disabled={isButtonDisabled}
    >
      <LinearGradient
        colors={["#c9242b", "#c9242b", "#c9242b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonBL}
      >
        <Text style={styles.textBL}>
          {isButtonDisabled ? `Espere ${timeLeft} segundos` : 'Cambiar contraseña'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export { ButtonGoHome, ButtonGoRegister, ButtonGoForgotPassword, ButtonSignUp, ButtonChangePassword };
