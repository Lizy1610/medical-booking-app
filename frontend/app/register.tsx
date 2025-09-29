import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const onRegister = () => {
    if (!name || !email || !password) return;
    router.push({
      pathname: "/profile-setup",
      params: { name, email, password },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.centered}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>HealthPal</Text>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Estamos aquí para ayudarte.</Text>

            <View style={styles.stack16}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#9AA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Tu nombre"
                  placeholderTextColor="#9AA3AF"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#9AA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Tu correo"
                  placeholderTextColor="#9AA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#9AA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#9AA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={onRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>o</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.stack12}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9}>
                <Image
                  source={require("../assets/images/google.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Continuar con Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9}>
                <Image
                  source={require("../assets/images/facebook.webp")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Continuar con Facebook</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              ¿Ya tienes una cuenta?
              <Text style={styles.link} onPress={() => router.push("/login")}>
                {" "}
                Inicia sesión
              </Text>
            </Text>
          </View>
        </ScrollView>
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
  divider: "#E5E7EB",
  link: "#2563EB",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  centered: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "center",
  },
  card: {
    alignSelf: "stretch",
    alignItems: "stretch",
    gap: 18,
  },
  logo: {
    width: 72,
    height: 72,
    alignSelf: "center",
    marginBottom: 6,
  },
  brand: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: COLORS.textMid,
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: COLORS.textDark,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.textMid,
    textAlign: "center",
    marginTop: -6,
    marginBottom: 8,
  },
  stack16: {
    display: "flex",
    gap: 16,
    marginTop: 4,
  },
  stack12: {
    display: "flex",
    gap: 12,
  },
  inputWrapper: { position: "relative" },
  inputIcon: { position: "absolute", left: 14, top: 16 },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingLeft: 42,
    paddingRight: 14,
    fontFamily: "Poppins_400Regular",
    color: COLORS.textDark,
    fontSize: 14,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  divider: { height: 1, backgroundColor: COLORS.divider, flex: 1 },
  orText: {
    marginHorizontal: 12,
    color: COLORS.textMid,
    fontFamily: "Poppins_400Regular",
  },
  socialBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialIcon: { width: 22, height: 22, marginRight: 6, resizeMode: "contain" },
  socialText: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.textDark,
    fontSize: 14,
  },
  link: { fontFamily: "Poppins_400Regular", color: COLORS.link },
  footerText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.textMid,
    textAlign: "center",
    marginTop: 2,
  },
});
