import react from "react";
import {View,Text,} from "react-native";
import { StatusBar } from "expo-status-bar";
import Styles from "../../styles/StylesCourse";
Whishlist = () => {
  return (
    <View style={Styles.Maincontainer}> 
      <Text>Whishlist</Text>
      <StatusBar style="auto" />
    </View>
  );
}
export default Whishlist;