import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const insets = useSafeAreaInsets();
  const [logoutVisible, setLogoutVisible] = useState(false);

  if (!fontsLoaded) return null;

  const handleLogout = () => {
    setLogoutVisible(false);
    Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
    // Aquí podrías agregar la lógica para cerrar sesión (Firebase/Auth, etc.)
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.container, { paddingBottom: 20 + 70 + insets.bottom }]}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.locationRow}>
            <Text style={s.locationText}>Perfil</Text>
          </View>
          <TouchableOpacity style={s.bellWrap} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={24} color="#111827" />
            <View style={s.badge} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Información del usuario */}
          <View style={s.profileContainer}>
            <View style={s.imageContainer}>
              <Image
                source={require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_fdbc4308-d873-4135-88e3-7242607c8c84.png")}
                style={s.avatar}
              />
              <TouchableOpacity style={s.editIcon}>
                <Feather name="edit-2" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={s.name}>Daniel Martinez</Text>
            <Text style={s.phone}>+123 856479683</Text>
          </View>

          {/* Opciones de menú */}
          <View style={s.menu}>
            <MenuItem 
              icon={<Feather name="edit" size={20} color="#333" />} 
              text="Editar Perfil" 
            />
            <MenuItem 
              icon={<Feather name="heart" size={20} color="#333" />} 
              text="Favoritos" 
            />
            <MenuItem 
              icon={<Feather name="bell" size={20} color="#333" />} 
              text="Notificaciones" 
            />
            <MenuItem 
              icon={<Feather name="settings" size={20} color="#333" />} 
              text="Configuración" 
            />
            <MenuItem 
              icon={<Feather name="help-circle" size={20} color="#333" />} 
              text="Ayuda y Soporte" 
            />
            <MenuItem 
              icon={<Feather name="shield" size={20} color="#333" />} 
              text="Términos y Condiciones" 
            />
            <TouchableOpacity onPress={() => setLogoutVisible(true)}>
              <MenuItem 
                icon={<Feather name="log-out" size={20} color="#d9534f" />} 
                text="Cerrar Sesión" 
                color="#d9534f" 
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Barra de navegación inferior - Estilo igual a home.tsx */}
        <View style={s.bottomNav}>
          <TouchableOpacity style={s.tabButton} activeOpacity={0.8} onPress={() => router.push("/home")}>
            <Ionicons name="home-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={s.tabButton} activeOpacity={0.8} onPress={() => router.push("/location")}>
            <Ionicons name="location-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={s.tabButton} activeOpacity={0.8} onPress={() => router.push("/bookings")}>
            <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={s.tabButton} activeOpacity={0.8}>
            <View style={s.tabIconActiveBg}>
              <Ionicons name="person" size={18} color="#111827" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal de cierre de sesión */}
        <Modal visible={logoutVisible} transparent animationType="fade">
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <Text style={s.modalTitle}>Cerrar Sesión</Text>
              <Text style={s.modalText}>
                ¿Estás seguro de que quieres cerrar sesión?
              </Text>
              <View style={s.modalButtons}>
                <Pressable
                  style={[s.modalButton, s.cancelButton]}
                  onPress={() => setLogoutVisible(false)}
                >
                  <Text style={s.cancelText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[s.modalButton, s.confirmButton]}
                  onPress={handleLogout}
                >
                  <Text style={s.confirmText}>Sí, Cerrar Sesión</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// 🔹 Componente para cada opción del menú
const MenuItem = ({
  icon,
  text,
  color = "#333",
}: {
  icon: React.ReactNode;
  text: string;
  color?: string;
}) => (
  <View style={s.menuItem}>
    <View style={s.menuLeft}>
      {icon}
      <Text style={[s.menuText, { color }]}>{text}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#999" />
  </View>
);

const COLORS = {
  bg: "#FFFFFF",
  text: "#111827",
  textMid: "#6B7280",
  card: "#F3F4F6",
  primaryDark: "#0F172A",
  border: "#E5E7EB",
};

const s = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  container: { 
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 0,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },
  locationText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  bellWrap: { 
    position: "relative", 
    padding: 4 
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007BFF",
    borderRadius: 12,
    padding: 6,
  },
  name: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  phone: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    fontSize: 14,
  },
  
  menu: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabIconActiveBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 10,
  },
  modalText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: "#111827",
  },
  cancelText: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.text,
    fontSize: 14,
  },
  confirmText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    fontSize: 14,
  },
});