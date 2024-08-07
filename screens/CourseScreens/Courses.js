import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { db } from '../../firebase-config';
import { collection, query, limit, getDocs, startAfter, orderBy } from 'firebase/firestore';

const PAGE_SIZE = 10;

const Courses = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let coursesQuery;
      if (lastDoc) {
        coursesQuery = query(
          collection(db, 'Courses'),
          orderBy('name'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      } else {
        coursesQuery = query(collection(db, 'Courses'), orderBy('name'), limit(PAGE_SIZE));
      }

      const querySnapshot = await getDocs(coursesQuery);
      const newCourses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCourses(prevCourses => [...prevCourses, ...newCourses]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching courses: ', error);
    }
    setLoading(false);
    setIsFetching(false);
  };

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setIsFetching(true);
      fetchCourses();
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setCourses([]);
      setLastDoc(null);
      fetchCourses();
    } else {
      const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(term.toLowerCase())
      );
      setCourses(filteredCourses);
      setHasMore(false);
    }
  };

  if (loading && courses.length === 0) {
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
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() => navigation.navigate('Course', { courseId: item.id })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.titleCard}>{item.name}</Text>
            <Text style={styles.textCard}>Afiliados: ${item.affiliated_price}</Text>
            <Text style={styles.textCard}>Estudiantes: ${item.student_price}</Text>
            <Text style={styles.textCard}>{item.modality}</Text>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && <ActivityIndicator size="large" color="#0000ff" />
        }
      />
      <StatusBar style="auto" />
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
  courseItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  titleCard: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textCard: {
    color: '#9E9E9E',
    paddingTop: 3,
    paddingBottom: 3,
  },
  button: {
    backgroundColor: '#c9242b',
    margin: 10,
    borderRadius: 5,
    width: 100,
    height: 30,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  textButton: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
  },
});

export default Courses;
