import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Appt = {
  id: string;
  dateLabel: string;   // p.ej. "22 mayo, 2025 - 10:00 AM"
  doctor: string;
  specialty: string;
  clinic: string;
  avatar: any;
};

const UPCOMING: Appt[] = [
  {
    id: "u1",
    dateLabel: "22 mayo, 2025 • 10:00 AM",
    doctor: "Dr. James Robinson",
    specialty: "Ortopedia",
    clinic: "Elite Ortho Clinic, USA",
    avatar: require("../assets/doctors/1409.png"),
  },
  {
    id: "u2",
    dateLabel: "14 junio, 2025 • 03:00 PM",
    doctor: "Dr. Daniel Lee",
    specialty: "Gastroenterología",
    clinic: "Digestive Institute, USA",
    avatar: require("../assets/doctors/25030.png"),
  },
];

const COMPLETED: Appt[] = [
  {
    id: "c1",
    dateLabel: "12 marzo, 2025 • 11:00 AM",
    doctor: "Dra. Sarah Johnson",
    specialty: "Ginecología",
    clinic: "Women's Health Clinic",
    avatar: require("../assets/doctors/behnazsabaa_Smiling_Doctors_Portrait__Style_of_Her_Film_with_it_6453a87e-ad53-4df3-a535-816164cb1b00.png"),
  },
  {
    id: "c2",
    dateLabel: "02 marzo, 2025 • 12:00 AM",
    doctor: "Dr. Michael Chang",
    specialty: "Cardiología",
    clinic: "HeartCare Center, USA",
    avatar: require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_632e5c2e-ed2d-4cbf-9f2f-3b394f244150.png"),
  },
];

export default function BookingsScreen() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const data = tab === "upcoming" ? UPCOMING : COMPLETED;

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Mis citas</Text>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tabBtn, tab === "upcoming" && s.tabBtnActive]}
          onPress={() => setTab("upcoming")}
          activeOpacity={0.85}
        >
          <Text style={[s.tabText, tab === "upcoming" && s.tabTextActive]}>
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === "completed" && s.tabBtnActive]}
          onPress={() => setTab("completed")}
          activeOpacity={0.85}
        >
          <Text style={[s.tabText, tab === "completed" && s.tabTextActive]}>
            Completadas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.dateLabel}>{item.dateLabel}</Text>

            <View style={s.cardRow}>
              <Image source={item.avatar} style={s.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={s.docName}>{item.doctor}</Text>
                <Text style={s.specText}>{item.specialty}</Text>
                <View style={s.row}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text numberOfLines={1} style={s.clinicText}>
                    {item.clinic}
                  </Text>
                </View>
              </View>
            </View>

            {tab === "upcoming" ? (
              <View style={s.actionsRow}>
                <TouchableOpacity style={s.btnGhost} activeOpacity={0.9}>
                  <Text style={s.btnGhostText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnPrimary} activeOpacity={0.9}>
                  <Text style={s.btnPrimaryText}>Reprogramar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s.actionsRow}>
                <TouchableOpacity style={s.btnGhost} activeOpacity={0.9}>
                  <Text style={s.btnGhostText}>Reservar de nuevo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnPrimary} activeOpacity={0.9}>
                  <Text style={s.btnPrimaryText}>Agregar reseña</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.tabButton} onPress={() => router.push("/home")}>
          <Ionicons name="home" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={s.tabButton} onPress={() => router.push("/location")}>
          <Ionicons name="location" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={s.tabButton}>
          <View style={s.tabIconActiveBg}>
            <Ionicons name="calendar" size={22} color="#111827" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.tabButton} disabled>
          <Ionicons name="person-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  title: { fontSize: 20, fontWeight: "700", color: "#0F172A" },

  tabs: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  tabBtnActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  tabText: { color: "#6B7280", fontWeight: "700" },
  tabTextActive: { color: "#FFFFFF" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    ...shadow,
  },
  dateLabel: { color: "#111827", fontWeight: "700", marginBottom: 10 },
  cardRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 12, backgroundColor: "#E2E8F0" },
  docName: { color: "#111827", fontWeight: "700", fontSize: 16 },
  specText: { color: "#6B7280", marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  clinicText: { color: "#6B7280", flex: 1 },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  btnGhost: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  btnGhostText: { color: "#111827", fontWeight: "700" },
  btnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { color: "#FFFFFF", fontWeight: "700" },

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
  tabButton: { alignItems: "center", justifyContent: "center", flex: 1 },
  tabIconActiveBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
  },
});