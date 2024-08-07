import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { db } from '../firebase-config';
import { collection, query, limit, getDocs, orderBy, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PAGE_SIZE = 5;
const REFRESH_INTERVAL = 60000; // Intervalo para refrescar los datos no en tiempo real (1 minuto)

const HomeScreen = ({ navigation }) => {
  const [mostVisitedCourses, setMostVisitedCourses] = useState([]);
  const [mostLikedCourses, setMostLikedCourses] = useState([]);
  const [recentlyVisitedCourses, setRecentlyVisitedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Función para obtener cursos más visitados y más liked
  const fetchStaticCoursesData = async () => {
    try {
      const coursesRef = collection(db, 'Courses');
      const mostVisitedQuery = query(coursesRef, orderBy('viewsCount', 'desc'), limit(PAGE_SIZE));
      const mostLikedQuery = query(coursesRef, orderBy('likesCount', 'desc'), limit(PAGE_SIZE));

      const [mostVisitedSnapshot, mostLikedSnapshot] = await Promise.all([
        getDocs(mostVisitedQuery),
        getDocs(mostLikedQuery)
      ]);

      setMostVisitedCourses(mostVisitedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMostLikedCourses(mostLikedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching static courses data: ', error);
    }
  };

  // Función para obtener cursos visitados recientemente
  const fetchRecentlyVisitedCourses = async () => {
    try {
      const userDoc = doc(db, 'Users', auth.currentUser.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const recentlyVisitedCourseIds = userData.recentlyVisitedCourses || [];
        const recentlyVisitedCoursesData = await Promise.all(
          recentlyVisitedCourseIds.map(async (courseId) => {
            const courseDoc = await getDoc(doc(db, 'Courses', courseId));
            return { id: courseId, ...courseDoc.data() };
          })
        );
        setRecentlyVisitedCourses(recentlyVisitedCoursesData);
      }
    } catch (error) {
      console.error('Error fetching recently visited courses: ', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStaticCoursesData(); // Cargar datos estáticos al inicio
      await fetchRecentlyVisitedCourses(); // Cargar cursos visitados recientemente
      setLoading(false);
    };

    loadData();

    const refreshInterval = setInterval(() => {
      fetchStaticCoursesData(); // Refrescar datos estáticos periódicamente
    }, REFRESH_INTERVAL);

    // Usar onSnapshot para cursos visitados recientemente
    const userDoc = doc(db, 'Users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDoc, async () => {
      await fetchRecentlyVisitedCourses();
    });

    return () => {
      clearInterval(refreshInterval); // Limpiar intervalo cuando el componente se desmonte
      unsubscribe(); // Limpiar suscripción
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleCoursePress = (courseId) => {
    navigation.navigate('Course', { courseId });
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => handleCoursePress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.titleCard}>{item.name}</Text>
      <Text style={styles.textCard}>Afiliados: ${item.affiliated_price}</Text>
      <Text style={styles.textCard}>Estudiantes: ${item.student_price}</Text>
      <Text style={styles.textCard}>{item.modality}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cursos más visitados</Text>
          <FlatList
            data={mostVisitedCourses}
            keyExtractor={item => item.id}
            renderItem={renderCourseItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cursos con más me gusta</Text>
          <FlatList
            data={mostLikedCourses}
            keyExtractor={item => item.id}
            renderItem={renderCourseItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vistos recientemente</Text>
          <FlatList
            data={recentlyVisitedCourses}
            keyExtractor={item => item.id}
            renderItem={renderCourseItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseItem: {
    marginRight: 10,
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 3,
    marginBottom: 8,
  },
  titleCard: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textCard: {
    color: '#9E9E9E',
    paddingTop: 3,
    paddingBottom: 3,
  },
});

export default HomeScreen;
