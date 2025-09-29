import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { register } from "../src/lib/auth";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

export default function ProfileSetupScreen() {
  const params = useLocalSearchParams<{ name?: string; email?: string; password?: string }>();
  const [nick, setNick] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [gender, setGender] = useState<string>("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) return null;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!params.name || !params.email || !params.password) return;
    if (!nick) return;
    setLoading(true);
    try {
      const payload = {
        name: String(params.name),
        username: nick,
        email: String(params.email),
        password: String(params.password),
        dateOfBirth: dob ? dob.toISOString().slice(0, 10) : undefined,
        gender: (gender || undefined) as any,
      };
      await register(payload);
      router.replace("/login");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Completa tu perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarBox}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={54} color="#CBD5E1" />
              </View>
            )}
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.9} onPress={pickImage}>
              <Ionicons name="create-outline" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.stack16}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Apodo"
                placeholderTextColor="#9AA3AF"
                value={nick}
                onChangeText={setNick}
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDate(true)} activeOpacity={0.9}>
              <Ionicons name="calendar-clear-outline" size={18} color="#9AA3AF" style={styles.leftIcon} />
              <View pointerEvents="none">
                <TextInput
                  placeholder="Fecha de nacimiento"
                  placeholderTextColor="#9AA3AF"
                  value={dob ? new Date(dob).toLocaleDateString() : ""}
                  style={[styles.input, styles.inputWithIcon]}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.inputWrapper} onPress={() => setGenderOpen(true)} activeOpacity={0.9}>
              <View pointerEvents="none">
                <TextInput
                  placeholder="Género"
                  placeholderTextColor="#9AA3AF"
                  value={gender}
                  style={styles.input}
                  editable={false}
                />
              </View>
              <Ionicons name="chevron-down" size={18} color="#9AA3AF" style={styles.rightIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={onSave} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDate && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            onChange={(_, selected) => {
              setShowDate(false);
              if (selected) setDob(selected);
            }}
            maximumDate={new Date()}
          />
        )}

        <Modal visible={genderOpen} transparent animationType="fade" onRequestClose={() => setGenderOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setGenderOpen(false)}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Selecciona tu género</Text>
              <View style={styles.modalList}>
                {["Hombre", "Mujer", "Prefiero no decirlo", "Otro"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.modalItem}
                    onPress={() => {
                      setGender(opt);
                      setGenderOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setGenderOpen(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  bg: "#FFFFFF",
  textDark: "#111827",
  textMid: "#6B7280",
  inputBg: "#F3F4F6",
  inputBorder: "#E5E7EB",
  primary: "#0F172A",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 6,
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: COLORS.textDark,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  avatarBox: {
    alignSelf: "center",
    width: 140,
    height: 140,
    marginTop: 6,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  editBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stack16: {
    display: "flex",
    gap: 16,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    fontFamily: "Poppins_400Regular",
    color: COLORS.textDark,
    fontSize: 14,
  },
  inputWithIcon: {
    paddingLeft: 42,
  },
  leftIcon: {
    position: "absolute",
    left: 14,
    top: 16,
  },
  rightIcon: {
    position: "absolute",
    right: 14,
    top: 16,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalList: {
    gap: 6,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalItemText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.textDark,
  },
  modalCancel: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.textMid,
    fontSize: 14,
  },
});
