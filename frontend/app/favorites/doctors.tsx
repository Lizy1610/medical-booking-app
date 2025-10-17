// en app/favorites/doctors.tsx
import React, { useState } from 'react';
import { View, FlatList, Modal, Text, Button, StyleSheet } from 'react-native';
import DoctorCard from '../../components/DoctorCard';
import { mockDoctors, Doctor } from '../../data/mockdata';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleFavoritePress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleRemove = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(d => d.id !== selectedDoctor.id));
      setModalVisible(false);
      setSelectedDoctor(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
      <FlatList
        data={doctors}
        renderItem={({ item }) => <DoctorCard doctor={item} onFavoritePress={handleFavoritePress} />}
        keyExtractor={item => item.id}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>¿Quitar de favoritos?
</Text>
                {selectedDoctor && <DoctorCard doctor={selectedDoctor} onFavoritePress={() => {}} />}
                <View style={styles.modalButtons}>
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                    <Button title="Sí, Remover" onPress={handleRemove} color="#0D1B2A" />
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
}

// ... (Estilos para el modal)
const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', },
    modalView: { width: '100%', backgroundColor: 'white', borderTopRightRadius: 20, borderTopLeftRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20, },
});