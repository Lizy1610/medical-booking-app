// en app/favorites/hospitals.tsx
import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import HospitalCard from '../../components/HospitalCard';
import { mockHospitals, Hospital } from '../../data/mockdata';

export default function HospitalsScreen() {
  const [hospitals, setHospitals] = useState(mockHospitals);

  // Esta función se activará cuando se presione el corazón
  // Por ahora, solo muestra una alerta.
  const handleFavoritePress = (hospital: Hospital) => {
    Alert.alert(
      "Remover Favorito",
      `¿Estás seguro de que deseas remover a ${hospital.name} de tus favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          onPress: () => {
            setHospitals(currentHospitals => 
              currentHospitals.filter(h => h.id !== hospital.id)
            );
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
      <FlatList
        data={hospitals}
        renderItem={({ item }) => (
          <HospitalCard 
            hospital={item} 
            onFavoritePress={handleFavoritePress} 
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
      />
    </View>
  );
}