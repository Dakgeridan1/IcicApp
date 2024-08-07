import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity ,ScrollView} from 'react-native';
import { db } from '../../firebase-config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const Course = ({ route }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();

  useFocusEffect(
    React.useCallback(() => {
      const fetchCourse = async () => {
        try {
          const courseDoc = doc(db, 'Courses', courseId);
          const courseSnapshot = await getDoc(courseDoc);
          if (courseSnapshot.exists()) {
            const courseData = courseSnapshot.data();
            setCourse(courseData);

            // Verificar si el curso ya está en los favoritos del usuario
            const userDoc = doc(db, 'Users', auth.currentUser.uid);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setIsFavorite(userData.favorites?.includes(courseId));

              // Actualizar cursos visitados recientemente del usuario
              const recentlyVisitedCourses = userData.recentlyVisitedCourses || [];
              const updatedRecentlyVisitedCourses = [courseId, ...recentlyVisitedCourses.filter(id => id !== courseId)].slice(0, 5);
              console.log('Updating recently visited courses:', updatedRecentlyVisitedCourses);
              await updateDoc(userDoc, { recentlyVisitedCourses: updatedRecentlyVisitedCourses });
            }
            
            // Actualizar contador de vistas y marca de tiempo
            await updateDoc(courseDoc, {
              viewsCount: (courseData.viewsCount || 0) + 1,
              recentlyVisitedTimestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error fetching course: ', error);
        }
        setLoading(false);
      };

      fetchCourse();
    }, [courseId])
  );

  const handleToggleFavorite = async () => {
    const userDoc = doc(db, 'Users', auth.currentUser.uid);
    try {
      if (isFavorite) {
        // Eliminar de favoritos
        await updateDoc(userDoc, {
          favorites: arrayRemove(courseId)
        });
        await updateDoc(doc(db, 'Courses', courseId), {
          likesCount: (course.likesCount || 0) - 1
        });
      } else {
        // Agregar a favoritos
        await updateDoc(userDoc, {
          favorites: arrayUnion(courseId)
        });
        await updateDoc(doc(db, 'Courses', courseId), {
          likesCount: (course.likesCount || 0) + 1
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites: ', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>No course found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container3}>
      <Text style={styles.name}>{course.name}</Text>
      {/* Imagen del curso */}
      {course.imageUrl ? (
        <Image source={{ uri: course.imageUrl }} style={styles.image} />
      ) : (
        <Text>No image available</Text>
      )}
      
      
      <Text style={styles.title}>Precio base: ${course.price}</Text>
      <Text style={styles.textCourse}>Afiliados: ${course.affiliated_price}</Text>
      <Text style={styles.textCourse}>Estudiantes: ${course.student_price}</Text>
      <Text style={styles.textCourse}>Modalidad:</Text>
      <Text style={styles.textCourse}>{course.modality}</Text>
      <Text style={styles.textCourse}>URL: {course.url}</Text>
      </View>
      <View style={styles.container3}>
      <Text style={styles.title}>Descripcion</Text>
      <Text style={styles.textCourse}>{course.details}</Text>
      </View>
      <View style={styles.container3}>
      <Text style={styles.title}>Temario</Text>
      <Text style={styles.textCourse}>{course.outline}</Text>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleToggleFavorite}
      >
        <Text style={styles.buttonText}>{isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgoundColor: '#f1f1f1',
  },
  container2: {
   
    
  },
  container3: {
    
    
  },
  name: {
    paddingStart: 10,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingRight: 10,
  },
  image: {
    alignSelf: 'center',
    width: '95%',
    height: 200, // Ajusta la altura según sea necesario
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
    height: 40 ,
    backgroundColor: '#c9242b',
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
    marginBottom  : 20,
    
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    paddingBottom: 5,
   
  },
  textCourse: {
    paddingStart: 15,
    fontSize: 16,
    marginBottom: 2,
  },
  title: {
    paddingStart: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Course;
