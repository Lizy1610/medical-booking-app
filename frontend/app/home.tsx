import { useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageBackground,
} from "react-native";

const W = Dimensions.get("window").width;

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const insets = useSafeAreaInsets();
  const [slide, setSlide] = useState(0);
  const carouselRef = useRef<ScrollView>(null);
  if (!fontsLoaded) return null;

  const slides = [
    {
      id: "s1",
      title: "¿Buscas doctores especialistas?",
      subtitle: "Agenda una cita con nuestros mejores doctores.",
      img: require("../assets/doctors/1409.png"),
    },
    {
      id: "s2",
      title: "Atención médica de calidad",
      subtitle: "Encuentra al especialista indicado para ti.",
      img: require("../assets/doctors/25030.png"),
    },
    {
      id: "s3",
      title: "Agenda fácil y rápida",
      subtitle: "Reserva en minutos desde tu teléfono.",
      img: require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_632e5c2e-ed2d-4cbf-9f2f-3b394f244150.png"),
    },
  ];

  const categories = [
    { id: "1", name: "Odontología", icon: "medkit-outline", bg: "#F5D2D0" },
    { id: "2", name: "Cardiología", icon: "heart-outline", bg: "#D8F1DF" },
    { id: "3", name: "Neumología", icon: "fitness-outline", bg: "#FFD9B0" },
    { id: "4", name: "General", icon: "people-outline", bg: "#E2D8FF" },
    { id: "5", name: "Neurología", icon: "sparkles-outline", bg: "#CBE7E1" },
    {
      id: "6",
      name: "Gastroenter.",
      icon: "restaurant-outline",
      bg: "#DCD6FF",
    },
    { id: "7", name: "Laboratorio", icon: "beaker-outline", bg: "#F7D0D8" },
    { id: "8", name: "Vacunación", icon: "bandage-outline", bg: "#CFEAF4" },
  ];

  const centers = [
    {
      id: "c1",
      name: "Sunrise Health Clinic",
      img: require("../assets/doctors/1409.png"),
    },
    {
      id: "c2",
      name: "Golden Cardiology",
      img: require("../assets/doctors/25030.png"),
    },
    {
      id: "c3",
      name: "Metro Medical Hub",
      img: require("../assets/doctors/interior-reanimation-room-modern-clinic.png"),
    },
  ];

  const doctors = [
    {
      id: "d1",
      name: "Dr. López",
      spec: "Cardiólogo",
      img: require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_0996798e-acc5-48e2-9b18-79c922a9f29b.png"),
    },
    {
      id: "d2",
      name: "Dra. Pérez",
      spec: "Dentista",
      img: require("../assets/doctors/behnazsabaa_Smiling_Doctors_Portrait__Style_of_Her_Film_with_it_6453a87e-ad53-4df3-a535-816164cb1b00.png"),
    },
    {
      id: "d3",
      name: "Dr. García",
      spec: "Neurólogo",
      img: require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_22f8a7ff-a589-4d1b-880a-172332b8a241.png"),
    },
  ];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== slide) setSlide(i);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View style={s.locationRow}>
          <Ionicons name="location" size={18} color="#1F2937" />
          <Text style={s.locationText}>Seattle, USA</Text>
          <Ionicons name="chevron-down" size={16} color="#6B7280" />
        </View>
        <TouchableOpacity style={s.bellWrap} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={24} color="#111827" />
          <View style={s.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[s.container, { paddingBottom: 20 + 70 + insets.bottom }]} showsVerticalScrollIndicator={false}
      >
        <View style={s.searchWrap}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#9AA3AF"
            style={s.searchIcon}
          />
          <TextInput
            placeholder="Buscar doctor..."
            placeholderTextColor="#9AA3AF"
            style={s.searchInput}
          />
        </View>

        <View style={s.carouselWrap}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {slides.map((sl) => (
              <View key={sl.id} style={s.slide}>
                <ImageBackground
                  source={sl.img}
                  style={s.bgImage}
                  imageStyle={s.bgImageRadius}
                >
                  <View style={s.overlay} />
                  <View style={s.slideText}>
                    <Text style={s.heroTitle}>{sl.title}</Text>
                    <Text style={s.heroSub}>{sl.subtitle}</Text>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
          <View style={s.dotsRow}>
            {slides.map((_, i) => (
              <View key={i} style={[s.dot, i === slide && s.dotActive]} />
            ))}
          </View>
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Categorías</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          keyExtractor={(i) => i.id}
          numColumns={4}
          columnWrapperStyle={s.catRow}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={[s.catItem, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon as any} size={22} color="#1F2937" />
              <Text numberOfLines={1} style={s.catText}>
                {item.name}
              </Text>
            </View>
          )}
        />

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Centros médicos cercanos</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>

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
                    <Ionicons
                      name="navigate-outline"
                      size={14}
                      color="#6B7280"
                    />
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

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Doctores</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={doctors}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.hList}
          renderItem={({ item }) => (
            <View style={s.docCard}>
              <Image source={item.img} style={s.docAvatar} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={s.docName}>
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={s.docSpec}>
                  {item.spec}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={{ height: 16 }} />
      </ScrollView>
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.tabButton} activeOpacity={0.8} onPress={() => router.push("/home")}>
          <View style={s.tabIconActiveBg}>
            <Ionicons name="home" size={18} color="#111827" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.tabButton} activeOpacity={0.8} onPress={() => router.push("/location")}>
          <Ionicons name="location-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={s.tabButton} activeOpacity={0.8} onPress={() => router.push("/bookings")}>
          <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={s.tabButton} activeOpacity={0.8}>
          <Ionicons name="person-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#111827",
  textMid: "#6B7280",
  card: "#F3F4F6",
  primaryDark: "#0F172A",
  border: "#E5E7EB",
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  bellWrap: { position: "relative", padding: 4 },
  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },

  container: { paddingHorizontal: 20, paddingBottom: 20, gap: 18 },

  searchWrap: {
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
  },
  searchIcon: { position: "absolute", left: 12, top: 13 },
  searchInput: {
    paddingLeft: 38,
    paddingRight: 12,
    fontFamily: "Poppins_400Regular",
    color: COLORS.text,
    fontSize: 14,
  },

  carouselWrap: { width: "100%" },
  slide: {
    width: W - 40,
    height: 160,
    borderRadius: 16,
    alignSelf: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  bgImage: { width: "100%", height: "100%", justifyContent: "flex-end" },
  bgImageRadius: { borderRadius: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  slideText: {
    padding: 16,
    gap: 6,
  },
  heroTitle: {
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
  heroSub: { fontFamily: "Poppins_400Regular", color: "#E5E7EB", fontSize: 12 },

  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    marginTop: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#CBD5E1" },
  dotActive: { backgroundColor: COLORS.primaryDark },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    color: COLORS.text,
    fontSize: 16,
  },
  seeAll: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.textMid,
    fontSize: 12,
  },

  catRow: { justifyContent: "space-between", marginBottom: 12 },
  catItem: {
    width: (W - 40 - 12 * 3) / 4,
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  catText: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.text,
    fontSize: 11,
    textAlign: "center",
  },

  hList: { gap: 12 },

  centerCard: {
    width: 240,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  centerImgWrap: { width: "100%", height: 120, overflow: "hidden" },
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
  centerName: {
    fontFamily: "Poppins_700Bold",
    color: COLORS.text,
    fontSize: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerAddr: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    fontSize: 12,
    flex: 1,
  },
  ratingText: {
    fontFamily: "Poppins_700Bold",
    color: COLORS.text,
    fontSize: 12,
  },
  starsRow: { flexDirection: "row", gap: 2, marginLeft: 4, marginRight: 4 },
  reviewsText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    fontSize: 12,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 6 },
  metaText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    fontSize: 12,
  },

  docCard: {
    width: 240,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  docAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
  },
  docName: { fontFamily: "Poppins_700Bold", color: COLORS.text, fontSize: 14 },
  docSpec: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    fontSize: 12,
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
});
