// en app/favorites/_layout.tsx
import { Stack, withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function FavoritesLayout() {
  return (
    <>
      {/* Esto asegura que el título 'Favoritos' aparezca en la barra de navegación */}
      <Stack.Screen options={{ title: 'Favoritos', headerShown: true }} />
      <TopTabs
        screenOptions={{
          tabBarActiveTintColor: '#0D1B2A',
          tabBarInactiveTintColor: '#778DA9',
          tabBarIndicatorStyle: {
            backgroundColor: '#0D1B2A',
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          },
        }}
      >
        <TopTabs.Screen name="Doctores" options={{ title: 'Doctores' }} />
        <TopTabs.Screen name="Hospitales" options={{ title: 'Hospitales' }} />
      </TopTabs>
    </>
  );
}