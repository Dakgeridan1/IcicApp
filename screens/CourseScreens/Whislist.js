import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { db } from '../../firebase-config';
import { doc, onSnapshot, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Wishlist = ({ navigation }) => {
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [allFavoriteCourses, setAllFavoriteCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const userDoc = doc(db, 'Users', auth.currentUser.uid);

    const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const favoriteIds = userData.favorites || [];

        // Cargar detalles de los cursos favoritos
        const fetchCourses = async () => {
          const courses = await Promise.all(
            favoriteIds.map(async (id) => {
              const courseDoc = doc(db, 'Courses', id);
              const courseSnapshot = await getDoc(courseDoc);
              return courseSnapshot.exists() ? { id, ...courseSnapshot.data() } : null;
            })
          );

          // Filtrar valores nulos
          const validCourses = courses.filter(course => course !== null);
          setFavoriteCourses(validCourses);
          setAllFavoriteCourses(validCourses);
          setLoading(false);
        };

        fetchCourses();
      } else {
        setFavoriteCourses([]);
        setAllFavoriteCourses([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser.uid]);

  const handleRemoveFavorite = async (courseId) => {
    const userDoc = doc(db, 'Users', auth.currentUser.uid);
    try {
      await updateDoc(userDoc, {
        favorites: arrayRemove(courseId)
      });
      setFavoriteCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      setAllFavoriteCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error removing favorite: ', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFavoriteCourses(allFavoriteCourses);
    } else {
      const filteredCourses = allFavoriteCourses.filter(course =>
        course.name.toLowerCase().includes(term.toLowerCase())
      );
      setFavoriteCourses(filteredCourses);
    }
  };

  if (loading) {
    return (
      <View style={styles.Maincontainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.Maincontainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar curso"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={favoriteCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseItemContainer}>
            <TouchableOpacity
              style={styles.courseItem}
              onPress={() => navigation.navigate('Course', { courseId: item.id })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.titleCard}>{item.name}</Text>
            <Text style={styles.textCard}>Afiliados: ${item.affiliated_price}</Text>
            <Text style={styles.textCard}>Estudiantes: ${item.student_price}</Text>
            </TouchableOpacity>
<TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.button}>
<Text style={styles.textButton} >Quitar de favoritos</Text>
</TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  courseItemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 2,
  },
  courseItem: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  titleCard: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    fontWeight: "bold",
    
  },
 textCard: {
  color: '#9E9E9E',
  paddingTop: 3,
  paddingBottom: 3,
 },button: {
  backgroundColor : '#c9242b',
  borderRadius: 5,
  width: "100%",
  height: 35,
  
 },textButton: {
 textAlign: 'center',
 padding: 5,
 color: 'white',
 },
});

export default Wishlist;
