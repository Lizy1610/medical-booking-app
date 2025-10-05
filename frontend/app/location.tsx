import { useState, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

export default function LocationScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [region, setRegion] = useState<Region>({
    latitude: 47.609722,
    longitude: -122.333056,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  const mapRef = useRef<MapView>(null);
  if (!fontsLoaded) return null;

  const centers = [
    { id: "c1", name: "Sunrise Health Clinic", img: require("../assets/doctors/1409.png"), lat: 47.61, lng: -122.33 },
    { id: "c2", name: "Golden Cardiology", img: require("../assets/doctors/25030.png"), lat: 47.603, lng: -122.322 },
    { id: "c3", name: "Metro Medical Hub", img: require("../assets/doctors/interior-reanimation-room-modern-clinic.png"), lat: 47.615, lng: -122.345 },
  ];

  const pins = [
    { id: "p1", lat: 47.612, lng: -122.332, img: require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_0996798e-acc5-48e2-9b18-79c922a9f29b.png") },
    { id: "p2", lat: 47.607, lng: -122.34, img: require("../assets/doctors/behnazsabaa_Smiling_Doctors_Portrait__Style_of_Her_Film_with_it_6453a87e-ad53-4df3-a535-816164cb1b00.png") },
    { id: "p3", lat: 47.618, lng: -122.325, img: require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_22f8a7ff-a589-4d1b-880a-172332b8a241.png") },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.root}>
        <MapView
          ref={mapRef}
          style={s.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
        >
          {pins.map((p) => (
            <Marker key={p.id} coordinate={{ latitude: p.lat, longitude: p.lng }}>
              <View style={s.pin}>
                <Image source={p.img} style={s.pinAvatar} />
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={s.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#9AA3AF" style={s.searchIcon} />
          <TextInput placeholder="Buscar doctor, hospital" placeholderTextColor="#9AA3AF" style={s.searchInput} />
        </View>

        <View style={s.cardsShadow}>
          <FlatList
            data={centers}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.hList}
            renderItem={({ item }) => (
              <View style={s.centerCard}>
                <View style={s.centerImgWrap}>
                  <Image source={item.img} style={s.centerImg} />
                  <TouchableOpacity style={s.heartBtn}>
                    <Ionicons name="heart-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={s.centerBody}>
                  <Text numberOfLines={1} style={s.centerName}>
                    {item.name}
                  </Text>
                  <View style={s.row}>
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text numberOfLines={1} style={s.centerAddr}>
                      123 Oak Street, CA 98765
                    </Text>
                  </View>
                  <View style={s.row}>
                    <Text style={s.ratingText}>5.0</Text>
                    <View style={s.starsRow}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <Ionicons key={k} name="star" size={14} color="#F59E0B" />
                      ))}
                    </View>
                    <Text style={s.reviewsText}>(58 reseñas)</Text>
                  </View>
                  <View style={s.divider} />
                  <View style={s.rowBetween}>
                    <View style={s.row}>
                      <Ionicons name="navigate-outline" size={14} color="#6B7280" />
                      <Text style={s.metaText}>2.5 km / 40 min</Text>
                    </View>
                    <View style={s.row}>
                      <Ionicons name="medkit-outline" size={14} color="#6B7280" />
                      <Text style={s.metaText}>Hospital</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        <View style={s.bottomNav}>
          <TouchableOpacity style={s.tabButton} activeOpacity={0.8}>
            <Ionicons name="home" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={s.tabButton} activeOpacity={0.8}>
            <View style={s.tabIconActiveBg}>
              <Ionicons name="location" size={22} color="#111827" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.tabButton} activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={s.tabButton} activeOpacity={0.8}>
            <Ionicons name="person-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  root: { flex: 1 },
  map: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  searchWrap: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: { position: "absolute", left: 12, top: 13 },
  searchInput: { paddingLeft: 38, paddingRight: 12, fontFamily: "Poppins_400Regular", color: "#111827", fontSize: 14 },

  cardsShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 80,
    paddingLeft: 16,
  },

  hList: { gap: 12, paddingRight: 16 },

  centerCard: {
    width: 260,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  centerImgWrap: { width: "100%", height: 130, overflow: "hidden" },
  centerImg: { width: "100%", height: "100%", resizeMode: "cover" },
  heartBtn: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  centerBody: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  centerName: { fontFamily: "Poppins_700Bold", color: "#111827", fontSize: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  centerAddr: { fontFamily: "Poppins_400Regular", color: "#6B7280", fontSize: 12, flex: 1 },
  ratingText: { fontFamily: "Poppins_700Bold", color: "#111827", fontSize: 12 },
  starsRow: { flexDirection: "row", gap: 2, marginLeft: 4, marginRight: 4 },
  reviewsText: { fontFamily: "Poppins_400Regular", color: "#6B7280", fontSize: 12 },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 },
  metaText: { fontFamily: "Poppins_400Regular", color: "#6B7280", fontSize: 12 },

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
  pin: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  pinAvatar: { width: 36, height: 36, borderRadius: 18 },
});
