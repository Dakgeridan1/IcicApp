import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from "../styles/projectStyles.js";
import { ButtonSignUp } from '../components/Bottons.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config.js';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const app = initializeApp(firebaseConfig);

const SignUp = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleDateConfirm = (date) => {
    const formattedDate = date.toLocaleDateString('en-GB');
    setFechaNacimiento(formattedDate);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleCreateAccount = async () => {
    if (email === "" || password === "" || confirmPassword === "" || name === "" || lastName === "" || fechaNacimiento === "" || userName === "") {
      Alert.alert('Por favor, complete todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden. Por favor, inténtelo de nuevo.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Users', user.uid), {
        userName,
        name,
        lastName,
        fechaNacimiento,
        email
      });

      Alert.alert('Cuenta creada con éxito');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);

      let errorMessage = 'Error al crear la cuenta: ' + error.message;

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Ya existe una cuenta con ese correo electrónico.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Por favor, elige una contraseña más fuerte.';
      }

      Alert.alert(errorMessage);
    }
  };

  return (
    <View style={styles.Maincontainer}>
      <View>
        
      </View>
      <Text style={styles.titleRegister}>Bienvenido</Text>
      <Text style={styles.subTitleRegister}>Crear cuenta</Text>
      <TextInput
        onChangeText={(text) => setUserName(text)}
        style={styles.textInput}
        placeholder="Nombre de usuario"
        value={userName}
      />
      <TextInput
        onChangeText={(text) => setName(text)}
        style={styles.textInput}
        placeholder="Nombre(s)"
        value={name}
      />
      <TextInput
        onChangeText={(text) => setLastName(text)}
        style={styles.textInput}
        placeholder="Apellido(s)"
        value={lastName}
      />
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
        placeholder="E-mail"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textInput}
        placeholder="Contraseña"
        value={password}
        secureTextEntry={true}
      />
      <TextInput
        onChangeText={(text) => setConfirmPassword(text)}
        style={styles.textInput}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity 
        style={styles.textInput} 
        onPress={showDatePicker}
      >
        <Text style={styles.dateInputText}>
          {fechaNacimiento || "Seleccionar Fecha de Nacimiento"}
        </Text>
      </TouchableOpacity>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <StatusBar style="auto" />
      <ButtonSignUp navigation={navigation} handleCreateAccount={handleCreateAccount} />
    </View>
  );
};


export default SignUp;
