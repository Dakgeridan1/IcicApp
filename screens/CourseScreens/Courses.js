import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Styles from '../../styles/StylesCourse';
import { db } from '../../firebase-config'; // Asegúrate de que la ruta sea correcta
import { collection, query, limit, getDocs } from 'firebase/firestore';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesQuery = query(collection(db, 'Courses'), limit(5));
        const querySnapshot = await getDocs(coursesQuery);
        const coursesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesList);
      } catch (error) {
        console.error('Error fetching courses: ', error);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <View style={Styles.Maincontainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={Styles.Maincontainer}>
      <Text>Courses Screen</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={Styles.courseItem}>
            <Text>{item.name}</Text>
            <Text>Price: ${item.price}</Text>
            <Text>Modality: {item.modality}</Text>
            <Text>URL: {item.url}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default Courses;
