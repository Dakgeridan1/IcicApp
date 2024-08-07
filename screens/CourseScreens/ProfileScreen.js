import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, ScrollView, TextInput, StyleSheet, Switch, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PasswordResetScreen from '../../components/PasswordResetScreen.js'; // Asegúrate de que este componente esté exportado correctamente

const DEFAULT_PROFILE_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/cmic-movil.appspot.com/o/defaultImages%2FdefaultProfileImage.png?alt=media&token=5c6de12d-e44f-48d2-b3ac-7b8ba6cbcc64';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [rfc, setRfc] = useState('');
  const [fisica, setFisica] = useState(false);
  const [moral, setMoral] = useState(false);
  const [razonSocial, setRazonSocial] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserInfo(data);
            setImageUri(data.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL);
            setAddress(data.address || '');
            setPhone(data.phone || '');
            setWhatsapp(data.whatsapp || '');
            setPostalCode(data.postalCode || '');
            setCity(data.city || '');
            setRfc(data.rfc || '');
            setFisica(data.fisica || false);
            setMoral(data.moral || false);
            setRazonSocial(data.razonSocial || '');
            setFirstName(data.name || '');
            setLastName(data.lastName || '');
            setUserName(data.userName || '');
            setEmail(user.email || '');
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      const image = result.assets[0];
      await uploadImage(image.uri);
      setUploading(false);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        await setDoc(doc(db, 'Users', user.uid), { profileImageUrl: downloadUrl }, { merge: true });
        setImageUri(downloadUrl);
        Alert.alert('Foto de perfil actualizada con éxito');
      }
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
      Alert.alert('Error al subir la imagen: ', error.message);
    }
  };

  const deleteImage = async () => {
    try {
      const user = auth.currentUser;
      if (user && imageUri !== DEFAULT_PROFILE_IMAGE_URL) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await deleteObject(storageRef);
        await setDoc(doc(db, 'Users', user.uid), { profileImageUrl: null }, { merge: true });
        setImageUri(DEFAULT_PROFILE_IMAGE_URL);
        Alert.alert('Foto de perfil eliminada con éxito');
      } else {
        Alert.alert('No tiene una imagen que borrar');
      }
    } catch (error) {
      console.error('Error al eliminar la imagen: ', error);
      Alert.alert('Error al eliminar la imagen: ', error.message);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          address,
          phone,
          whatsapp,
          postalCode,
          city,
          rfc,
          fisica,
          moral,
          razonSocial: moral ? razonSocial : '',
          name: firstName,
          lastName,
          userName,
        }, { merge: true });
        Alert.alert('Datos actualizados con éxito');
      }
    } catch (error) {
      console.error('Error al actualizar los datos: ', error);
      Alert.alert('Error al actualizar los datos: ', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Foto de perfil</Text>
      <View style={styles.profileImageContainer}>
        <Image source={{ uri: imageUri }} style={styles.profileImage} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Icon name="photo-camera" size={30} color="#c9242b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={deleteImage}>
            <Icon name="delete" size={30} color="#c9242b" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>Editar Perfil / Actualizar perfil</Text>
      <Text style={styles.text1}>Nombre(s)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.text1}>Apellidos(s)*</Text>
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <Text style={styles.text1}>Nombre de usuario*</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={userName}
        onChangeText={setUserName}
      />
      <Text style={styles.text1}>Dirección*</Text>
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.text1}>Teléfono*</Text>
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
      />
      <Text style={styles.text1}>WhatsApp*</Text>
      <TextInput
        style={styles.input}
        placeholder="WhatsApp"
        value={whatsapp}
        onChangeText={setWhatsapp}
      />
      <Text style={styles.text1}>Código Postal*</Text>
      <TextInput
        style={styles.input}
        placeholder="Código Postal"
        value={postalCode}
        onChangeText={setPostalCode}
      />
      <Text style={styles.text1}>Ciudad*</Text>
      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        value={city}
        onChangeText={setCity}
      />
      <Text style={styles.text1}>RFC*</Text>
      <TextInput
        style={styles.input}
        placeholder="RFC"
        value={rfc}
        onChangeText={setRfc}
      />
        <Text style={styles.text1} >Correo electronico *</Text>
      <TextInput
        style={styles.input2}
        placeholder="Correo Electrónico"
        value={email}
        editable={false}
      />
      <Text style={styles.Comment1}>Este campo no se puede cambiar</Text>
     <View style={styles.switchContainer}>
        <Text style={styles.label}>Persona Física</Text>
        <Switch
          value={fisica}
          onValueChange={(value) => {
            setFisica(value);
            setMoral(!value); // Cambiar a falso cuando 'fisica' es verdadero
          }}
        />
        <Text style={styles.label}>Persona Moral</Text>
        <Switch
          value={moral}
          onValueChange={(value) => {
            setMoral(value);
            setFisica(!value); // Cambiar a falso cuando 'moral' es verdadero
          }}
        />
      </View>
      {moral && (
        <>
          <Text style={styles.header}>Razon Social*</Text>
          <TextInput
            style={styles.input}
            placeholder="Razón Social"
            value={razonSocial}
            onChangeText={setRazonSocial}
          />
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      <View style={styles.container1} >
     <View/>
      <Text style={styles.header}>Cambiar contraseña</Text>
     
      <TouchableOpacity style={styles.button1} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
      <Text style={styles.Comment1}>Presiona para cambiar contraseña , te enviaremos un correo para cambiar la contraseña</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <PasswordResetScreen />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <StatusBar style="auto" />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#c9242b',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  iconButton: {
    alignItems: 'center',
    padding: 10,
    color: '#c9242b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  text1: {
    fontSize: 15,
    color: '#c9242b',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#c9242b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  passwordResetButton: {
    color: '#c9242b',
    textAlign: 'center',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#c9242b',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },button: {
    backgroundColor: '#c9242b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 1,
  },button1: {
    backgroundColor: '#c9242b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 3,
  },
   Comment1: {
    textAlign: 'center',
    fontSize: 11,
     color: 'gray',
     paddingStart: 10,
    },
    
  container1: {
    padding: 5, // Espacio interno
    margin: 10, // Espacio externo
    borderTopWidth: 1, 
    borderTopColor: '#c9242b',
    borderTopStyle: 'solid' // Grosor de la línea superior
  }
});

export default ProfileScreen;
