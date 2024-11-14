import { ScrollView, View } from "react-native";
import HabitTracker from '@/components/HabitTracker';

export default function Index() {
  return (
    <ScrollView 
      contentContainerStyle={{ paddingVertical: 20 }}
      showsVerticalScrollIndicator={false} // Oculta el indicador de desplazamiento vertical
    >
      <HabitTracker />
      <HabitTracker />
      <HabitTracker />
      {/* Agrega más HabitTracker según sea necesario */}
    </ScrollView>
  );
}