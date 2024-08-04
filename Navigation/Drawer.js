import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import Courses from '../screens/CourseScreens/Courses';
import Whishlist from '../screens/CourseScreens/Whislist';
import UserLogin from '../screens/LoginUser';
import { Text } from 'react-native';
import ProfileScreen from '../screens/CourseScreens/ProfileScreen';



const Drawer = createDrawerNavigator();

function MyDrawer() {

    const CustomDrawerLabel = () => {
        return <Text style={{ color: 'red' }}>Cerrar sesion</Text>;
      };


  return (
    <Drawer.Navigator>
      <Drawer.Screen name="HomeScreen" component={HomeScreen} 
      options={{ title: "Home" }}/>
      <Drawer.Screen name="Courses Screen" component={Courses} 
      options={{ title: "Courses" }}/>
      <Drawer.Screen name="Whishlist" component={Whishlist} 
      options={{ title: "Whishlist" }}/>
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} 
      options={{ title: "Profile" }}/>
    <Drawer.Screen 
    name="LogOut" 
    component={UserLogin} 
    options={{ headerShown:false ,drawerLabel:CustomDrawerLabel}}/>
    </Drawer.Navigator>
  );
}
export default MyDrawer;