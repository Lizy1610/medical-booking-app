// NotificationScreen.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationItem from './notificationItem';
import Feather from 'react-native-vector-icons/Feather';

/* -------------------- Tipos y Datos -------------------- */
export type StatusType = 'success' | 'cancelled' | 'changed';

export interface Notification {
  id: string;
  status: StatusType;
  title: string;
  message: string;
  doctor: string;
  timeAgo: string;
  dateGroup: 'HOY' | 'AYER';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    status: 'success',
    title: 'Reserva Exitosa',
    message: 'Ha reservado exitosamente su cita con',
    doctor: 'Dr. David Patel',
    timeAgo: '1h',
    dateGroup: 'HOY',
  },
  {
    id: 'n2',
    status: 'changed',
    title: 'Horario Cambiado',
    message: 'Se ha actualizado el horario de su cita con',
    doctor: 'Dra. María López',
    timeAgo: '3h',
    dateGroup: 'HOY',
  },
  {
    id: 'n3',
    status: 'cancelled',
    title: 'Cita Cancelada',
    message: 'Su cita fue cancelada por',
    doctor: 'Dr. José Hernández',
    timeAgo: '1d',
    dateGroup: 'AYER',
  },
  {
    id: 'n4',
    status: 'changed',
    title: 'Horario Cambiado',
    message: 'Se ha cambiado el horario de su cita con',
    doctor: 'Dra. Ana Gómez',
    timeAgo: '2d',
    dateGroup: 'AYER',
  },
];

/* -------------------- Pantalla -------------------- */
type HeaderRow = { type: 'header'; id: string; title: string };
type ItemRow = { type: 'item'; data: Notification };
type FlatRow = HeaderRow | ItemRow;

const groupAndFlatten = (items: Notification[]): FlatRow[] => {
  const groups: Record<string, Notification[]> = {};
  items.forEach((it) => {
    groups[it.dateGroup] = groups[it.dateGroup] || [];
    groups[it.dateGroup].push(it);
  });

  const order = ['HOY', 'AYER'];
  const flat: FlatRow[] = [];

  order.forEach((groupKey) => {
    const groupItems = groups[groupKey];
    if (groupItems && groupItems.length > 0) {
      flat.push({ type: 'header', id: `header-${groupKey}`, title: groupKey });
      groupItems.forEach((it) => flat.push({ type: 'item', data: it }));
    }
  });

  return flat;
};

const NotificationScreen: React.FC = () => {
  const data = MOCK_NOTIFICATIONS;
  const flatData = useMemo(() => groupAndFlatten(data), [data]);

  const handlePressNotification = (n: Notification) => {
    console.log('Notificación pulsada:', n.id);
  };

  const handleMarkAllRead = (sectionTitle: string) => {
    console.log('Marcar todo como leído en sección:', sectionTitle);
  };

  const renderItem = ({ item }: { item: FlatRow }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{item.title}</Text>
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => handleMarkAllRead(item.title)}
          >
            <Text style={styles.markAllText}>Marcar todo como leído</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <NotificationItem
        item={item.data}
        onPress={() => handlePressNotification(item.data)}
      />
    );
  };

  const keyExtractor = (item: FlatRow) => {
    return item.type === 'header' ? item.id : item.data.id;
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => console.log('Volver')}>
          <Feather name="arrow-left" size={20} color="#222" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>1 Nuevo</Text>
          </View>
        </View>
      </View>

      {/* Lista de notificaciones */}
      <FlatList
        data={flatData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

/* -------------------- Estilos -------------------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  newBadge: {
    marginTop: 30, // debajo del título
    backgroundColor: '#111827',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
    borderWidth: 1,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  listContent: {
    paddingBottom: 24,
    backgroundColor: '#F7F8FA',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8FA',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5a5f66',
  },
  markAllButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 13,
    color: '#222',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 76,
  },
});
