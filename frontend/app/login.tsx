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
  Modal,
  Pressable,
} from "react-native";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { login, saveToken } from "../src/lib/auth";

/* Modal simple para errores */
function ErrorModal({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={m.overlay} onPress={onClose}>
        <Pressable style={m.card} onPress={() => {}}>
          <View style={[m.iconCircle, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons name="alert" size={36} color="#B91C1C" />
          </View>
          <Text style={m.title}>No se pudo iniciar sesión</Text>
          <Text style={m.subtitle}>{message}</Text>
          <TouchableOpacity style={m.primaryBtn} onPress={onClose} activeOpacity={0.9}>
            <Text style={m.primaryText}>Cerrar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const onSignIn = () => {
    console.log({ email, password });
  if (!fontsLoaded) return null;

  const onSignIn = async () => {
    if (!email || !password) {
      setErrMsg("Ingresa tu correo y contraseña.");
      setErrOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      await saveToken(res.token);
      router.replace("/home");
    } catch (e: any) {
      // Mensajes típicos de tu backend: "Credenciales inválidas"
      setErrMsg(e?.message || "Ocurrió un error al iniciar sesión.");
      setErrOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.centered}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brand}>HealthPal</Text>
            <Text style={styles.title}>¡Hola, bienvenido de nuevo!</Text>
            <Text style={styles.subtitle}>Esperamos que estés bien.</Text>

            <View style={styles.stack16}>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#9AA3AF" style={styles.inputIcon} />
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
                <Ionicons name="lock-closed-outline" size={18} color="#9AA3AF" style={styles.inputIcon} />
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#9AA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={onSignIn} activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={onSignIn}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.primaryBtnText}>{loading ? "Ingresando..." : "Iniciar sesión"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>o</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.stack12}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9}>
                <Image source={require("../assets/images/google.png")} style={styles.socialIcon} />
                <Text style={styles.socialText}>Ingresar con Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9}>
                <Image source={require("../assets/images/facebook.webp")} style={styles.socialIcon} />
                <Text style={styles.socialText}>Ingresar con Facebook</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              ¿No tienes una cuenta?
              <Text style={styles.link} onPress={() => router.push("/register")}> Regístrate</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de error */}
      <ErrorModal visible={errOpen} message={errMsg} onClose={() => setErrOpen(false)} />
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
  socialText: { fontFamily: "Poppins_600SemiBold", color: COLORS.textDark, fontSize: 14 },
  link: { fontFamily: "Poppins_400Regular", color: COLORS.link, textAlign: "center", marginTop: 2 },
  footerText: { fontFamily: "Poppins_400Regular", color: COLORS.textMid, textAlign: "center", marginTop: 2 },
});

/* estilos del modal de error */
const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryBtn: {
    width: "70%",
    height: 46,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});
