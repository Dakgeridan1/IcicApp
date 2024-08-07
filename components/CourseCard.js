import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'; 

const CourseCard = ({ course }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => { /* Navegar a detalles del curso */ }}>
      <FastImage
        style={styles.image}
        source={{ uri: course.imageURL }} // Asegúrate de que el curso tenga una URL de imagen
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{course.title}</Text>
        <Text>{course.description}</Text>
        {/* Puedes mostrar más información aquí */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 150,
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseCard;
