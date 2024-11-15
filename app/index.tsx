import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Modal, TextInput, Button, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import HabitTracker from '@/components/HabitTracker';

interface Habit {
  title: string;
  description: string;
}

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openModal = (index: number | null = null) => {
    if (index !== null) {
      setNewHabitTitle(habits[index].title);
      setNewHabitDescription(habits[index].description);
      setEditIndex(index);
    } else {
      setNewHabitTitle('');
      setNewHabitDescription('');
      setEditIndex(null);
    }
    setModalVisible(true);
  };

  const addOrEditHabit = () => {
    if (editIndex !== null) {
      // Edit habit
      const updatedHabits = [...habits];
      updatedHabits[editIndex] = { title: newHabitTitle, description: newHabitDescription };
      setHabits(updatedHabits);
    } else {
      // Add new habit
      const newHabit: Habit = { title: newHabitTitle, description: newHabitDescription };
      setHabits([...habits, newHabit]);
    }
    setModalVisible(false);
  };

  const deleteHabit = () => {
    if (editIndex !== null) {
      Alert.alert(
        "Eliminar Hábito",
        "¿Estás seguro de que deseas eliminar este hábito?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: () => {
            const updatedHabits = habits.filter((_, index) => index !== editIndex);
            setHabits(updatedHabits);
            setModalVisible(false);
          }}
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HabitFast</Text>
        <TouchableOpacity onPress={() => openModal()} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
        {habits.map((habit, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(index)}>
            <HabitTracker title={habit.title} description={habit.description} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editIndex !== null ? 'Editar Hábito' : 'Nuevo Hábito'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Título del Hábito"
              placeholderTextColor="#aaa"
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#aaa"
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="#999" onPress={() => setModalVisible(false)} />
              {editIndex !== null && (
                <Button title="Eliminar" color="#d9534f" onPress={deleteHabit} />
              )}
              <Button title="Guardar" color="#ff69b4" onPress={addOrEditHabit} />
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ff69b4',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro transparente
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});