import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import UserLogin from "../screens/LoginUser.js";
import SignUP from "../screens/SignUp.js";
import ForgotPassword from "../screens/ForgotPassword.js";
import HomeScreen from "../screens/HomeScreen.js";
import MyDrawer from "./Drawer.js";
const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={UserLogin} />
        <Stack.Screen name="SignUp" component={SignUP} />
        <Stack.Screen name="Forgot" component={ForgotPassword} />
        <Stack.Screen 
        name="Home" 
        component={MyDrawer} 
        options={{headerShown: false}}
        
        />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MainStack;
