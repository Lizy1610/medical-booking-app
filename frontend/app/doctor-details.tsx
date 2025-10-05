import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  bg: "#FFFFFF",
  text: "#0F172A",
  textMid: "#64748B",
  textLight: "#94A3B8",
  border: "#E5E7EB",
  primary: "#111827",
  star: "#F59E0B",
  iconBg: "#EEF2F7",
};

const aboutLong =
  "El Dr. David Patel, cardiólogo con amplia experiencia, aporta un gran conocimiento al Golden Gate Cardiology Center en Golden Gate, CA. Se especializa en prevención cardiovascular, control de hipertensión, arritmias y rehabilitación cardiaca. Ha liderado estudios clínicos y es reconocido por su trato humano y cercano. ";

const allReviews = [
  {
    id: "r1",
    author: "Emily Anderson",
    rating: 5,
    text:
      "El Dr. Patel es un profesional que realmente se preocupa por sus pacientes. Recomiendo ampliamente su atención por su claridad y empatía.",
    avatar: require("../assets/doctors/1409.png"),
  },
  {
    id: "r2",
    author: "Juan Pérez",
    rating: 4.5,
    text:
      "Muy buena atención y explicación del tratamiento. La consulta inició puntual y resolvió mis dudas.",
    avatar: require("../assets/doctors/25030.png"),
  },
  {
    id: "r3",
    author: "María López",
    rating: 5,
    text:
      "Excelente especialista. El seguimiento fue muy completo y me sentí acompañada en todo momento.",
    avatar: require("../assets/doctors/behnazsabaa_Smiling_Doctors_Portrait__Style_of_Her_Film_with_it_6453a87e-ad53-4df3-a535-816164cb1b00.png"),
  },
];

export default function DoctorDetailsScreen() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const reviewsToShow = showAllReviews ? allReviews : allReviews.slice(0, 3);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Detalles del doctor</Text>
          <TouchableOpacity hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <Ionicons name="heart-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
          <View style={s.cardDoctor}>
            <Image
              source={require("../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_632e5c2e-ed2d-4cbf-9f2f-3b394f244150.png")}
              style={s.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={s.docName}>Dr. David Patel</Text>
              <View style={s.cardDivider} />
              <Text style={s.docSpec}>Cardiólogo</Text>
              <View style={s.row}>
                <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
                <Text style={s.docPlace}>Golden Cardiology Center</Text>
              </View>
            </View>
          </View>

          <View style={s.metricsRow}>
            <View style={s.metricItem}>
              <View style={s.metricIcon}>
                <Ionicons name="people-outline" size={20} color={COLORS.text} />
              </View>
              <Text style={s.metricNumber}>2,000+</Text>
              <Text style={s.metricLabel}>pacientes</Text>
            </View>

            <View style={s.metricItem}>
              <View style={s.metricIcon}>
                <Ionicons name="briefcase-outline" size={20} color={COLORS.text} />
              </View>
              <Text style={s.metricNumber}>10+</Text>
              <Text style={s.metricLabel}>años exp.</Text>
            </View>

            <View style={s.metricItem}>
              <View style={s.metricIcon}>
                <Ionicons name="star" size={20} color={COLORS.star} />
              </View>
              <Text style={s.metricNumber}>5</Text>
              <Text style={s.metricLabel}>calificación</Text>
            </View>

            <View style={s.metricItem}>
              <View style={s.metricIcon}>
                <Ionicons name="chatbubbles-outline" size={20} color={COLORS.text} />
              </View>
              <Text style={s.metricNumber}>1,872</Text>
              <Text style={s.metricLabel}>reseñas</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Sobre mí</Text>
            <Text style={s.sectionText} numberOfLines={aboutExpanded ? undefined : 3}>
              {aboutLong}
            </Text>
            <TouchableOpacity onPress={() => setAboutExpanded((v) => !v)} activeOpacity={0.8}>
              <Text style={s.link}>{aboutExpanded ? "ver menos" : "ver más"}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Horario de atención</Text>
            <Text style={s.sectionText}>Lunes a Viernes, 08:00 a 18:00 hrs</Text>
          </View>

          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>Reseñas</Text>
            <TouchableOpacity onPress={() => setShowAllReviews((v) => !v)}>
              <Text style={s.link}>{showAllReviews ? "ver menos" : "ver todo"}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            {reviewsToShow.map((r) => {
              const full = Math.floor(r.rating);
              const half = r.rating - full >= 0.5;
              const empty = 5 - full - (half ? 1 : 0);
              const ratingLabel = Number.isInteger(r.rating) ? r.rating.toFixed(0) : r.rating.toFixed(1);

              return (
                <View key={r.id} style={s.reviewCard}>
                  <Image source={r.avatar} style={s.reviewAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.reviewAuthor}>{r.author}</Text>
                    <View style={s.ratingRow}>
                      {Array.from({ length: full }).map((_, i) => (
                        <Ionicons key={`f${i}`} name="star" size={14} color={COLORS.star} style={{ marginRight: 2 }} />
                      ))}
                      {half && <Ionicons name="star-half" size={14} color={COLORS.star} style={{ marginRight: 2 }} />}
                      {Array.from({ length: empty }).map((_, i) => (
                        <Ionicons key={`e${i}`} name="star-outline" size={14} color={COLORS.star} style={{ marginRight: 2 }} />
                      ))}
                      <Text style={s.ratingNumber}>{ratingLabel}</Text>
                    </View>
                    <Text style={s.reviewText}>{r.text}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Escribe una reseña</Text>
            <TextInput
              style={s.inputReview}
              placeholder="Comparte tu experiencia..."
              placeholderTextColor={COLORS.textLight}
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            <TouchableOpacity style={s.btnOutline} activeOpacity={0.85}>
              <Text style={s.btnOutlineText}>Publicar reseña</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 70 }} />
        </ScrollView>

        <View style={s.footerBar}>
          <TouchableOpacity style={s.primaryBtn} activeOpacity={0.9} onPress={() => router.push("/appointments")}>
            <Text style={s.primaryBtnText}>Reservar cita</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  android: { elevation: 10 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 18,
  },
  cardDoctor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    ...shadow,
  },
  avatar: { width: 100, height: 100, borderRadius: 16, backgroundColor: "#E2E8F0" },
  docName: { fontSize: 18, color: COLORS.text, fontWeight: "700" },
  cardDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  docSpec: { fontSize: 14, color: COLORS.textMid, marginBottom: 5 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  docPlace: { fontSize: 12, color: COLORS.textLight },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metricItem: {
    width: "23%",
    alignItems: "center",
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.iconBg,
    marginBottom: 8,
  },
  metricNumber: { fontSize: 14, color: COLORS.text, fontWeight: "700", textAlign: "center" },
  metricLabel: { fontSize: 11, color: COLORS.textMid, textAlign: "center" },

  section: { gap: 8, marginTop: 4 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  sectionTitle: { fontSize: 16, color: COLORS.text, fontWeight: "700" },
  sectionText: { fontSize: 14, color: COLORS.textMid, lineHeight: 20 },
  link: { color: "#2563EB", fontSize: 13, fontWeight: "600" },

  reviewCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  reviewAuthor: { fontSize: 14, color: COLORS.text, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  ratingNumber: { marginLeft: 6, color: COLORS.textMid, fontSize: 12, fontWeight: "600" },
  reviewText: { fontSize: 13, color: COLORS.textMid, lineHeight: 18 },

  inputReview: {
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
    padding: 12,
    textAlignVertical: "top",
    color: COLORS.text,
    fontSize: 14,
  },
  btnOutline: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  btnOutlineText: { color: COLORS.text, fontWeight: "700", fontSize: 14 },

  footerBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
