import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import UserLogin from "../screens/LoginUser.js";
import SignUP from "../screens/SignUp.js";
import ForgotPassword from "../screens/ForgotPassword.js";
import MyDrawer from "./Drawer.js";
import Courses from "../screens/CourseScreens/Courses.js";
import Course from "../screens/CourseScreens/Course.js";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#c9242b' }, // Cambia el color de fondo si es necesario
          headerTintColor: '#fff', // Cambia el color del texto y los iconos
          headerBackTitleVisible: false, // Oculta el título de retroceso si lo deseas
          
        })}
      >
        <Stack.Screen
          name="Login"
          component={UserLogin}
          options={{
            title: "Inicio de sesión",
            headerRight: () => (
              <Ionicons
                name="home-outline"
                color="#fff"
                size={25}
                style={{ marginRight: 15 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUP}
          options={{ title: "Registro" ,
            headerRight: () => (
              <Ionicons
                name="reorder-four-outline"
                color="#fff"
                size={25}
                style={{ marginRight: 15 }}
              />
            ),
          }}
        />
       
        <Stack.Screen
          name="Forgot"
          component={ForgotPassword}
          options={{ title: "Recuperar contraseña", 
            headerRight: () => (
            <Ionicons
              name="key-outline"
              color="#fff"
              size={25}
              style={{ marginRight: 15 }}
            />
          ), }}
        />
        <Stack.Screen
          name="Home"
          component={MyDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Courses"
          component={Courses}
          options={{ title: "Cursos" }}
        />
        <Stack.Screen
          name="Course"
          component={Course}
          options={{ title: "Detalles del Curso" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
