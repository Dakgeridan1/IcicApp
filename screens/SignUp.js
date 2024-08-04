import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from "../styles/projectStyles.js";
import { ButtonSignUp } from '../components/Bottons.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config.js';

const app = initializeApp(firebaseConfig);

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const handleCreateAccount = async () => {
    if (email === "" || password === "" || nombre === "" || apellido === "" || fechaNacimiento === "") {
      Alert.alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crea un documento en la colección 'Users' con el UID del usuario
      await setDoc(doc(db, 'Users', user.uid), {
        nombre,
        apellido,
        fechaNacimiento,
        email
      });

      Alert.alert('Cuenta creada con éxito');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error al crear la cuenta: ' + error.message);
    }
  };

  return (
    <View style={styles.Maincontainer}>
      <View>
        <Image
          source={require("../assets/header.png")}
          style={styles.imageSignUp}
        />
      </View>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subTitle}>Regístrate</Text>
      <TextInput
        onChangeText={(text) => setNombre(text)}
        style={styles.textInput}
        placeholder="Nombre"
        value={nombre}
      />
      <TextInput
        onChangeText={(text) => setApellido(text)}
        style={styles.textInput}
        placeholder="Apellido"
        value={apellido}
      />
      <TextInput
        onChangeText={(text) => setFechaNacimiento(text)}
        style={styles.textInput}
        placeholder="Fecha de nacimiento"
        value={fechaNacimiento}
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
      <StatusBar style="auto" />
      <ButtonSignUp navigation={navigation} handleCreateAccount={handleCreateAccount} />
    </View>
  );
};

export default SignUp;

{/* <TextInput style={styles.textInput} placeholder="First-Name" />
      <TextInput style={styles.textInput} placeholder="Last-Name" /> */}