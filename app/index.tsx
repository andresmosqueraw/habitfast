import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import HabitTracker from '@/components/HabitTracker';
import { useState } from 'react';

export default function Index() {
  const [habits, setHabits] = useState([<HabitTracker key={0} />]);

  const addHabit = () => {
    setHabits([...habits, <HabitTracker key={habits.length} />]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mis Hábitos</Text>
        <TouchableOpacity onPress={addHabit} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {habits}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60,
    backgroundColor: '#2a2a2a',
  },
  headerText: {
    color: '#fff',
    fontSize: 28, // Aumenta el tamaño del texto para mayor legibilidad
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ff69b4',
    padding: 12, // Ajusta el padding del botón para que se vea proporcionado
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});