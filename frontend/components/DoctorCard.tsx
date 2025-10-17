// en components/DoctorCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../data/mockdata'; // Importamos la estructura

interface DoctorCardProps {
  doctor: Doctor;
  onFavoritePress: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onFavoritePress }: DoctorCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: doctor.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.location}>{doctor.location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{doctor.rating}</Text>
          <Text style={styles.reviewsText}>({doctor.reviews} Reviews)</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onFavoritePress(doctor)} style={styles.favoriteButton}>
        <Ionicons name="heart" size={24} color="#0D1B2A" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginVertical: 8, marginHorizontal: 16, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, },
    image: { width: 80, height: 80, borderRadius: 12, },
    infoContainer: { flex: 1, marginLeft: 12, },
    name: { fontSize: 16, fontWeight: 'bold', color: '#0D1B2A' },
    specialty: { fontSize: 14, color: '#415A77', marginVertical: 2, },
    location: { fontSize: 12, color: '#778DA9', },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4, },
    ratingText: { fontSize: 14, color: '#415A77', marginLeft: 4, },
    reviewsText: { fontSize: 12, color: '#778DA9', marginLeft: 8, },
    favoriteButton: { padding: 8, },
});