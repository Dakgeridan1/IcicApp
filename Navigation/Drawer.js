import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import Courses from '../screens/CourseScreens/Courses';
import Whishlist from '../screens/CourseScreens/Whislist';
import UserLogin from '../screens/LoginUser';
import ProfileScreen from '../screens/CourseScreens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.drawerContent, { backgroundColor: colors.drawerBackground }]}>
      <Text style={styles.drawerLabel}>Cerrar sesión</Text>
      {/* Aquí puedes agregar más contenido personalizado si lo deseas */}
    </View>
  );
};

const MyDrawer = () => {
  const navigation = useNavigation(); // Hook para obtener el objeto de navegación

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#c9242b' }, // Color de la barra superior cuando el drawer está cerrado
        headerTintColor: '#fff', // Color del texto y los iconos en la barra superior
        drawerStyle: { backgroundColor: '#fff' }, // Color de fondo del drawer
        drawerLabelStyle: { color: '#000' }, // Color de las etiquetas en el drawer
        drawerActiveTintColor: '#c9242b', // Color del ítem activo
        drawerInactiveTintColor: '#333', // Color del ítem inactivo
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerContent: (props) => <CustomDrawerContent {...props} />,
        drawerPosition: 'left',
        drawerContentOptions: {
          activeTintColor: '#c9242b',
          inactiveTintColor: '#333',
        },
        drawerContentStyle: {
          backgroundColor: '#fff',
        },
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            color="#fff"
            style={{ marginLeft: 15 }} // Ajusta el margen del ícono de menú
            onPress={() => navigation.openDrawer()} // Usa el hook de navegación aquí
          />
        ),
      })}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Inicio",
        headerRight: () => (
          <Ionicons
            name="home-outline"
            color="#fff"
            size={25}
            style={{ marginRight: 15 }}
          />
        ),
       }} />
      <Drawer.Screen name="Courses Screen" component={Courses} options={{ title: "Cursos" ,
        headerRight: () => (
          <Ionicons
            name="library-outline"
            color="#fff"
            size={25}
            style={{ marginRight: 15 }}
          />
        ),
      }} />
      <Drawer.Screen name="Whishlist" component={Whishlist} options={{ title: "Favoritos" ,
        headerRight: () => (
          <Ionicons
            name="heart-outline"
            color="#fff"
            size={25}
            style={{ marginRight: 15 }}
          />
        ),
      }} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: "Perfil",
        headerRight: () => (
          <Ionicons
            name="person-outline"
            color="#fff"
            size={25}
            style={{ marginRight: 15 }}
          />
        ),
       }} />
      <Drawer.Screen 
        name="LogOut" 
        component={UserLogin} 
        options={{ 
          headerShown: false,
          drawerLabel: () => <Text style={styles.customDrawerLabel}>Cerrar sesión</Text>
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 16,
  },
  drawerLabel: {
    color: '#c9242b', // Color de las etiquetas en el drawer
    fontSize: 16,
    fontWeight: 'bold',
  },
  customDrawerLabel: {
    color: '#c9242b', // Color del texto del ítem de cierre de sesión
  },
});

export default MyDrawer;
