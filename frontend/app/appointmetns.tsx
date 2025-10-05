import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { router } from "expo-router";

LocaleConfig.locales.es = {
  monthNames: [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre",
  ],
  monthNamesShort: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
  dayNames: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
  dayNamesShort: ["dom","lun","mar","mié","jue","vie","sáb"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

const COLORS = {
  bg: "#FFFFFF",
  text: "#0F172A",
  textMid: "#64748B",
  border: "#E5E7EB",
  chipBg: "#F3F4F6",
  primary: "#111827",
  overlay: "rgba(0,0,0,0.45)",
};

const HOURS = [
  "09:00 AM","09:30 AM","10:00 AM",
  "10:30 AM","11:00 AM","11:30 AM",
  "03:00 PM","03:30 PM","04:00 PM",
  "04:30 PM","05:00 PM","05:30 PM",
];

export default function BookAppointmentScreen() {
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { width: winW } = useWindowDimensions();
  const H_GAP = 12;
  const COLS = 3;
  const horizontalPadding = 20;
  const chipWidth = useMemo(() => {
    const inner = winW - horizontalPadding * 2 - H_GAP * (COLS - 1);
    return inner / COLS;
  }, [winW]);

  const marked = date
    ? { [date]: { selected: true, selectedColor: COLORS.primary, selectedTextColor: "#fff" } }
    : undefined;

  const onPressDay = (d: DateData) => {
    setDate(d.dateString);
    setSlot(null);
  };

  const onConfirm = () => {
    if (date && slot) setOpen(true);
  };

  const humanDate = (() => {
    if (!date) return "";
    const [y, m, d] = date.split("-").map(Number);
    const fmt = new Date(y, m - 1, d).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return fmt;
  })();

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Reservar cita</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Selecciona fecha</Text>
        <View style={s.card}>
          <Calendar
            onDayPress={onPressDay}
            markedDates={marked}
            theme={{
              textMonthFontWeight: "700",
              textMonthFontSize: 14,
              arrowColor: COLORS.text,
              todayTextColor: COLORS.primary,
              textDayFontSize: 14,
              textDayHeaderFontSize: 12,
            }}
            style={{ borderRadius: 16 }}
          />
        </View>

        <Text style={[s.sectionTitle, { marginTop: 10 }]}>Selecciona hora</Text>

        <View style={[s.timeGrid, { columnGap: H_GAP, rowGap: H_GAP }]}>
          {HOURS.map((h) => {
            const selected = h === slot;
            return (
              <TouchableOpacity
                key={h}
                style={[
                  s.timeChip,
                  { width: chipWidth },
                  selected && s.timeChipSelected,
                ]}
                activeOpacity={0.9}
                onPress={() => setSlot(h)}
              >
                <Text style={[s.timeChipText, selected && s.timeChipTextSelected]}>{h}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={s.footerBar}>
        <TouchableOpacity
          style={[
            s.primaryBtn,
            !(date && slot) && { backgroundColor: "#9CA3AF" },
          ]}
          activeOpacity={0.9}
          disabled={!(date && slot)}
          onPress={onConfirm}
        >
          <Text style={s.primaryBtnText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={s.modalCard}>
            <View style={s.modalIconWrap}>
              <View style={s.modalIconInner}>
                <Ionicons name="checkmark-done" size={28} color={COLORS.primary} />
              </View>
            </View>

            <Text style={s.modalTitle}>¡Listo!</Text>
            <Text style={s.modalText}>
              Tu cita con <Text style={{ fontWeight: "700" }}>Dr. David Patel</Text> está confirmada para{" "}
              <Text style={{ fontWeight: "700" }}>{humanDate}</Text>, a las{" "}
              <Text style={{ fontWeight: "700" }}>{slot}</Text>.
            </Text>

            <TouchableOpacity style={s.modalPrimary} activeOpacity={0.9} onPress={() => router.replace("/home")}>
              <Text style={s.modalPrimaryText}>Hecho</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpen(false)} activeOpacity={0.8}>
              <Text style={s.modalLink}>Editar tu cita</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: 25,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, color: COLORS.text, fontWeight: "700" },

  container: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 12 },

  sectionTitle: { fontSize: 16, color: COLORS.text, fontWeight: "700" },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    padding: 6,
  },

  timeGrid: { flexDirection: "row", flexWrap: "wrap" },
  timeChip: {
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  timeChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipText: { color: COLORS.text, fontWeight: "600" },
  timeChipTextSelected: { color: "#fff" },

  footerBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  backdrop: { flex: 1, backgroundColor: COLORS.overlay, alignItems: "center", justifyContent: "center", padding: 20 },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingBottom: 20,
    paddingTop: 28,
    alignItems: "center",
  },
  modalIconWrap: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#D9E6E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 4, marginBottom: 8 },
  modalText: { color: COLORS.textMid, textAlign: "center", lineHeight: 20, marginBottom: 16, fontSize: 16 },
  modalPrimary: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginBottom: 10,
  },
  modalPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalLink: { color: COLORS.textMid, fontWeight: "600" },
});
