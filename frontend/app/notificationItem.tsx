// NotificationItem.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Notification } from './notifications'; // ajusta ruta si es necesario

interface Props {
  item: Notification;
  onPress?: (event: GestureResponderEvent) => void;
}

/* Configuración de colores e íconos por status */
const STATUS_CONFIG = {
  success: {
    borderColor: '#4CAF50',
    bgColor: '#E8F5E9',
    iconName: 'calendar-check',
  },
  cancelled: {
    borderColor: '#F44336',
    bgColor: '#FFEBEE',
    iconName: 'calendar-remove',
  },
  changed: {
    borderColor: '#607D8B',
    bgColor: '#ECEFF1',
    iconName: 'calendar-edit',
  },
} as const;

const NotificationItem: React.FC<Props> = ({ item, onPress }) => {
  const cfg = STATUS_CONFIG[item.status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View
        style={[
          styles.iconWrapper,
          { borderColor: cfg.borderColor, backgroundColor: cfg.bgColor },
        ]}
      >
        <MaterialCommunityIcons name={cfg.iconName} size={20} color={cfg.borderColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.timeText}>{item.timeAgo}</Text>
        </View>
        <Text style={styles.messageText}>
          {item.message} <Text style={styles.doctorText}>{item.doctor}.</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

/* -------------------- Estilos -------------------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  timeText: {
    fontSize: 12,
    color: '#8a8f98',
  },
  messageText: {
    marginTop: 4,
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  doctorText: {
    fontWeight: '700',
    color: '#222',
  },
});
