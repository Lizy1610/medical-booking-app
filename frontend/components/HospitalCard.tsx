// en components/HospitalCard.tsx
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hospital } from '../data/mockdata';

interface HospitalCardProps {
  hospital: Hospital;
  onFavoritePress: (hospital: Hospital) => void;
}

export default function HospitalCard({ hospital, onFavoritePress }: HospitalCardProps) {
  return (
    <View style={styles.card}>
      {/* Contenedor de la Imagen */}
      <ImageBackground
        source={{ uri: hospital.imageUrl }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 12 }}
      >
        <TouchableOpacity onPress={() => onFavoritePress(hospital)} style={styles.favoriteButton}>
          <Ionicons name="heart" size={24} color="#FFF" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Contenedor de la Información (debajo de la imagen) */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{hospital.name}</Text>
        <Text style={styles.address}>{hospital.address}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{hospital.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsText}>({hospital.reviews} Reviews)</Text>
        </View>
      </View>

      {/* Contenedor del Pie de la Tarjeta */}
      <View style={styles.footerContainer}>
        <Text style={styles.distanceText}>{hospital.distance} km / {hospital.time}min</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{hospital.type}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  imageBackground: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'flex-end', // Mueve el corazón a la derecha
  },
  favoriteButton: {
    padding: 12,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1B2A',
  },
  address: {
    fontSize: 14,
    color: '#778DA9',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#415A77',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#778DA9',
    marginLeft: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  distanceText: {
    fontSize: 14,
    color: '#415A77',
  },
  tag: {
    backgroundColor: '#E0E1DD',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#415A77',
    fontWeight: '500',
  },
});