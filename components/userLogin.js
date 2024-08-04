import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config'; // Asegúrate de que esta ruta sea correcta

const ProtectedScreen = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setLoading(false);
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return <>{children}</>; // Renderiza el contenido de la pantalla protegida
};

export default ProtectedScreen;