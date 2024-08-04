import React from "react";
import MainStack from "./Navigation/MainStack.js";
//
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);
//
export default function App() {
  return <MainStack />;
}
