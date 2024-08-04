import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Styles from '../../styles/StylesCourse';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={Styles.Maincontainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={Styles.Maincontainer}>
      <Text>ProfileScreen</Text>
      {userInfo ? (
        <View>
          <Text>Nombre: {userInfo.nombre}</Text>
          <Text>Apellido: {userInfo.apellido}</Text>
          <Text>Fecha de Nacimiento: {userInfo.fechaNacimiento}</Text>
          <Text>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <Text>No hay información del usuario</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default ProfileScreen;
